import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import moment from "moment";
import { removeObjectKeys, serverResponse, serverErrorHandler,serverThirdPartyErrorHandler, removeSpace, constructResponseMsg, serverInvalidRequest, groupByDate } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import EmailService from "../../../utils/email";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import { networkRequest } from "../../../utils/request";
import { randomUUID } from "crypto";
import { UnifiedLead } from "../../../models";
import {sendMail} from "../../../utils/mail";
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
    
                const { first_name, last_name,mobile_no,email_id, reg_no,segment,redirection,source,utm,seller_details } = req.body;

                const data:any = { first_name, last_name,mobile_no,email_id, reg_no,segment,redirection,source,utm,seller_details };
                const headers:any = {};
                const result = await networkRequest('POST','https://uatmotorapi.heroinsurance.com/api/hibl-lead-generation',data,headers);
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

    public async tokenValidation(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { formdata } = req.body;


            const login = await networkRequest('POST','https://uatdashboard.heroinsurance.com/generate_login_token_hero_sso',{
                                    username:"HEROLOGINSSO",
                                    password:"P8r0AL5sRagd"
                                },{});
            console.log(login.data);
            if(login.data.status){
                const data:any = { "access-token":login.data.token, formdata:formdata };
                const headers:any = {};
                const result = await networkRequest('POST','https://uatdashboard.heroinsurance.com/login_token_validate',data,headers);
                // console.log(result.data);
                
                if (result) {
                    return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
                } else {
                    throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
                }
            }else{
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
            
            // throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
    
    public async healthQuote(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { section, name,email,gender, mobile,params,utm,seller_details,type,members,plan_type,pincode,existing_diseases,unified_lead,from_unified_enquiry } = req.body;
            const lastNO:any = await UnifiedLead.findOne({  }).sort({ unique_no: -1 });
            // console.log(lastNO);
            let unique_generate: any = 0;
            if (lastNO) {
                unique_generate = parseInt(lastNO.unique_no) + 1;
            } else {
                unique_generate = 1;
            }
            console.log(unique_generate.toString().padStart(7, '0'));
            const unique_id:any = await UnifiedLead.create({unique_no: unique_generate.toString().padStart(7, '0')});
            const data:any = { section, name,email,gender, mobile,params,utm,seller_details,type,members,plan_type,pincode,existing_diseases,unified_lead:'UL'+unique_id.unique_no.toString().padStart(7, '0'),from_unified_enquiry };
            console.log(data);
            const headers:any = {'SHOW-FULL-TRACE':''};
                const result = await networkRequest('POST','https://uathealthapi.heroinsurance.com/api/v1/unified_enquiries',data,headers);
                // console.log(result.status);
                
                if (result) {
                    return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
                } else {
                    throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
                }
        } catch (err: any) {
            console.log(err.response.data);
            return res.status(500).json({
                status: err.response.data.status,
                code: err.response.data.code,
                message: err.response.data.error,
                data: [],
                error: err,
            });
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async mispLogin(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const authorization:any = req.headers.authorization;
            const { username, password } = req.body;
            const token = authorization.split(" ")[1];
            console.log(token);
            const data:any = { username, password };
                const headers:any = {"Authorization":"Bearer "+token};
                const result = await networkRequest('POST','https://misp.heroinsurance.com/uat/services/HeroOne/api/Login/ValidateMISPLogin',data,headers);
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
            const data:any = { auth_user, auth_pass };
            const headers:any = {};
            const result = await networkRequest('GET','https://misp.heroinsurance.com/uat/services/HeroOne/api/Authenticate/MISPAuthorization',data,headers);
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

    public async renewalLink(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const authorization:any = req.headers.authorization;
            const { MobileNo, Registration_No } = req.body;
            const token = authorization.split(" ")[1];
            console.log(token);
            const data:any = { MobileNo, Registration_No };
                const headers:any = {"Authorization":"Bearer "+token};
                const result = await networkRequest('POST','https://misp.heroinsurance.com/uat/services/HeroOne/api/Policy/RenewalLink',data,headers);
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

    public async cpDetails(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const authorization:any = req.headers.authorization;
            const { CPID } = req.body;
            const token = authorization.split(" ")[1];
            console.log(token);
            const data:any = { CPID };
                const headers:any = {"Authorization":"Bearer "+token};
                const result = await networkRequest('POST','https://misp.heroinsurance.com/uat/services/HeroOne/api/ChannelPartner/CPDetails',data,headers);
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

    public async registerCliam(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const authorization:any = req.headers.authorization;
            const { name, email,mobile,insurance_type,details } = req.body;
            const body:string = `Hello Admin,<br>
                                    New Claim Registration request received. Below are the details.<br>
                                    <strong>Name: </strong>${name}<br>
                                    <strong>Email: </strong>${email}<br>
                                    <strong>Mobile: </strong>${mobile}<br>
                                    <strong>Insurance Type: </strong>${insurance_type}<br>
                                    <strong>Details: </strong>${details}<br>
                                    Thanks,<br> Regards Hero Insurance
                                    `;
            await sendMail('ravi.anand@heroibil.com,shailendra@sukritinfotech.com','New Claim Registration',body,[]);
                
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
            const data:any = { d:d };
            const headers:any = {"X-CleverTap-Account-Id":"TEST-Z86-97R-4W7Z","X-CleverTap-Passcode":"GYC-TMC-ASEL"};
            const result = await networkRequest('POST','https://in1.api.clevertap.com/1/upload',data,headers);
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
}