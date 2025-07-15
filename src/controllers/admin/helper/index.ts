import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { Customer, Country, State, City, Roles, Product } from "../../../models";
import { removeObjectKeys, serverResponse, serverErrorHandler, removeSpace, constructResponseMsg, serverInvalidRequest, groupByDate } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import EmailService from "../../../utils/email";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import OfferCategory from "../../../models/offer-category";
import Location from "../../../models/location";

const fileName = "[admin][helper][index.ts]";
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
    public async getCategories(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getCategories]";
            const { locale, page, limit, search } = req.query;
            this.locale = (locale as string) || "en";
            // Constructing the search query
            let searchQuery = {};
            if (search) {
                searchQuery = {
                    status: true,
                    $or: [
                        { name: { $regex: search, $options: 'i' } } // Case-insensitive search for name
                    ]
                };
            } else {
                searchQuery = { status: true, };
            }
            // const result: any = await Category.find(searchQuery).select('id name').limit(10).sort({ id: -1 }).lean();
            const result: any = await City.aggregate([
                {
                  $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "parent_id",
                    as: "children",
                  },
                },
                {
                  $match: { children: { $size: 0 }, ...searchQuery }, // Get only last child categories
                },
                {
                  $project: {
                    id: 1,
                    name: 1,
                  },
                },
                {
                  $sort: { id: -1 }, // Sorting based on ID
                },
                {
                  $limit: 10,
                },
              ]);
            console.log(result);
            if (result.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "category-fetched"), result);
            } else {
                throw new Error(
                    ServerMessages.errorMsgLocale(
                        this.locale,
                        ServerMessagesEnum["not-found"]
                    )
                );
            }
        } catch (err: any) {
            return serverErrorHandler(
                err,
                res,
                err.message,
                HttpCodeEnum.SERVERERROR,
                []
            );
        }
    }


    public async getCounties(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getCounties]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";


            const result = await Country.find({}).where('status').equals(true).sort([['id', 'desc']]).select('id name').lean();

            if (result.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["country-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getStates(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getStates]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";


            const result = await State.find({}).where('status').equals(true).sort([['id', 'desc']]).select('id name').lean();

            if (result.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["state-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getCities(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getCities]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";


            const result = await City.find({}).where('status').equals(true).sort([['id', 'desc']]).select('id name').lean();

            if (result.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["city-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }


    public async getRoles(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getRoles]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";


            const result = await Roles.find({}).where('status').equals(true).sort([['id', 'desc']]).select('id name').lean();

            if (result.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["role-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getCustomers(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getCustomers]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";


            const result = await Customer.find({}).where('status').equals(1).sort([['id', 'desc']]).select('id name').lean();

            if (result.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["role-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getDashboardTotals(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getCustomers]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";


            const customers = await Customer.countDocuments({});
            const categories = await City.countDocuments({});
            const products = await Product.countDocuments({});
            const totals = {
                total_customer:customers,
                total_categories:categories,
                total_products:products,
                total_buying_offers:products,
                total_selling_offers:products,
                total_earnings:products,
            }
            if (totals) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["role-fetched"]), totals);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    
    // Checked
    public async getOfferCategories(req: Request, res: Response): Promise<any> {
        try {
            const { locale, page, limit, search } = req.query;
            this.locale = (locale as string) || "en";

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;
            let searchQuery: any = {};
            if (search) {
                searchQuery.$or = [{ name: { $regex: search, $options: "i" } }];
            }
            const results = await OfferCategory.find(searchQuery)
                .sort({ _id: -1 }) // Sort by _id in descending order
                .skip(skip)
                .limit(limitNumber)
                .lean();

            // Get the total number of documents in the Category collection
            const totalCount = await OfferCategory.countDocuments(searchQuery);

            // Calculate total pages
            const totalPages = Math.ceil(totalCount / limitNumber);

            if (results.length > 0) {
                // Format each item in the result array
                const formattedResults = results.map((item, index) => ({
                    ...item,
                    image: `${process.env.RESOURCE_URL}${item.image}`,
                }));

                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["category-fetched"]), {
                    data: formattedResults,
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

    
    public async getLocationList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[location][getList]";
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
                const regexSearch = { $regex: search, $options: "i" };
                filter.$or = [
                    { location: regexSearch },
                    { longitude: regexSearch },
                    { longitude: regexSearch },
                ];
            }
            const results = await Location.find(filter).skip(skip).limit(limitNumber).lean()

            if (results.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["faq-fetched"]), {
                    data: results,
                });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }


}