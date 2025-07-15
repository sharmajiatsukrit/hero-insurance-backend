import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import moment from "moment";

import { removeObjectKeys, serverResponse, serverErrorHandler, removeSpace, constructResponseMsg, serverInvalidRequest, groupByDate } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import EmailService from "../../../utils/email";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import Category from "../../../models/category";
import Blog from "../../../models/blog";
import Location from "../../../models/location";

const fileName = "[admin][blog][index.ts]";

const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

export default class BlogController {
    public locale: string = "en";
    public emailService;

    constructor() {
        this.emailService = new EmailService();
    }

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getList]";
            const { locale, page, limit, search, status, category } = req.query;
            this.locale = (locale as string) || "en";

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            let searchQuery: any = {};

            if (search) {
                searchQuery.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }, { slug: { $regex: search, $options: "i" } }];
            }

            if (status !== undefined) {
                searchQuery.status = status === "true";
            }

            if (category) {
                const categoryDoc = await Category.findOne({ id: category }).lean();
                if (categoryDoc) {
                    searchQuery.categoryId = categoryDoc._id;
                }
            }

            const results = await Blog.find(searchQuery)
                .populate("created_by", "name email")
                .populate("categoryId", "id name")
                .populate("locationId","location latitude longitude")
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean();
            let formattedResults: any[] = [];

            if (results.length > 0) {
                formattedResults = results.map((item: any) => ({
                    ...item,
                    blog_image: item.blog_image ? `${process.env.RESOURCE_URL}${item.blog_image}` : null,
                }));
            }
            const totalCount = await Blog.countDocuments(searchQuery);
            const totalPages = Math.ceil(totalCount / limitNumber);

            return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-fetched"]), {
                data: formattedResults,
                totalCount,
                totalPages,
                currentPage: pageNumber,
            });
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getById(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getById]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);

            const result: any = await Blog.findOne({ id: id }).populate("created_by", "name email").populate("updated_by", "name email").populate("categoryId", "id name").populate("locationId","location latitude longitude").lean();

            if (result) {
                result.blog_image = result.blog_image ? `${process.env.RESOURCE_URL}${result.blog_image}` : null;
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async add(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { name, description, slug, categoryId, status, locationId } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);
            const existingBlog = await Blog.findOne({ name: name }).lean();
            if (existingBlog) {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-already-exists"]));
            }
            let blogSlug = slug || generateSlug(name);
            let blog_image: any;
            if (req.file) {
                blog_image = req?.file?.filename;
                // let resultimage: any = await Category.findOneAndUpdate({ id: result.id }, { cat_img: cat_img });
            }
            let categoryd: any = null;
            let categoryObjectId = null;
            let locationData: any = null;
            let locationObjId: any = null;

            if (categoryId) {
                categoryd = await Category.findOne({ id: categoryId }).lean();
                Logger.info(`${fileName + fn} Found category: ${JSON.stringify(categoryd)}`);
                categoryObjectId = categoryd._id;
            }
            if (locationId) {
                locationData = await Location.findOne({ id: locationId }).lean();
                locationObjId = locationData._id;
            }

            const result: any = await Blog.create({
                name: name,
                description: description,
                blog_image: blog_image,
                slug: blogSlug,
                categoryId: categoryObjectId,
                locationId:locationObjId,
                status: status || 1,
                created_by: req.user?.object_id,
            });

            Logger.info(`${fileName + fn} Created blog: ${JSON.stringify(result)}`);

            const categoryInfo = categoryd
                ? {
                      id: categoryd.id,
                      name: categoryd.name,
                  }
                : {};

            let createdByInfo = null;

            const responseData = {
                id: result.id,
                name: result.name,
                description: result.description,
                blogImage: result.blog_image,
                slug: result.slug,
                categoryId: categoryInfo,
                status: result.status,
                createdBy: createdByInfo,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
            };

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "blog-add"), responseData);
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[update]";
            const id = parseInt(req.params.id);
            Logger.info(`${fileName + fn} blog_id: ${id}`);

            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { name, description, slug, categoryId, status, locationId } = req.body;

            const existingBlog = await Blog.findOne({ id }).lean();
            if (!existingBlog) {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }

            if (name && name !== existingBlog.name) {
                const duplicateBlog = await Blog.findOne({ name, id: { $ne: id } }).lean();
                if (duplicateBlog) {
                    throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-already-exists"]));
                }
            }

            const updateData: any = {
                updated_by: req.user.object_id,
            };

            // Handle image
            if (req.file?.filename) {
                updateData.blog_image = req.file.filename;
            }

            // Optional fields
            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (status !== undefined) updateData.status = status;

            // Category and location references
            let categoryd: any = null;
            if (categoryId) {
                categoryd = await Category.findOne({ id: categoryId }).lean();
                if (categoryd) {
                    updateData.categoryId = categoryd._id;
                }
            }

            let locationData: any = null;
            if (locationId) {
                locationData = await Location.findOne({ id: locationId }).lean();
                if (locationData) {
                    updateData.locationId = locationData._id;
                }
            }

            // Slug logic
            if (slug !== undefined) {
                const slugExists = await Blog.findOne({ slug, id: { $ne: id } }).lean();
                if (slugExists) {
                    throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["slug-already-exists"]));
                }
                updateData.slug = slug;
            } else if (name && name !== existingBlog.name) {
                let newSlug = generateSlug(name);
                let slugExists = await Blog.findOne({ slug: newSlug, id: { $ne: id } }).lean();
                let counter = 1;
                const originalSlug = newSlug;

                while (slugExists) {
                    newSlug = `${originalSlug}-${counter}`;
                    slugExists = await Blog.findOne({ slug: newSlug, id: { $ne: id } }).lean();
                    counter++;
                }

                updateData.slug = newSlug;
            }

            Logger.info(`${fileName + fn} updateData: ${JSON.stringify(updateData)}`);

            await Blog.findOneAndUpdate({ id }, updateData);

            const updatedBlog: any = await Blog.findOne({ id }).populate("created_by", "name email").populate("updated_by", "name email").populate("categoryId", "id name").lean();

            const responseData = {
                id: updatedBlog.id,
                name: updatedBlog.name,
                description: updatedBlog.description,
                blogImage: updatedBlog.blog_image,
                slug: updatedBlog.slug,
                categoryId: updatedBlog.categoryId ? { id: updatedBlog.categoryId.id, name: updatedBlog.categoryId.name } : null,
                status: updatedBlog.status,
                createdBy: updatedBlog.created_by,
                updatedBy: updatedBlog.updated_by,
                createdAt: updatedBlog.createdAt,
                updatedAt: updatedBlog.updatedAt,
            };

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "blog-update"), responseData);
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async delete(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[delete]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const id = parseInt(req.params.id);
            const existingBlog = await Blog.findOne({ id: id }).lean();
            if (!existingBlog) {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
            const result = await Blog.deleteOne({ id: id });

            if (result.deletedCount > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-delete"]), { deletedCount: result.deletedCount });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getCategories(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getCategories]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const categories = await Blog.distinct("category", { category: { $ne: "" } });

            return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-fetched"]), {
                categories: categories,
            });
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
    public async getBySlug(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getBySlug]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const slug = req.params.slug;
            const result: any = await Blog.findOne({ slug: slug }).populate("created_by", "name email").populate("updated_by", "name email").lean();

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
    public async status(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[status]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const id = parseInt(req.params.id);
            const { status } = req.body;
            const updationstatus = await Blog.findOneAndUpdate({ id: id }, { status: status });
            const updatedData: any = await Blog.findOne({ id: id }).lean();
            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-status"]), updatedData);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
