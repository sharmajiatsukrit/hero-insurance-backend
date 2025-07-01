import { Request, Response } from "express";
import { ValidationChain } from "express-validator";

import { serverResponse, serverErrorHandler } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import Category from "../../../models/category";
import Blog from "../../../models/blog";

const fileName = "[user][blog][index.ts]";

export default class BlogController {
    public locale: string = "en";

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
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean();

            const totalCount = await Blog.countDocuments(searchQuery);
            const totalPages = Math.ceil(totalCount / limitNumber);
            let formattedResults: any[] = [];

            if (results.length > 0) {
                formattedResults = results.map((item, index) => ({
                    ...item,
                    blogImage: `${process.env.RESOURCE_URL}${item.blog_image}`,
                }));
            }

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

            const result: any = await Blog.findOne({ id: id }).populate("created_by", "name email").populate("updated_by", "name email").populate("categoryId", "id name").lean();
            if (result) {
                result.blogImage = `${process.env.RESOURCE_URL}${result.blog_image}`;
            }
            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["blog-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
