import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import validate from "./validate";
import InsuranceType from "../../../models/insurance-type";
import { constructResponseMsg, serverErrorHandler, serverResponse } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";

export default class InsuranceTypeController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getList]";
            // Set locale
            const { locale, page, limit, search } = req.query;
            this.locale = (locale as string) || "en";

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;
            let searchQuery: any = {};
            if (search) {
                searchQuery.$or = [{ name: { $regex: search, $options: "i" } }];
            }
            const results = await InsuranceType.find(searchQuery).sort({ _id: -1 }).skip(skip).limit(limitNumber).lean();

            const totalCount = await InsuranceType.countDocuments(searchQuery);
            const totalPages = Math.ceil(totalCount / limitNumber);

            if (results.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["insurance-type-fetched"]), {
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
            const fn = "[getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result: any = await InsuranceType.findOne({ id: id }).lean();

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["insurance-type-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //add
    public async add(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[add]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { name, key, show_reg_no_field, status } = req.body;
            await InsuranceType.create({
                name: name,
                key,
                show_reg_no_field,
                status,
                created_by: req.user.object_id,
            });

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "insurance-type-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //Update
    public async update(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[update]";

            const id = parseInt(req.params.id);

            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { name, key, status, show_reg_no_field } = req.body;
            let result: any = await InsuranceType.findOneAndUpdate(
                { id: id },
                {
                    name: name,
                    key,
                    status: status,
                    show_reg_no_field,
                    updated_by: req.user.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "insurance-type-update"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Delete
    public async delete(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[delete]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result = await InsuranceType.deleteOne({ id: id });

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["insurance-type-delete"]), {});
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
            const fn = "[status]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const { status } = req.body;
            const updationstatus = await InsuranceType.findOneAndUpdate({ id: id }, { status: status }).lean();
            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["insurance-type-status"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
