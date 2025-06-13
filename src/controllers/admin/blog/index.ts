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
            const { locale, page, limit, search, status } = req.query;
            this.locale = (locale as string) || "en";

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;
            
            let searchQuery: any = {};
            
            // Search functionality
            if (search) {
                searchQuery.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            
            // Status filter
            if (status !== undefined) {
                searchQuery.status = status === 'true';
            }

            const results = await Blog.find(searchQuery)
                .populate('created_by', 'name email')
                .populate('updated_by', 'name email')
                .sort({ _id: -1 }) // Sort by _id in descending order
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
                    currentPage: pageNumber 
                });
            } else {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-fetched"]), { 
                    data: [], 
                    totalCount: 0, 
                    totalPages: 0, 
                    currentPage: pageNumber 
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
            const result: any = await Blog.findOne({ id: id })
                .populate('created_by', 'name email')
                .populate('updated_by', 'name email')
                .lean();

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

            const { name, description, image, status } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            // Check if blog with same name already exists
            const existingBlog = await Blog.findOne({ name: name }).lean();
            if (existingBlog) {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-already-exists"]));
            }

            const result: any = await Blog.create({
                name: name,
                description: description || '',
                image: image || '',
                status: status !== undefined ? status : true,
                created_by: req.user.object_id
            });

            const createdBlog = await Blog.findOne({ _id: result._id })
                .populate('created_by', 'name email')
                .lean();

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
            const { name, description, image, status } = req.body;

            // Check if blog exists
            const existingBlog = await Blog.findOne({ id: id }).lean();
            if (!existingBlog) {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }

            // Check if blog with same name already exists (excluding current blog)
            if (name && name !== existingBlog.name) {
                const duplicateBlog = await Blog.findOne({ name: name, id: { $ne: id } }).lean();
                if (duplicateBlog) {
                    throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-already-exists"]));
                }
            }

            const updateData: any = {
                updated_by: req.user.object_id
            };

            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (image !== undefined) updateData.image = image;
            if (status !== undefined) updateData.status = status;

            await Blog.findOneAndUpdate({ id: id }, updateData);

            const updatedData: any = await Blog.findOne({ id: id })
                .populate('created_by', 'name email')
                .populate('updated_by', 'name email')
                .lean();

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


    // Update blog status
    // public async status(req: Request, res: Response): Promise<any> {
    //     try {
    //         const fn = "[status]";
    //         // Set locale
    //         const { locale } = req.query;
    //         this.locale = (locale as string) || "en";

    //         const id = parseInt(req.params.id);
    //         const { status } = req.body;

    //         // Validate status value
    //         if (typeof status !== 'boolean') {
    //             throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["invalid-status"]));
    //         }

    //         // Check if blog exists
    //         const existingBlog = await Blog.findOne({ id: id }).lean();
    //         if (!existingBlog) {
    //             throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
    //         }

    //         const updationStatus = await Blog.findOneAndUpdate(
    //             { id: id }, 
    //             { 
    //                 status: status,
    //                 updated_by: req.user.object_id
    //             }
    //         ).lean();

    //         const updatedData: any = await Blog.findOne({ id: id })
    //             .populate('created_by', 'name email')
    //             .populate('updated_by', 'name email')
    //             .lean();

    //         if (updationStatus) {
    //             return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-status"]), updatedData);
    //         } else {
    //             throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
    //         }
    //     } catch (err: any) {
    //         return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
    //     }
    // }

    // Get active blogs only (public endpoint)
    // public async getActiveBlogs(req: Request, res: Response): Promise<any> {
    //     try {
    //         const fn = "[getActiveBlogs]";
    //         // Set locale
    //         const { locale, page, limit, search } = req.query;
    //         this.locale = (locale as string) || "en";

    //         const pageNumber = parseInt(page as string) || 1;
    //         const limitNumber = parseInt(limit as string) || 10;
    //         const skip = (pageNumber - 1) * limitNumber;
            
    //         let searchQuery: any = { status: true };
            
    //         // Search functionality
    //         if (search) {
    //             searchQuery.$or = [
    //                 { name: { $regex: search, $options: 'i' } },
    //                 { description: { $regex: search, $options: 'i' } }
    //             ];
    //         }

    //         const results = await Blog.find(searchQuery)
    //             .select('id name description image createdAt updatedAt')
    //             .sort({ createdAt: -1 })
    //             .skip(skip)
    //             .limit(limitNumber)
    //             .lean();

    //         const totalCount = await Blog.countDocuments(searchQuery);
    //         const totalPages = Math.ceil(totalCount / limitNumber);

    //         return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-fetched"]), { 
    //             data: results, 
    //             totalCount, 
    //             totalPages, 
    //             currentPage: pageNumber 
    //         });
    //     } catch (err: any) {
    //         return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
    //     }
    // }

    // Get blog statistics
    // public async getStats(req: Request, res: Response): Promise<any> {
    //     try {
    //         const fn = "[getStats]";
    //         // Set locale
    //         const { locale } = req.query;
    //         this.locale = (locale as string) || "en";

    //         const totalBlogs = await Blog.countDocuments({});
    //         const activeBlogs = await Blog.countDocuments({ status: true });
    //         const inactiveBlogs = await Blog.countDocuments({ status: false });
            
    //         // Get blogs created in last 30 days
    //         const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
    //         const recentBlogs = await Blog.countDocuments({ 
    //             createdAt: { $gte: thirtyDaysAgo } 
    //         });

    //         const stats = {
    //             totalBlogs,
    //             activeBlogs,
    //             inactiveBlogs,
    //             recentBlogs
    //         };

    //         return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-stats"]), stats);
    //     } catch (err: any) {
    //         return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
    //     }
    // }
}