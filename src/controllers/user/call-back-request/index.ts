import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import InsuranceType from "../../../models/insurance-type";
import CallBackRequest from "../../../models/call-back-request";
import RequestCallbackDropdown from "../../../models/request-callback-dropdown";

const fileName = "[admin][enquiry][index.ts]";
export default class CallBackRequestRequestController {
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

            const { service_type, name, mobile_no, email, location, preferred_slot, query } = req.body;
            let result: any;
            const insuranceType: any = await RequestCallbackDropdown.findOne({ id: +service_type });
            const preferredSlot: any = await RequestCallbackDropdown.findOne({ id: +preferred_slot });
            result = await CallBackRequest.create({
                service_type: insuranceType?._id,
                name,
                mobile_no,
                email,
                location,
                preferred_slot:preferredSlot?._id,
                query,
            });

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "enquiry-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
