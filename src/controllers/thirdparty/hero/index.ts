import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import moment from "moment";
import {
    removeObjectKeys,
    serverResponse,
    serverResponse2,
    serverErrorHandler,
    serverThirdPartyErrorHandler,
    removeSpace,
    constructResponseMsg,
    serverInvalidRequest,
    groupByDate,
} from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import EmailService from "../../../utils/email";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import { networkRequest } from "../../../utils/request";
import { randomUUID } from "crypto";
import { UnifiedLead } from "../../../models";
import { sendMail } from "../../../utils/mail";
import { getMispToken } from "../../../utils/thirdparty/misptoken";

const fileName = "[user][dashboard][index.ts]";
export default class HeroController {
    public locale: string = "en";
    public emailService;

    constructor() {
        this.emailService = new EmailService();
    }

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async leadGeneration(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { first_name, last_name, mobile_no, email_id, reg_no, segment, redirection, source, utm, seller_details } = req.body;

            const data: any = { first_name, last_name, mobile_no, email_id, reg_no, segment, redirection, source, utm, seller_details };
            const headers: any = {};
            const result = await networkRequest("POST", "https://apimotor.heroinsurance.com/api/hibl-lead-generation", data, headers);

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async tokenValidation(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { formdata } = req.body;

            const login = await networkRequest(
                "POST",
                "https://dashboard.heroinsurance.com/generate_login_token_hero_sso",
                {
                    username: "HEROPRODSSO",
                    password: "M9r0HL8sRado",
                },
                {}
            );
            // console.log(login,"data");
            if (login.data.status) {
                const data: any = { "access-token": login.data.token, formdata: formdata };
                const headers: any = {};
                const result = await networkRequest("POST", "https://dashboard.heroinsurance.com/login_token_validate", data, headers);
                // console.log(result,"test");

                if (result) {
                    return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
                } else {
                    throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
                }
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }

            // throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
        } catch (err: any) {
            // console.log(err,"testErr")
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async healthQuote(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { section, name, email, gender, mobile, source, params, utm, seller_details, type, from_unified_enquiry } = req.body;
            const lastNO: any = await UnifiedLead.findOne({}).sort({ unique_no: -1 });

            let unique_generate: any = 0;
            if (lastNO) {
                unique_generate = parseInt(lastNO.unique_no) + 1;
            } else {
                unique_generate = 1;
            }

            const unique_id: any = await UnifiedLead.create({ unique_no: unique_generate.toString().padStart(7, "0") });
            const data: any = {
                section,
                name,
                email,
                gender,
                mobile,
                params,
                source,
                utm,
                seller_details,
                type,
                unified_lead: "UL" + unique_id.unique_no.toString().padStart(7, "0"),
                from_unified_enquiry,
            };
            // console.log(data);
            const headers: any = { "SHOW-FULL-TRACE": "" };
            const result = await networkRequest("POST", "https://apihealth.heroinsurance.com/api/v1/unified_enquiries", data, headers);
            // console.log(result);

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return res.status(500).json({
                status: err.response.data.status,
                code: err.response.data.code,
                message: err.response.data.error,
                data: [],
                error: err,
            });
            // return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async mispLogin(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { data: token } = await getMispToken();
            const { username, password } = req.body;
            const data: any = { username, password };
            const headers: any = { Authorization: "Bearer " + token };
            const result = await networkRequest("POST", "https://misp.heroinsurance.com/prod/services/HeroOne/api/Login/ValidateMISPLogin", data, headers);
            console.log(result.data);

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async mispAuth(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { auth_user, auth_pass } = req.body;
            const data: any = { auth_user, auth_pass };
            const headers: any = {};
            const result = await networkRequest("GET", "https://misp.heroinsurance.com/prod/services/HeroOne/api/Authenticate/MISPAuthorization", data, headers);
            // console.log(result.data);

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async renewalLink(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            // Always get the token internally
            const { data: token } = await getMispToken();
            const { MobileNo, Registration_No, CPId } = req.body;
            const data: any = { MobileNo, Registration_No, CPId };
            const headers: any = { Authorization: "Bearer " + token };

            const result = await networkRequest("POST", "https://misp.heroinsurance.com/prod/services/HeroOne/api/Policy/RenewalLink", data, headers);

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async cpDetails(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
           const { data: token } = await getMispToken();
            const { CPID } = req.body;
            const data: any = { CPID };
           const headers: any = { Authorization: "Bearer " + token };
            const result = await networkRequest("POST", "https://misp.heroinsurance.com/prod/services/HeroOne/api/ChannelPartner/CPDetails", data, headers);
            // console.log(result.data);

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async registerCliam(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const authorization: any = req.headers.authorization;
            const { name, email, mobile, insurance_type, details } = req.body;
            const body: string = `Hello Admin,<br>
                                    New Claim Registration request received. Below are the details.<br>
                                    <strong>Name: </strong>${name}<br>
                                    <strong>Email: </strong>${email}<br>
                                    <strong>Mobile: </strong>${mobile}<br>
                                    <strong>Insurance Type: </strong>${insurance_type}<br>
                                    <strong>Details: </strong>${details}<br>
                                    Thanks,<br> Regards Hero Insurance
                                    `;
            await sendMail("ravi.anand@heroibil.com,shailendra@sukritinfotech.com", "New Claim Registration", body, []);

            // if (result) {
            return serverResponse(res, HttpCodeEnum.OK, "Claim Registration successfully submitted.", []);
            // } else {
            //     throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            // }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async cleaverTapEvent(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { d } = req.body;
            const data: any = { d: d };
            const headers1: any = req.headers;
            const accountID = req.headers["x-clevertap-account-id"];
            const accountPass = req.headers["x-clevertap-passcode"];
            console.log(accountID, accountPass, headers1);
            const headers: any = { "X-CleverTap-Account-Id": accountID, "X-CleverTap-Passcode": accountPass };
            const result = await networkRequest("POST", "https://in1.api.clevertap.com/1/upload", data, headers);
            // console.log(result.data);https://in1.api.clevertap.com/1/upload

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getDetails(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const authorization: any = req.headers.authorization;
            const { MobileNo, Registration_No } = req.body;
            const token = authorization.split(" ")[1];
            // console.log(token);
            const data: any = { MobileNo, Registration_No };
            const headers: any = { Authorization: "Bearer " + token };
            const result = await networkRequest("POST", "https://misp.heroinsurance.com/uat/services/HeroOne/api/Policy/PolicyDetails", data, headers);
            console.log(result.data);

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async generateProposalToken(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const authorization: any = req.headers.authorization;
            // console.log(token);
            const data: any = { api_endpoint: "https://uatmotorapi.heroinsurance.com/api/proposalReports" };
            const headers: any = { Authorization: "Basic d2Vic2VydmljZTFAZnludHVuZS5jb206VGVzdGluZ0AxMjM0" };
            const result = await networkRequest("POST", "https://uatmotorapi.heroinsurance.com/api/tokenGeneration", data, headers);
            console.log(result.data);

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async proposalReport(req: Request, res: Response): Promise<any> {
        try {
            const { locale, page } = req.query;
            this.locale = (locale as string) || "en";
            const validation: any = req.headers.validation;

            // console.log(token);
            const data: any = req.body;
            const headers: any = { validation: validation };
            const result = await networkRequest("POST", "https://uatmotorapi.heroinsurance.com/api/proposalReports?page=" + page, data, headers);
            console.log(result.data);

            if (result) {
                return serverResponse2(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async mispLoginPolicy(req: Request, res: Response): Promise<any> {
        try {
            const { locale, page } = req.query;
            this.locale = (locale as string) || "en";
            const validation: any = req.headers.validation;

            // console.log(token);
            const data: any = req.body;
            const headers: any = {};
            const result = await networkRequest(
                "GET",
                `https://misp.heroinsurance.com/prod/services/BOT/api/Authenticate/Login?Username=${data.Username}&Password=${data.Password}`,
                {},
                headers
            );
            console.log(result.data);

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async mispDownloadPolicy(req: Request, res: Response): Promise<any> {
        try {
            const { locale, page } = req.query;
            this.locale = (locale as string) || "en";
            const Authorization: any = req.headers.authorization;

            // console.log(token);
            const data: any = req.body;
            const param: any = req.query;
            const headers: any = { Authorization: Authorization };
            // console.log(param,Authorization);
            const result = await networkRequest("POST", `https://misp.heroinsurance.com/prod/services/BOT/api/Shedule/PolicyShedulebyMobile?mobNo=${param.mobNo}`, {}, headers);
            // console.log(result.data);

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async sendPolicyDetails(req: Request, res: Response): Promise<any> {
        try {
            const { locale, page } = req.query;
            this.locale = (locale as string) || "en";
            const Authorization: any = req.headers.authorization;

            // console.log(token);
            const { to, policy_no, customer_name, vehicle_no, insurer_name, od_coverage, tp_coverage } = req.body;

            const body: string = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Insurance Policy Details</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #3B63FB; /* Hero's brand color */
            padding: 15px;
            text-align: center;
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
        }
		.headBold {
            font-weight: 900px;
            line-height: 1.6;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
		.content2 {
            padding: 0px 20px 20px 20px;
            line-height: 1.6;
        }
        .policy-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            margin-bottom: 20px;
            font-size: 14px;
			background:#ECF0FF;
        }
        .policy-table th, .policy-table td {
            border: 1px solid #C9D4FE;
            padding: 10px;
            text-align: left;
			
        }
        .policy-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .button-section {
            text-align: center;
            padding: 20px;
            background-color: #f9f9f9;
            border-top: 1px solid #eee;
        }
        .button-section a {
            display: inline-block;
            background-color: #3B63FB;
            color: #ffffff;
            padding: 12px 25px;
            margin: 5px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            font-size: 15px;
        }
        .app-links {
            text-align: center;
            padding: 20px;
            background-color: #f9f9f9;
            border-top: 1px solid #eee;
        }
        .app-links a {
            display: inline-block;
            margin: 0 10px;
        }
        .app-links img {
            width: 100px; /* Adjust as needed */
            height: auto;
        }
		.app-links2 img {
            width: 100px; /* Adjust as needed */
            height: 60px;
        }
        .contact-info {
            background-color: #f2f2f2;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            border-top: 1px solid #eee;
        }
        .contact-info a {
            color: #3B63FB;
            text-decoration: none;
            margin: 0 5px;
        }
        .social-media {
            text-align: center;
            padding: 0px 10px 10px 10px;
            background-color: #f2f2f2;
            border-top: 1px solid #D8D7D7;
        }
        .social-media a {
            display: inline-block;
            margin: 0 8px;
        }
        .social-media img {
            width: 24px;
            height: 24px;
        }
        .footer {
            padding: 20px;
            background-color: #1E1E1E;
            color: #ffffff;
            font-size: 12px;
            text-align: center;
            line-height: 1.5;
			border-top:4px solid #ED3338;
        }
        .footer a {
            color: #ffffff;
            text-decoration: none;
        }
        .footer p {
            margin-bottom: 5px;
        }
        .security-notice {
            background-color: #fff3cd;
            border-left: 6px solid #ffc107;
            margin: 20px 0;
            padding: 15px;
            color: #664d03;
            font-size: 14px;
        }

        /* Responsive Styles */
        @media only screen and (max-width: 480px) {
            .container {
                border-radius: 0;
                margin: 0;
            }
            .header {
                font-size: 20px;
                padding: 15px;
            }
            .content, .button-section, .app-links, .contact-info, .social-media, .footer {
                padding: 15px;
            }
            .policy-table th, .policy-table td {
                padding: 8px;
                font-size: 12px;
            }
            .button-section a {
                display: block;
                margin-bottom: 10px;
            }
            .app-links img {
                width: 120px;
				height:60px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
	<div class="content">
	<img src="https://www.heroibil.com/wp-content/uploads/2018/08/logo-hero.png" alt="Hero Insurance"></a>
	</div>
        <div class="header">
            Here is Your Policy Copy [Policy No. ${policy_no}]
        </div>
        <div class="content">
            <p>Dear <strong>${customer_name}</strong>,</p>
            <p>Thank you for choosing Hero Insurance Broking!</p>
            <p>Your digitally signed policy document is attached to this email. Here are the details of your insurance policy, sent as per your request via the Hero Insurance Broking Profile dashboard:</p>

            <h3>Policy Snapshot:</h3>
            <table class="policy-table">
			<tr>
			<td><strong>Policy Holder</strong></td>
			<td>${customer_name}</td>
			</tr>
			<tr>
			<td><strong>Vehicle Number</strong></td>
			<td>${vehicle_no}</td>
			</tr>
			<tr>
			<td><strong>Insurer Name</strong></td>
			<td>${insurer_name}</td>
			</tr>
			<tr>
			<td><strong>Policy Number</strong></td>
			<td>${policy_no}</td>
			</tr>
			<tr>
			<td><strong>OD Coverage</strong></td>
			<td>${od_coverage}</td>
			</tr>
			<tr>
			<td><strong>TP Coverage</strong></td>
			<td>${tp_coverage}</td>
			</tr>

             
            </table>
		
            <p><strong>Physical copy not required</strong>—the attached policy PDF is legally valid under respective regulations & guidelines.</p>
        </div>

        <div class="button-section">
            <a href="https://www.heroinsurance.com/renew" target="_blank">Renew Policy</a>
            <a href="https://www.heroinsurance.com/claim" target="_blank">File a Claim</a>
            <a href="https://www.heroinsurance.com/home" target="_blank">Manage My Policies</a>
        </div>

        <div class="content security-notice">
            <strong>Security Notice:</strong> This email was initiated from the Hero Insurance portal by you. If you didn’t request this, please contact our support team immediately.
        </div>

        <div class="content2">
            <p>Thanks for trusting us,</p>
            <p><strong>Team Hero Insurance Broking</strong></p>
			<img src="https://www.heroibil.com/wp-content/uploads/2018/08/logo-hero.png" alt="Hero Insurance"></a>
			
		
        </div>

        <div class="app-links">
            <p>Get our mobile app and stay on top of renewals, claims, and reminders—anytime, anywhere:</p>
            <a href="[Google Play Store Link]" target="_blank">
                <img style="height:50px; width:130px;" src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Download on Google Play">
            </a>
            <a href="[Apple App Store Link]" target="_blank">
                <img style="height:50px; width:110px;" src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on iOS App Store">
            </a>
        </div>

        <div class="contact-info">
            <p><strong>Need Help?</strong></p>
            <p>
                <strong>Call Us:</strong><a href="tel:1800-102-4376">1800-102-4376</a> |&nbsp
               <strong>Email:</strong><a href="mailto:support@heroibil.com"> support@heroibil.com</a> <br>
               <strong> WhatsApp:</strong><a href="https://wa.me/919289113640" target="_blank">+91-9289113640</a> |
                 <a href="https://www.heroinsurance.com/home" target="_blank">Login to Dashboard</a>
            </p>
        </div>

        <div class="social-media">
            <p><strong>Follow Us:</strong></p>
            <a href="[Facebook Link]" target="_blank"><img src="https://www.facebook.com/images/fb_icon_325x325.png" alt="Facebook"></a>
            <a href="[X Link]" target="_blank"><img src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="X"></a>
            <a href="[Instagram Link]" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/768px-Instagram_logo_2016.svg.png" alt="Instagram"></a>
            <a href="[LinkedIn Link]" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn"></a>
        </div>

        <div class="footer">
            <p>IRDAI Registration No: 649 (<a href="https://www.irdai.gov.in" target="_blank">irdai.gov.in</a>) | IBAI Membership No: 15649 <br>(<a href="https://www.ibai.org" target="_blank">www.ibai.org</a>) | Valid Until: 25th July 2027</p>
            <p>Hero Insurance Broking India Pvt. Ltd. | CIN: U66010DL2007PTC165059 | Corporate & Registered Office: 264, Okhla Industrial Estate, Phase III, New Delhi, India 110020</p>
            <p>Insurance is the subject matter of the solicitation. For more details on policy terms, conditions, exclusions, limitations, please refer/read policy brochure carefully before concluding sale. Beware of spurious phone calls and fictitious/fraudulent offers. IRDAI is not involved in activities like selling insurance policies, announcing bonus or investment of premium. Public receiving such phone calls are requested to lodge a police complaint.</p>
        </div>
    </div>
</body>
</html>`;
            const mail = await sendMail(to, "New Policy registered", body, []);

            // console.log(mail);
            // if (mail) {
            return serverResponse(res, HttpCodeEnum.OK, "Successfully sent!", {});
            // } else {
            //     throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            // }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
