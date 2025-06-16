import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import moment from "moment";
import { Blog } from "../../../models";
import { removeObjectKeys, serverResponse, serverErrorHandler, removeSpace, constructResponseMsg, serverInvalidRequest, groupByDate } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import EmailService from "../../../utils/email";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";

const fileName = "[admin][blog][index.ts]";

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
     // .trim("-"); // Remove leading/trailing hyphens
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

    // Get all blogs with pagination and search
    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getList]";
            // Set locale
            const { locale, page, limit, search, status, category } = req.query;
            this.locale = (locale as string) || "en";

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            let searchQuery: any = {};

            // Search functionality
            if (search) {
                searchQuery.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { slug: { $regex: search, $options: "i" } },
                    { category: { $regex: search, $options: "i" } },
                ];
            }

            // Status filter
            if (status !== undefined) {
                searchQuery.status = status === "true";
            }

            // Category filter
            if (category) {
                searchQuery.category = { $regex: category, $options: "i" };
            }

            const results = await Blog.find(searchQuery)
                .populate("created_by", "name email")
                .populate("updated_by", "name email")
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean();

            const totalCount = await Blog.countDocuments(searchQuery);
            const totalPages = Math.ceil(totalCount / limitNumber);

            if (results.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-fetched"]), {
                    data: results,
                    totalCount,
                    totalPages,
                    currentPage: pageNumber,
                });
            } else {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-fetched"]), {
                    data: [],
                    totalCount: 0,
                    totalPages: 0,
                    currentPage: pageNumber,
                });
            }
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
            const result: any = await Blog.findOne({ id: id }).populate("created_by", "name email").populate("updated_by", "name email").lean();

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Get blog by slug
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

    public async add(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { name, description, image, slug, category, status } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);
            const existingBlog = await Blog.findOne({ name: name }).lean();
            if (existingBlog) {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-already-exists"]));
            }
            let blogSlug = slug || generateSlug(name);
            let slugExists = await Blog.findOne({ slug: blogSlug }).lean();
            let counter = 1;
            const originalSlug = blogSlug;

            while (slugExists) {
                blogSlug = `${originalSlug}-${counter}`;
                slugExists = await Blog.findOne({ slug: blogSlug }).lean();
                counter++;
            }

            const result: any = await Blog.create({
                name: name,
                description: description || "",
                image: image || "",
                slug: blogSlug,
                category: category || "",
                status: status !== undefined ? status : true,
                created_by: req.user.object_id
            });
            const createdBlog = await Blog.findOne({ _id: result._id }).populate("created_by", "name email").lean();

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "blog-add"), createdBlog || result);
        } catch (err: any) {
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
            const { name, description, image, slug, category, status } = req.body;

            const existingBlog = await Blog.findOne({ id: id }).lean();
            if (!existingBlog) {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
            if (name && name !== existingBlog.name) {
                const duplicateBlog = await Blog.findOne({ name: name, id: { $ne: id } }).lean();
                if (duplicateBlog) {
                    throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-already-exists"]));
                }
            }

            const updateData: any = {
                updated_by: req.user.object_id,
            };

            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (image !== undefined) updateData.image = image;
            if (category !== undefined) updateData.category = category;
            if (status !== undefined) updateData.status = status;

            if (slug !== undefined) {
                const slugExists = await Blog.findOne({ slug: slug, id: { $ne: id } }).lean();
                if (slugExists) {
                    throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["slug-already-exists"]));
                }
                updateData.slug = slug;
            } else if (name !== undefined && name !== existingBlog.name) {
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

            await Blog.findOneAndUpdate({ id: id }, updateData);

            const updatedData: any = await Blog.findOne({ id: id }).populate("created_by", "name email").populate("updated_by", "name email").lean();

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "blog-update"), updatedData);
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Delete blog
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

    // Get unique categories
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
}
