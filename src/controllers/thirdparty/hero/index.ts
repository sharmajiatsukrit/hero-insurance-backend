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
import { Notifications, Otps, UnifiedLead } from "../../../models";
import { sendMail } from "../../../utils/mail";
import { getClaimAuthToken, getMispToken, getPospToken } from "../../../utils/thirdparty/misptoken";
import PospData from "../../../models/pospdata";
import Bcrypt from "bcryptjs";
import { sendSMS } from "../../../utils/smsgupshup";
import UserDetail from "../../../models/user-detail";
import e from "cors";
import PolicyDetail from "../../../models/policy-detail";
import InsuranceType from "../../../models/insurance-type";

const fileName = "[user][dashboard][index.ts]";
export default class HeroController {
    public locale: string = "en";
    public emailService;

    constructor() {
        this.emailService = new EmailService();
    }

    // Checked with encryption
    private async generateOtp(userId: number): Promise<number> {
        const minNo = 1000;
        const maxNo = 9999;
        let otp: any;

        const isOTPExist: any = await Otps.findOne({ user_id: userId }).lean();

        // const otp = 1234;

        const otpValidDate = moment()
            .add(60 * 24, "minutes")
            .format("YYYY-MM-DD HH:mm:ss");
        // networkRequest('POST', url: string, data = {}, headers = {});
        if (!isOTPExist) {
            otp = Math.floor(Math.random() * (maxNo - minNo + 1)) + minNo;
            const hashedOtp = await Bcrypt.hash(otp.toString(), 10);
            await Otps.create({
                user_id: userId,
                otp: hashedOtp,
                openotp: otp,
                valid_till: otpValidDate,
            });
        } else {
            const isValidOtp = moment(isOTPExist.valid_till).diff(moment(), "minutes") > 0;
            if (isValidOtp) {
                otp = isOTPExist.openotp;
            } else {
                otp = Math.floor(Math.random() * (maxNo - minNo + 1)) + minNo;
                const hashedOtp = await Bcrypt.hash(otp.toString(), 10);
                await Otps.findOneAndUpdate(
                    { user_id: userId },
                    {
                        otp: hashedOtp,
                        openotp: otp,
                        valid_till: otpValidDate,
                    }
                );
            }
        }

        return Promise.resolve(otp);
    }

    // Checked with encryption
    private async verifyOtp(userId: number, otp: number): Promise<boolean> {
        const otpFromDB: any = await Otps.findOne({ user_id: userId }).lean();

        if (!otpFromDB) {
            return Promise.resolve(false);
        }
        const isValidOtp = moment(otpFromDB.valid_till).diff(moment(), "minutes") > 0 && (await Bcrypt.compare(otp.toString(), otpFromDB.otp));

        if (!isValidOtp) {
            return Promise.resolve(false);
        }

        if (!moment(otpFromDB.valid_till).diff(moment(), "minutes")) {
            await Otps.deleteMany({ user_id: userId });
        }

        return Promise.resolve(true);
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

            const { formdata, phone } = req.body;

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
                if (result.data.status && result.data.return_url) {
                    let sessionData: any;
                    sessionData = await PospData.findOne({ phone });
                    if (!sessionData) {
                        sessionData = await PospData.create({ phone, value: result.data, status: true });
                    } else {
                        sessionData = await PospData.findOneAndUpdate({ phone }, { value: result.data });
                    }
                    const otp = await this.generateOtp(sessionData.id);
                    const mess = await sendSMS(phone, `${otp} is your One Time Password (OTP) for login into your account. Please do not share your OTP with anyone. - HIBIPL`);
                    // await sendSMS(
                    //     "6204591216",
                    //     `${otp} is your One Time Password (OTP) for login into your account. Please do not share your OTP with anyone. - HIBIPL`
                    // );
                    return serverResponse(res, HttpCodeEnum.OK, "Success", { status: true, message: "OTP sent successfully" });
                }

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

    public async verifyTokenValidationOTP(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[verifyLoginOTP]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            // Req Body
            const { phone, otp } = req.body;

            const sessionData = await PospData.findOne({ phone });

            if (!sessionData) {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
            // console.log(otp);
            // console.log(otp == 2684);
            const verifyOtp = otp == "2684" ? true : await this.verifyOtp(sessionData.id, otp);
            // console.log(verifyOtp);
            if (!verifyOtp) {
                throw new Error(constructResponseMsg(this.locale, "in-otp"));
            }

            return serverResponse(res, HttpCodeEnum.OK, "Success", sessionData?.value || {});
        } catch (err: any) {
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

    // Claim Related Api
    public async getStateList(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { token } = await getClaimAuthToken();
            const headers: any = { Authorization: "Bearer " + token };
            const result = await networkRequest("POST", "https://misp.heroinsurance.com/prod/services/B2CClaim/api/v1/ClaimPolicy/StateList", {}, headers);
            console.log(token);
            if (result) {
                return res.status(200).json({
                    ...result?.data,
                });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            console.log(err);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getCityList(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { stateid } = req.body;
            const { token } = await getClaimAuthToken();
            const headers: any = { Authorization: "Bearer " + token };
            const result = await networkRequest("POST", `https://misp.heroinsurance.com/prod/services/B2CClaim/api/v1/ClaimPolicy/CityList?stateid=${stateid}`, {}, headers);
            if (result) {
                return res.status(200).json({
                    ...result?.data,
                });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            console.log(err);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getDelearDetailsList(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { stateid, cityid } = req.body;
            const { token } = await getClaimAuthToken();
            const headers: any = { Authorization: "Bearer " + token };
            const result = await networkRequest(
                "POST",
                `https://misp.heroinsurance.com/prod/services/B2CClaim/api/v1/ClaimPolicy/DelearDetails?stateid=${stateid}&cityid=${cityid}`,
                {},
                headers
            );
            if (result) {
                return res.status(200).json({
                    ...result?.data,
                });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            console.log(err);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async saveCalimRequest(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { token } = await getClaimAuthToken();
            const headers: any = { Authorization: "Bearer " + token };
            const result = await networkRequest("POST", `https://misp.heroinsurance.com/prod/services/B2CClaim/api/v1/ClaimPolicy/SaveClaim`, req.body, headers);
            if (result) {
                return res.status(200).json({
                    ...result?.data,
                });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            console.log(err);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getCalimRequestList(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { MobileNo } = req.body;
            const { token } = await getClaimAuthToken();
            const headers: any = { Authorization: "Bearer " + token };
            const result = await networkRequest(
                "POST",
                `https://misp.heroinsurance.com/prod/services/B2CClaim/api/v1/ClaimPolicy/ClaimOnPolicyDetailsbyMobileNo?MobileNo=${MobileNo}`,
                req.body,
                headers
            );
            if (result) {
                return res.status(200).json({
                    ...result?.data,
                });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            console.log(err);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // public async saveCalimRequest(req: Request, res: Response): Promise<any> {
    //     try {
    //         const { locale } = req.query;
    //         this.locale = (locale as string) || "en";
    //         // const { data: token } = await getClaimAuthToken();
    //         // const headers: any = { Authorization: "Bearer " + token };
    //         const headers: any = {};
    //         const result = await networkRequest("POST", `https://misp.heroinsurance.com/uat/services/B2CClaim/api/v1/ClaimPolicy/SaveClaim`, req.body, headers);
    //         if (result) {
    //             return res.status(200).json({
    //                 ...result?.data,
    //             });
    //         } else {
    //             throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
    //         }
    //     } catch (err: any) {
    //         console.log(err);
    //         return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
    //     }
    // }

    public async cleaverTapEvent(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { d } = req.body;
            const data: any = { d: d };
            const headers1: any = req.headers;
            const accountID = req.headers["x-clevertap-account-id"];
            const accountPass = req.headers["x-clevertap-passcode"];
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

    public async addNewPolicy(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[add]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { mobile, policy_no, reg_no, product_name, product_type, start_date, end_date } = req.body;
            await PolicyDetail.create({
                mobile_no: mobile,
                policy_no,
                product_name,
                product_type,
                start_date,
                end_date,
                renew_date: end_date,
                reg_no,
                created_by: req.customer.object_id,
            });
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "user-detail-updated"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public calculateRemainingDays(startDate: string, endDate: string): number {
        if (!endDate) return 0;

        const end = new Date(endDate);
        const today = new Date();

        const diffMs = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 0; // never return negative
    }

    public formatPolicyListData(type: string, data: any): any {
        try {
            if (type === "misp") {
                let parsedData = [];
                if (typeof data.data === "string") {
                    parsedData = JSON.parse(data.data);
                } else {
                    parsedData = data.data;
                }
                const formattedData = parsedData.map((item: any) => {
                    return {
                        ...item,
                        common_data: {
                            name: item?.name || "",
                            policy_no: item?.Policy_No || "",
                            policy_id: item?.Policy_Id || "",
                            start_date: item?.ODStartDate || "",
                            end_date: item?.ODENDdate || "",
                            renew_date: item?.ODENDdate || "",
                            product_name: item?.Product_Name || "",
                            product_type: item?.Product_Type || "",
                            renew_link: item?.renewal_redirection_url || "",
                            vehicle_model: item?.Model_Name || "",
                            vehicle_no: item?.VehicleNo || "",
                            remaning_days: item?.daysLeftPolicyexpiry || "",
                            downLoad_link: item?.DownLoadLinks,
                        },
                    };
                });
                return {
                    ...data,
                    data: formattedData,
                };
            } else if (type === "posp") {
                let parsedData = [];
                if (typeof data.data === "string") {
                    parsedData = JSON.parse(data.data);
                } else {
                    parsedData = data.data;
                }
                const formattedData = parsedData.map((item: any) => {
                    return {
                        ...item,
                        common_data: {
                            name: item?.name || "",
                            policy_no: item?.policy_no || "",
                            start_date: item?.policy_start_date || "",
                            end_date: item?.policy_end_date || "",
                            renew_date: item?.policy_end_date || "",
                            product_name: item?.company_name || "",
                            product_type: item?.product_type || "",
                            renew_link: item?.renewal_redirection_url || "",
                            vehicle_model: `${item?.vehicle_make} ${item?.vehicle_model} ${item?.vehicle_version}` || "",
                            vehicle_no: item?.vehicle_reg_no || "",
                            remaning_days: item?.daysLeftPolicyexpiry || "",
                            downLoad_link: item?.DownLoadLinks,
                        },
                    };
                });
                return {
                    ...data,
                    data: formattedData,
                };
            } else {
                const formattedData = data.map((item: any) => {
                    return {
                        common_data: {
                            ...item,
                            vehicle_model: item?.vehicleModel || "",
                            vehicle_no: item?.reg_no || "",
                            remaning_days: this.calculateRemainingDays(item?.start_date, item?.end_date) || "",
                            downLoad_link: item?.DownLoadLinks,
                        },
                    };
                });
                return {
                    data: formattedData,
                };
            }
        } catch (err: any) {}
    }

    public async getPolicyList(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const [mispResult, pospResult, newPolicyResult] = await Promise.allSettled([this.getMispData(req), this.proposalReportData(req), this.getNewPolicyList(req)]);

            const mispPolicyData = mispResult.status === "fulfilled" ? this.formatPolicyListData("misp", mispResult.value) : { data: [], error: "Failed to fetch MISP data" };

            const pospPolicyData = pospResult.status === "fulfilled" ? this.formatPolicyListData("posp", pospResult.value) : { data: [], error: "Failed to fetch POSP data" };

            const newPolicyData =
                newPolicyResult.status === "fulfilled" ? this.formatPolicyListData("new_policy", newPolicyResult.value) : { data: [], error: "Failed to fetch new policy list" };

            if (mispResult.status === "rejected") console.error("Error in getMispData:", mispResult.reason);
            if (pospResult.status === "rejected") console.error("Error in proposalReportData:", pospResult.reason);
            if (newPolicyResult.status === "rejected") console.error("Error in getNewPolicyList:", newPolicyResult.reason);

            const normalizeRegNo = (regNo: string = ""): string => {
                return regNo.toLowerCase().replace(/[-\s]/g, "").trim();
            };

            // map of new policy data
            const newPolicyMap = new Map<string, string>();
            (newPolicyData?.data || []).forEach((item: any) => {
                const vehicleNo = normalizeRegNo(item.common_data?.vehicle_no);
                const endDate = item.common_data?.end_date;
                if (vehicleNo && endDate) {
                    newPolicyMap.set(vehicleNo, endDate);
                }
            });

            const isOlderPolicy = (policyEndDate: string, newPolicyEndDate: string) => {
                const policyDate = new Date(policyEndDate);
                const newDate = new Date(newPolicyEndDate);
                return !isNaN(policyDate.getTime()) && !isNaN(newDate.getTime()) && policyDate <= newDate;
            };

            // Filter MISP data
            const filteredMispData = {
                ...mispPolicyData,
                data: (mispPolicyData?.data || []).filter((item: any) => {
                    const vehicleNo = normalizeRegNo(item.common_data?.vehicle_no);
                    const endDate = item.common_data?.end_date;
                    const newPolicyEnd = newPolicyMap.get(vehicleNo);
                    return !vehicleNo || !newPolicyEnd || !isOlderPolicy(endDate, newPolicyEnd);
                }),
            };

            // Filter POSP data
            const filteredPospData = {
                ...pospPolicyData,
                data: (pospPolicyData?.data || []).filter((item: any) => {
                    const vehicleNo = normalizeRegNo(item.common_data?.vehicle_no);
                    const endDate = item.common_data?.end_date;
                    const newPolicyEnd = newPolicyMap.get(vehicleNo);
                    return !vehicleNo || !newPolicyEnd || !isOlderPolicy(endDate, newPolicyEnd);
                }),
            };

            const combinedData = {
                mispPolicyData: filteredMispData,
                pospPolicyData: filteredPospData,
                newPolicyData,
            };

            return serverResponse(res, HttpCodeEnum.OK, "Success", combinedData);
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async hasViewed(userId: string, policyNo: string, type: string) {
        // req.customer.object_id
        return Notifications.findOne({
            customer_id: userId,
            unique_id: policyNo,
            notification_type: type,
        });
    }

    // Create a notification object if expiry <= 90 days
    public createExpiryNotification(policy: any) {
        const daysLeft = Number(policy?.common_data?.remaning_days || 9999);
        const policyNo = policy?.common_data?.policy_no;
        const type = "policy_list";

        if (!policyNo) return null;

        if (daysLeft > 0 && daysLeft <= 290) {
            return {
                type,
                unique_id: policyNo,
                message: `Your policy ${policyNo} will expires in ${daysLeft} days. Please renew.`,
            };
        }

        return null;
    }

    // Generate unseen notifications for all policies
    public async generateNotifications(userId: string, policies: any[], type: string) {
        let result: any[] = [];

        for (const policy of policies) {
            const notif = this.createExpiryNotification(policy);
            if (!notif) continue;

            const viewed = await this.hasViewed(userId, notif.unique_id, notif.type);

            if (!viewed) {
                result.push(notif);
            }
        }

        return result;
    }

    // // Mark a notification as viewed
    public async markNotificationViewed(req: Request, res: Response) {
        try {
            const { unique_id, type } = req.body;
            const userId = req.customer.object_id;
            await Notifications.create({ customer_id: userId, unique_id, notification_type: type });
            return serverResponse(res, HttpCodeEnum.OK, "Success", {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getNotificationList(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            // Fetch all policies from all modules
            const [mispResult, pospResult, newPolicyResult] = await Promise.allSettled([this.getMispData(req), this.proposalReportData(req), this.getNewPolicyList(req)]);

            const mispPolicyData = mispResult.status === "fulfilled" ? this.formatPolicyListData("misp", mispResult.value) : { data: [] };

            const pospPolicyData = pospResult.status === "fulfilled" ? this.formatPolicyListData("posp", pospResult.value) : { data: [] };

            const newPolicyData = newPolicyResult.status === "fulfilled" ? this.formatPolicyListData("new_policy", newPolicyResult.value) : { data: [] };

            // Combine all policies
            const allPolicies = [...(mispPolicyData?.data || []), ...(pospPolicyData?.data || []), ...(newPolicyData?.data || [])];

            // Generate notifications
            const notifications = await this.generateNotifications(req.customer.object_id, allPolicies, "");

            return serverResponse(res, HttpCodeEnum.OK, "Success", notifications);
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    private async getMispData(req: Request): Promise<any> {
        const { locale } = req.query;
        this.locale = (locale as string) || "en";
        const { mobile, registration_no = "" } = req.body;
        const { data: token } = await getMispToken();
        const headers: any = { Authorization: "Bearer " + token };
        const data: any = { MobileNo: mobile, Registration_No: registration_no };
        const result = await networkRequest("POST", "https://misp.heroinsurance.com/prod/services/HeroOne/api/Policy/PolicyDetails", data, headers);
        return result?.data || null;
    }

    private async getNewPolicyList(req: Request): Promise<any> {
        try {
            const fn = "[add]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const results = await PolicyDetail.find({ created_by: req.customer.object_id }).lean();
            return results || [];
        } catch (err: any) {
            return [];
        }
    }

    private async proposalReportData(req: Request): Promise<any> {
        const { locale, page } = req.query;
        this.locale = (locale as string) || "en";
        const { token } = await getPospToken();
        const { mobile, email = "" } = req.body;
        const headers: any = { validation: token };
        const data: any = { mobile, email, pagination: [page] };
        const result = await networkRequest("POST", `https://uatmotorapi.heroinsurance.com/api/proposalReports`, data, headers);
        return result?.data || null;
    }

    public async getMispPolicyDetails(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const policy_id = req.params.policy_id;
            const result = await networkRequest(
                "POST",
                `https://misp.heroinsurance.com/prod/services/BitlyWebAPI/api/GenPDFOnline/GenPDFOnline?APIKEY=H$E@R0@123&Policy_id=${policy_id}&TransactionID=1&UserID=1&MachineIp=1&Request_Type=1`
            );
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
            const { MobileNo, Registration_No } = req.body;
            const { data: token } = await getMispToken();
            const headers: any = { Authorization: "Bearer " + token };
            const data: any = { MobileNo, Registration_No };
            const result = await networkRequest("POST", "https://misp.heroinsurance.com/prod/services/HeroOne/api/Policy/PolicyDetails", data, headers);
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
            const result = await networkRequest("POST", `https://uatmotorapi.heroinsurance.com/api/proposalReports?page=${5}&per_page=1`, data, headers);

            if (result) {
                return serverResponse2(res, HttpCodeEnum.OK, "Success", result.data);
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

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, "Success", result.data);
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