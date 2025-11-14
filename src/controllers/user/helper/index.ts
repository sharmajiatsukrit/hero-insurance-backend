import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import moment from "moment";
import { Customer, Product, Setting } from "../../../models";
import { removeObjectKeys, serverResponse, serverErrorHandler, removeSpace, constructResponseMsg, serverInvalidRequest, groupByDate } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import EmailService from "../../../utils/email";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import { networkRequest } from "../../../utils/request";
import Category from "../../../models/category";
import Menu from "../../../models/menu";
import InsuranceType from "../../../models/insurance-type";
import CorporateInsuranceType from "../../../models/corporate-insurance-type";
import TailoredBusinessInsuranceType from "../../../models/tailored-business-insurance-type";

const fileName = "[user][helper][index.ts]";
export default class HelperController {
    public locale: string = "en";
    public emailService;

    constructor() {
        this.emailService = new EmailService();
    }

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    // Checked
    public async getMyProfile(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const results: any = await Customer.findOne({ _id: req.customer.object_id }).lean();
            if (results.company_logo.length) {
            }
            if (results) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["customer-fetched"]), results);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Checked
    public async getProductsByCat(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getNewlyAddedProducts]";
            // Set locale
            const { locale, page, limit } = req.query;
            this.locale = (locale as string) || "en";
            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;
            const cat_id = parseInt(req.params.cat_id);
            const category_id: any = await Category.findOne({ id: cat_id }).lean();
            console.log(category_id);
            if (!category_id) {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
            const results: any = await Product.find({ status: true, category_id: category_id._id }).lean().skip(skip).limit(limitNumber).sort({ id: -1 });
            const totalCount = await Product.countDocuments({ status: true });
            const totalPages = Math.ceil(totalCount / limitNumber);
            if (results.length > 0) {
                const formattedResult = results.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    product_image: `${process.env.RESOURCE_URL}${item.product_image}`,
                }));
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["product-fetched"]), {
                    data: formattedResult,
                    totalPages,
                    totalCount,
                    currentPage: pageNumber,
                });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Checked
    public async getGSTDetails(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getGSTDetails]";
            // Set locale
            const { locale, page, limit } = req.query;
            this.locale = (locale as string) || "en";
            const gst = req.params.gst;
            const authorization: any = {};
            console.log(process.env.GSTINCHECK_APIKEY);
            const response = await networkRequest("GET", `http://sheet.gstincheck.co.in/check/${process.env.GSTINCHECK_APIKEY}/${gst}`);
            console.log(response.data);
            if (response.data.flag) {
                const ResultData: any = {
                    leagal_name: response.data.data.lgnm,
                    gstin: response.data.data.gstin,
                    registration_date: response.data.data.rgdt,
                    permanent_address: response.data.data.pradr.adr,
                    addr: response.data.data.pradr.addr,
                    trade_name: response.data.data.tradeNam,
                };
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["gst-fetched"]), ResultData);
            } else {
                throw new Error(response.data.message);
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Checked
    public async getProfileCompleteness(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getProfileCompleteness]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const customer: any = await Customer.findOne({ _id: req.customer.object_id }).lean();
            console.log(customer);
            if (customer) {
                const requiredFields = ["name", "phone", "email", "trade_name", "leagal_name", "gst", "address_line_1"];
                let filledCount = 0;

                // Check how many required fields are filled in the customer's profile
                requiredFields.forEach((field) => {
                    if (customer[field] && customer[field].toString().trim() !== "") {
                        filledCount++;
                    }
                });

                // Calculate completeness percentage
                const completenessPercentage = (filledCount / requiredFields.length) * 100;
                const isComplete = completenessPercentage === 100;
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["product-fetched"]), {
                    percentage: completenessPercentage.toFixed(2) + "%",
                    isComplete: isComplete, // true if 100%, false otherwise
                });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Checked
    public async getTaxCommission(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getTaxCommission]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const customer: any = Customer.findOne({ _id: req.customer.object_id }).lean();
            const result: any = await Setting.findOne({ key: "customer_settings" }).lean();
            const taxCommission = {
                gst: result.value.gst,
                admin_commission: customer.admin_commission ? customer.admin_commission : result.value.admin_commission,
            };
            if (taxCommission) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["product-fetched"]), taxCommission);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //
    public async getMenuList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[menu][getList]";
            // Set locale
            const { locale, page, limit, search } = req.query;
            this.locale = (locale as string) || "en";

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            const filter: any = {};
            filter.is_deleted = false;
            filter.status = true;
            if (search) {
                filter.$or = [{ name: { $regex: search, $options: "i" } }];
            }
            const results = await Menu.find(filter).skip(skip).sort({ menu_order: -1 }).limit(limitNumber).lean().populate("created_by", "id name");

            const totalCount = await Menu.countDocuments(filter);
            const totalPages = Math.ceil(totalCount / limitNumber);

            if (results.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["faq-fetched"]), {
                    data: results,
                    totalCount,
                    totalPages,
                    currentPage: pageNumber,
                });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
    public async getInsuranceTypeList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getRoles]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";


            const result = await InsuranceType.find({}).where('status').equals(true).sort([['id', 'desc']]).select('id name key show_reg_no_field').lean();

            if (result.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["role-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
    public async getCorporateInsuranceTypeList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getRoles]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";


            const result = await CorporateInsuranceType.find({}).where('status').equals(true).sort([['id', 'desc']]).select('id name').lean();

            if (result.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["role-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
    public async getTailoredBusinessInsuranceTypeList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getRoles]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";


            const result = await TailoredBusinessInsuranceType.find({}).where('status').equals(true).sort([['id', 'desc']]).select('id name').lean();

            if (result.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["role-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

}
