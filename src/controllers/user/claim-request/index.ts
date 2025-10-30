import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import ClaimRequest from "../../../models/claim-request";
import InsuranceType from "../../../models/insurance-type";
import { sendMail } from "../../../utils/mail";
import { claim_acknowledgement_template, claims_request_template, fillTemplate } from "../../../utils/templates";
import SupportEmailConfig from "../../../models/support-email-config";

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

            const supportEmail:any = await SupportEmailConfig.findOne({type:"claim-request"}).lean();

            const templateData = {
                customer:name,
                customer_mobile:mobile,
                admin_team:"Hero Team",
                policy_no:"Test",
                insurance_type:insuranceType?.name,
                date_incident:"",
                description:description
            }
            const acknowledgementTemplateData = {
                policy_no:mobile,
                company_name:"Hero Insurance",
                claim_team:"Hero Team",
            }

            const acknowledgementBody : any = fillTemplate(claim_acknowledgement_template,acknowledgementTemplateData)
            const body : any = fillTemplate(claims_request_template,templateData)

            await sendMail(email, "Claim Acknowledgement", acknowledgementBody, []);
            await sendMail(supportEmail?.email, "Claim Request", body, []);
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "enquiry-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
