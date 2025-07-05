import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";

import validate from "./validate";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import Page from "../../../models/page";

const fileName = "[admin][page][index.ts]";
export default class PageController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getPageSection(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[pagesection][get]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { key } = req.params;
            const filter: any = {};
            filter.key = key;
            filter.status = true;
            const results = await Page.find(filter).lean();
            // console.log(result);
            let formattedResults: any[] = [];

            if (results.length > 0) {
                formattedResults = results.map((item: any) => ({
                    ...item,
                    value: {
                        ...item.value,
                        ...(item.value?.image && {
                            image: `${process.env.RESOURCE_URL}${item.value.image}`,
                        }),
                    },
                }));
            }
            if (results) {
                // result.offer_image = `${process.env.RESOURCE_URL}${result.offer_image}`;
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-fetched"]), formattedResults);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
