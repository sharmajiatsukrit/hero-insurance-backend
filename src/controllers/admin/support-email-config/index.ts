import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";

import validate from "./validate";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import Offer from "../../../models/offer";
import OfferCategory from "../../../models/offer-category";
import SupportEmailConfig from "../../../models/support-email-config";

const fileName = "[admin][offer][index.ts]";
export default class SupportEmailConfigController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }


    public async getByType(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[offer][getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const type = req.params.type;
            const result: any = await SupportEmailConfig.findOne({ type }).lean();
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
            const fn = "[offer][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { type , email} = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const exist = await SupportEmailConfig.findOne({type});
            console.log(exist)
            if(exist){
                await SupportEmailConfig.findOneAndUpdate({type},{email})
            }else{
                await SupportEmailConfig.create({type,email})
            }

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

}
