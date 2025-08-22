import { Request, Response } from "express";
import { ValidationChain } from "express-validator";;
import { serverResponse, serverErrorHandler } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import InsuranceSolution from "../../../models/insurance-soluction";

export default class InsuranceSolutionController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const { locale, } = req.query;
            this.locale = (locale as string) || "en";

            const result = await InsuranceSolution.find({status:true}).lean()

            if (result.length > 0) {
                const formattedResult = result.map((item: any) => ({
                    ...item,
                    image:`${process.env.RESOURCE_URL}${item.image}`,

                }));
                return serverResponse(
                    res,
                    HttpCodeEnum.OK,
                    ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["banner-fetched"]),
                    { data: formattedResult }
                );
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getById(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result = await InsuranceSolution.findOne({ id }).lean();

            if (result) {
                const formattedResult = {
                   ...result,
                   image:`${process.env.RESOURCE_URL}${result.image}`,

                };

                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["banner-fetched"]), formattedResult);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }


}
