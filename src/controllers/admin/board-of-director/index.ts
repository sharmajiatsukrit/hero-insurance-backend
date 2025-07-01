import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";

import validate from "./validate";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import BoardOfDirector from "../../../models/board-of-director";

const fileName = "[admin][bod][index.ts]";
export default class BODController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[bod][getList]";
            // Set locale
            const { locale, page, limit, search } = req.query;
            this.locale = (locale as string) || "en";

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;
            const query: any = {
                is_deleted: false,
                status: true,
            };
            const filter: any = {};
            if (search) {
                filter.$or = [{ name: { $regex: search, $options: "i" } }];
            }
            const results = await BoardOfDirector.find({ ...query, ...filter })
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean();

            const totalCount = await BoardOfDirector.countDocuments({ ...query, ...filter });
            const totalPages = Math.ceil(totalCount / limitNumber);

            if (results.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["faq-fetched"]), {
                    data: results,
                    totalCount,
                    totalPages,
                    currentPage: pageNumber,
                });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getById(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[bod][getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result: any = await BoardOfDirector.findOne({ id: id }).lean();
            // console.log(result);

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async add(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[bod][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { name, designation, menu_order, description, status } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            let bod_image: any;
            if (req.file) {
                bod_image = req?.file?.filename;
            }

            const result: any = await BoardOfDirector.create({
                name: name,
                designation: designation,
                menu_order: menu_order,
                description: description,
                bod_image: bod_image,
                status: status,
                created_by: req.user?.object_id,
            });

            Logger.info(`${fileName + fn} Created blog: ${JSON.stringify(result)}`);

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
    public async update(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[bod][update]";
            const id = parseInt(req.params.id);
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { name, designation, menu_order, description, status } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            let bod_image: any;
            if (req.file) {
                bod_image = req.file.filename;
            }

            const bod = await BoardOfDirector.findOne({ id: id });
            if (!bod) {
                return serverResponse(res, HttpCodeEnum.NOTFOUND, constructResponseMsg(this.locale, "award-not-found"), {});
            }

            await BoardOfDirector.findOneAndUpdate(
                { id: id },
                {
                    name: name,
                    designation: designation,
                    menu_order: menu_order,
                    description: description,
                    bod_image: bod_image || bod.bod_image,
                    status: status,
                    updated_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-update"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Delete
    public async delete(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[bod][delete]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result = await BoardOfDirector.deleteOne({ id: id });

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-delete"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Status
    public async status(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[bod][status]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const { status } = req.body;
            const updationstatus = await BoardOfDirector.findOneAndUpdate({ id: id }, { status: status }).lean();
            const updatedData: any = await BoardOfDirector.find({ id: id }).lean();
            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-status"]), updatedData);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
