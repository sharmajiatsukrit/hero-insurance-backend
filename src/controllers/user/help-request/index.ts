import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import { sendMail } from "../../../utils/mail";
import { claim_acknowledgement_template, claims_request_template, fillTemplate } from "../../../utils/templates";
import SupportEmailConfig from "../../../models/support-email-config";
import HelpRequest from "../../../models/help-request";

const fileName = "[admin][enquiry][index.ts]";
export default class HelpRequestController {
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

            const { name, email, mobile, description, policy_no } = req.body;
            const customer_id = req?.customer?.object_id || null;
            let result: any;
            result = await HelpRequest.create({
                name: name,
                email: email,
                mobile: mobile,
                description: description,
                policy_no,
                customer_id: customer_id,
            });

            // const supportEmail:any = await SupportEmailConfig.findOne({type:"claim-request"}).lean();

            // const templateData = {
            //     customer:name,
            //     customer_mobile:mobile,
            //     admin_team:"Hero Team",
            //     policy_no:policy_no,
            //     insurance_type:insuranceType?.name,
            //     date_incident:"",
            //     description:description
            // }
            // const acknowledgementTemplateData = {
            //     policy_no:mobile,
            //     company_name:"Hero Insurance",
            //     claim_team:"Hero Team",
            // }

            // const acknowledgementBody : any = fillTemplate(claim_acknowledgement_template,acknowledgementTemplateData)
            // const body : any = fillTemplate(claims_request_template,templateData)

            // await sendMail(email, "Claim Acknowledgement", acknowledgementBody, []);
            // await sendMail(supportEmail?.email, "Claim Request", body, []);
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "enquiry-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async list(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[enquiry][add]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const customer_id = req?.customer?.object_id || null;

            let result = await HelpRequest.find({ customer_id })
                .select("id name email mobile description status policy_no createdAt")
                .sort({ createdAt: -1 }) 
                .limit(5) 
                .lean();

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "enquiry-list"), result);
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
