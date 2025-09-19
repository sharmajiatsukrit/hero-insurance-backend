import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import Insurancelead from "../../../models/insurance-lead";


const fileName = "[admin][enquiry][index.ts]";
export default class InsuranceLeadController {
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

            const { name, gender, mobile, email, registration_no, type } = req.body;
            let result: any;
            result = await Insurancelead.create({
                name,
                gender,
                mobile,
                email,
                registration_no,
                type,
            });

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "enquiry-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
