import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import Enquiry from "../../../models/enquiry";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";

const fileName = "[admin][enquiry][index.ts]";
export default class EnquiryController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

     //add
    public async add(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[enquiry][add]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { name, email, mobile_no, description, status = true } = req.body;
            let result: any;

            result = await Enquiry.create({
                name: name,
                email: email,
                mobile_no: mobile_no,
                description: description,
            });

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "enquiry-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

}
