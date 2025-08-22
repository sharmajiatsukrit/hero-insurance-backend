import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import ClaimRequest from "../../../models/claim-request";
import InsuranceType from "../../../models/insurance-type";

const fileName = "[admin][enquiry][index.ts]";
export default class ClaimRequestController {
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

            const { insurance_type_id, name, email, mobile, description } = req.body;
            let result: any;
            const insuranceType: any = await InsuranceType.findOne({ id: +insurance_type_id });
            result = await ClaimRequest.create({
                insurance_type: insuranceType?._id,
                name: name,
                email: email,
                mobile_no: mobile,
                description: description,
            });

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "enquiry-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
