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
                const result = await networkRequest('POST','https://apimotor.heroinsurance.com/api/hibl-lead-generation',data,headers);
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


            const login = await networkRequest('POST','https://dashboard.heroinsurance.com/generate_login_token_hero_sso',{
                                    username:"HEROPRODSSO",
                                    password:"M9r0HL8sRado"
                                },{});
            console.log(login.data);
            if(login.data.status){
                const data:any = { "access-token":login.data.token, formdata:formdata };
                const headers:any = {};
                const result = await networkRequest('POST','https://dashboard.heroinsurance.com/login_token_validate',data,headers);
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

            const { section, name,email,gender, mobile,source,params,utm,seller_details,type,from_unified_enquiry } = req.body;
            const lastNO:any = await UnifiedLead.findOne({  }).sort({ unique_no: -1 });
            
            let unique_generate: any = 0;
            if (lastNO) {
                unique_generate = parseInt(lastNO.unique_no) + 1;
            } else {
                unique_generate = 1;
            }
            
            const unique_id:any = await UnifiedLead.create({unique_no: unique_generate.toString().padStart(7, '0')});
            const data:any = { section, name,email,gender, mobile,params,source,utm,seller_details,type,unified_lead:'UL'+unique_id.unique_no.toString().padStart(7, '0'),from_unified_enquiry };
            // console.log(data);
            const headers:any = {'SHOW-FULL-TRACE':''};
            const result = await networkRequest('POST','https://apihealth.heroinsurance.com/api/v1/unified_enquiries',data,headers);
            // console.log(result);
                
                if (result) {
                    return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
                } else {
                    throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
                }
        } catch (err: any) {
            console.log(err.response);
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
            const authorization:any = req.headers.authorization;
            const { username, password } = req.body;
            const token = authorization.split(" ")[1];
            console.log(token);
            const data:any = { username, password };
                const headers:any = {"Authorization":"Bearer "+token};
                const result = await networkRequest('POST','https://misp.heroinsurance.com/prod/services/HeroOne/api/Login/ValidateMISPLogin',data,headers);
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
            const result = await networkRequest('GET','https://misp.heroinsurance.com/prod/services/HeroOne/api/Authenticate/MISPAuthorization',data,headers);
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
            const authorization:any = req.headers.authorization;
            const { MobileNo, Registration_No } = req.body;
            const token = authorization.split(" ")[1];
            console.log(token);
            const data:any = { MobileNo, Registration_No };
                const headers:any = {"Authorization":"Bearer "+token};
                const result = await networkRequest('POST','https://misp.heroinsurance.com/prod/services/HeroOne/api/Policy/RenewalLink',data,headers);
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
            // console.log(token);
            const data:any = { CPID };
                const headers:any = {"Authorization":"Bearer "+token};
                const result = await networkRequest('POST','https://misp.heroinsurance.com/prod/services/HeroOne/api/ChannelPartner/CPDetails',data,headers);
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
            const headers1:any = req.headers
            const accountID = req.headers['x-clevertap-account-id'];
            const accountPass = req.headers['x-clevertap-passcode'];
            console.log(accountID,accountPass,headers1);
            const headers:any = {"X-CleverTap-Account-Id":accountID,"X-CleverTap-Passcode":accountPass};
            const result = await networkRequest('POST','https://in1.api.clevertap.com/1/upload',data,headers);
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
}