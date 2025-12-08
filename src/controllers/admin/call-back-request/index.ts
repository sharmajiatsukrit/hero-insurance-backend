import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import CallBackRequest from "../../../models/call-back-request";

const fileName = "[admin][enquiry][index.ts]";
export default class CallBackRequestController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[enquiry][getList]";
            // Set locale
            const { locale, page, limit, search } = req.query;
            this.locale = (locale as string) || "en";

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;
           
            const filter: any = {};
            if (search) {
                filter.$or = [{ name: { $regex: search, $options: "i" } }];
            }
            const results = await CallBackRequest.find(filter)
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limitNumber)
                .populate({ path: "service_type", select: "name id" })
                .populate({ path: "preferred_slot", select: "name id" })
                .lean();

            const totalCount = await CallBackRequest.countDocuments(filter);
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
            const fn = "[enquiry][getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result: any = await CallBackRequest.findOne({ id: id }).populate({ path: "service_type", select: "name id" }).populate({ path: "preferred_slot", select: "name id" }).lean();
            

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

}
