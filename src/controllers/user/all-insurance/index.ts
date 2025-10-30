import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import AllInsurance from "../../../models/all-insurance";
import TailoredBusinessInsuranceType from "../../../models/tailored-business-insurance-type";

const fileName = "[admin][enquiry][index.ts]";
export default class AllInsuranceRequestController {
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

            const { plan_type, company_name, contact_person, mobile_no, email, number_of_employe } = req.body;
            let result: any;
            const insuranceType: any = await TailoredBusinessInsuranceType.findOne({ id: +plan_type });
            result = await AllInsurance.create({
                plan_type: insuranceType?._id,
                company_name,
                contact_person,
                mobile_no,
                email,
                number_of_employe,
            });

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "enquiry-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
