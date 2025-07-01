import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import validator from "validator";
import Bcrypt from "bcryptjs";
import { DateTime } from "luxon";
import moment from "moment";
import { Roles, Permissions, User, Customer } from "../../../models";
import { removeObjectKeys, serverResponse, serverErrorHandler, removeSpace, constructResponseMsg, serverInvalidRequest, groupByDate } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import EmailService from "../../../utils/email";
import { getPostsForAdmin, getPostsForAdminBySubscriberId, getChatCount, getPostCount, postDelete } from "../../../services/Chat";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";

const fileName = "[admin][customer][index.ts]";
export default class UserController {
    public locale: string = "en";
    public emailService;

    constructor() {
        this.emailService = new EmailService();
    }

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }


    // Checked
    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getList]";
            // Set locale
            const { locale, page, limit, search } = req.query;
            this.locale = (locale as string) || "en";

            // Parse page and limit from query params, set defaults if not provided
            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 5;

            // Calculate the number of documents to skip
            const skip = (pageNumber - 1) * limitNumber;


            let searchQuery = {};
            if (search) {
                searchQuery = {

                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { phone: { $regex: search, $options: 'i' } },
                        { date_of_birth: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } }, // Case-insensitive search for name
                    ]
                };
            } else {
                searchQuery = {};
            }
            const result = await Customer.find(searchQuery)
                .sort({ id: -1 })
                .skip(skip)
                .limit(limitNumber).lean();

            const totalCount = await Customer.countDocuments({});

            if (result.length > 0) {
                const totalPages = Math.ceil(totalCount / limitNumber);
                return serverResponse(
                    res,
                    HttpCodeEnum.OK,
                    ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["customer-fetched"]),
                    { data: result, totalPages, totalCount, currentPage: pageNumber }
                );
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }


    // Checked
    public async getById(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const results = await Customer.findOne({ id: id }).lean();

            if (results) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["customer-fetched"]), results);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async add(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[add]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";


            const { name, phone, email, company_name, brand_name, company_logo, gst, telephone, company_email, address_line_1, address_line_2, open_time, close_time, parent_id, status } = req.body;

            // Check if email already exists
            const existingUser = await Customer.findOne({ phone: phone });
            if (existingUser) {
                return serverResponse(res, HttpCodeEnum.BADREQUEST, constructResponseMsg(this.locale, "email-already-exists"), {});
            }


            const result: any = await Customer.create({
                name: name,
                phone: phone,
                email: email,
                company_name: company_name,
                brand_name: brand_name,
                gst: gst,
                telephone: telephone,
                company_email: company_email,
                address_line_1: address_line_1,
                address_line_2: address_line_2,
                open_time: open_time,
                close_time: close_time,
                parent_id: parent_id,
                status: status,
            });
            if (result) {
                let company_logo: any;
                if (req.file) {
                    company_logo = req?.file?.filename;
                    let resultimage: any = await Customer.findOneAndUpdate({ id: result.id }, { company_logo: company_logo });
                }
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "customer-add"), {});
            } else {

            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async fetchUserDetails(userId: number, billing = "") {
        try {
            const userData: any = await Customer.findOne({ id: userId }, { password: false, account_status: false, subscribed_to: false });

            delete userData._doc.__enc_email;
            delete userData._doc.__enc_communication_email;
            delete userData._doc.__enc_mobile_number;
            delete userData._doc.__enc_city;

            if (!userData) {
                throw new Error(constructResponseMsg(this.locale, "user-nf"));
            }

            userData._doc.user_date_format = userData._doc.date_format;
            userData._doc.user_time_format = (userData._doc.time_format === "24") ? "HH:mm" : "hh:mm a";
            userData._doc.user_date_time_format = userData._doc.user_date_format + " " + userData._doc.user_time_format;

            const formattedUserData: any = userData._doc;

            return Promise.resolve(formattedUserData);
        } catch (err: any) {
            return Promise.reject(err);
        }
    }

    private async getExistingUser(email: string): Promise<any> {
        // Search on encrypted email field
        const messageToSearchWith: any = new User({ email });
        messageToSearchWith.encryptFieldsSync();

        const userData: any = await Customer.findOne({ "$or": [{ email: messageToSearchWith.email }, { communication_email: messageToSearchWith.email }] });

        if (userData) {
            return Promise.resolve(userData._doc);
        }

        return Promise.resolve({ is_email_verified: false });
    }

    public async update(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[updateMyProfile]";

            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { name, phone, designation,email, trade_name, leagal_name, gst, telephone, company_email, address_line_1, address_line_2,city,state,pincode, open_time, close_time, parent_id, status } = req.body;
            const id = parseInt(req.params.id);
            // const customer:any = Customer.findOne({id:id}).lean();
            
            let result: any = await Customer.findOneAndUpdate(
                { id: id },
                {
                    name: name,
                    email: email,
                    designation: designation,
                    trade_name: trade_name,
                    leagal_name: leagal_name,
                    gst: gst,
                    telephone: telephone,
                    company_email: company_email,
                    address_line_1: address_line_1,
                    address_line_2: address_line_2,
                    city: city,
                    state: state,
                    pincode: pincode,
                    open_time: open_time,
                    close_time: close_time,
                    status: status
                });

            
            const userData: any = await Customer.findOne({ id: id }).lean();

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "customer-updated"), userData);
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async updateCompanyLogo(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[updateMyProfile]";

            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const id = parseInt(req.params.id);
            // const customer:any = Customer.findOne({id:id}).lean();
            let company_logo: any;
            if (req.file) {
                company_logo = req?.file?.filename;
                let resultimage: any = await Customer.findOneAndUpdate({ id: id }, { company_logo: company_logo });
            }
            // const userData: any = await Customer.findOne({ _id: req.customer.object_id }).lean();

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "customer-updated"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Checked
    public async delete(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[delete]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result = await Customer.deleteOne({ id: id });

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["customer-deleted"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Checked
    public async status(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[status]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const { status } = req.body;
            const updationstatus = await Customer.findOneAndUpdate({ id: id }, { status: status }).lean();
            const result: any = await this.fetchUserDetails(id);
            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["customer-status"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // public async changePass(req: Request, res: Response): Promise<any> {
    //     try {
    //         const fn = "[changepass]";
    //         // Set locale
    //         const { locale } = req.query;
    //         this.locale = (locale as string) || "en";

    //         const { id } = req.params;
    //         const { currentpass, newpass, confirmpass } = req.body;

    //         // Fetch the user by id
    //         const user = await Customer.findOne({ id: id }).lean();

    //         if (!user) {
    //             throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
    //         }

    //         // Check if the current password matches the user's password
    //         const isMatch = await Bcrypt.compare(currentpass, user.password);
    //         if (!isMatch) {
    //             return serverResponse(res, HttpCodeEnum.UNAUTHORIZED, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["incorrect-password"]), {});
    //         }

    //         // Check if new password and confirm password match
    //         if (newpass !== confirmpass) {
    //             return serverResponse(res, HttpCodeEnum.BADREQUEST, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["password-mismatch"]), {});
    //         }

    //         // Hash the new password
    //         const saltRounds = 10;
    //         const hashedPassword = await Bcrypt.hash(newpass, saltRounds);

    //         // Update the user's password
    //         const updationstatus = await Customer.findOneAndUpdate({ id: id }, { password: hashedPassword }).lean();

    //         if (updationstatus) {
    //             return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["password-updated"]), {});
    //         } else {
    //             throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["update-failed"]));
    //         }
    //     } catch (err: any) {
    //         return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
    //     }
    // }
}