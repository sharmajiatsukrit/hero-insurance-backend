import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";

import validate from "./validate";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import KeyOfficer from "../../../models/key-officer";


const fileName = "[admin][kof][index.ts]";
export default class KeyOfficerController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[kof][getList]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const filter: any = {};
            filter.is_deleted = false;
            filter.status = true;
            const results = await KeyOfficer.find(filter)
                .sort({ menu_order: 1 })
                .lean();

            let formattedResults: any[] = [];

            if (results.length > 0) {
                formattedResults = results.map((item, index) => ({
                    ...item,
                    kof_image: item.kof_image?`${process.env.RESOURCE_URL}${item.kof_image}`:"",
                }));
            }

            if (results.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["faq-fetched"]), {
                    data: formattedResults
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
            const fn = "[kof][getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result: any = await KeyOfficer.findOne({ id: id }).lean();
            // console.log(result);

            if (result) {
                result.kof_image = `${process.env.RESOURCE_URL}${result.kof_image}`;
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

}
