import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import Insurancelead from "../../../models/insurance-lead";
import { fillTemplate, lead_request_template } from "../../../utils/templates";
import { sendMail } from "../../../utils/mail";
import SupportEmailConfig from "../../../models/support-email-config";

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

            let emailType: any;
            if (type === "PCV" || type === "GCV") {
                emailType = "pcv-gcv";
            } else if (type === "Health" || type === "Health Top Up") {
                emailType = "health-topup-term";
            }

            if (emailType) {
                const supportEmail: any = await SupportEmailConfig.findOne({ type: emailType }).lean();
                const mailTemplateData = {
                    name: name,
                    mobile_no: mobile,
                    policy_type: type,
                };

                const acknowledgementBody: any = fillTemplate(lead_request_template, mailTemplateData);
                await sendMail(supportEmail?.email, "Lead Request", acknowledgementBody, []);
            }

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "enquiry-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
