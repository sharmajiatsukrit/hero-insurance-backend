import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import ClaimRequest from "../../../models/claim-request";

const fileName = "[admin][enquiry][index.ts]";
export default class ClaimRequestController {
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
            const results = await ClaimRequest.find(filter)
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean()
                .populate({ path: "insurance_type", select: "name id" });

            const totalCount = await ClaimRequest.countDocuments(filter);
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
            const result: any = await ClaimRequest.findOne({ id: id }).lean().populate({ path: "insurance_type", select: "name id" });;
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

}
