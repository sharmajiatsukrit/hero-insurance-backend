import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";

import validate from "./validate";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import Offer from "../../../models/offer";
import OfferCategory from "../../../models/offer-category";

const fileName = "[admin][offer][index.ts]";
export default class OfferController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[kof][getList]";
            // Set locale
            const { locale, page, limit, search } = req.query;
            this.locale = (locale as string) || "en";

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            const filter: any = {};
            filter.is_deleted = false;
            if (search) {
                filter.$or = [{ name: { $regex: search, $options: "i" } }];
            }
            const results = await Offer.find(filter).sort({ _id: -1 }).skip(skip).limit(limitNumber).lean().populate("categoryId", "id name image");

            const totalCount = await Offer.countDocuments(filter);
            const totalPages = Math.ceil(totalCount / limitNumber);
            let formattedResults: any[] = [];

            if (results.length > 0) {
                formattedResults = results.map((item: any) => ({
                    ...item,
                    offer_image: item.offer_image ? `${process.env.RESOURCE_URL}${item.offer_image}` : null,
                }));
            }
            if (results.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["faq-fetched"]), {
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

    public async getById(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[offer][getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result: any = await Offer.findOne({ id: id }).lean().populate("categoryId", "id name image");
            

            if (result) {
                result.offer_image = `${process.env.RESOURCE_URL}${result.offer_image}`;
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async add(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[offer][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { offer_name, offer_link, valid_from, valid_to, category_id, status } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            let offer_image: any;
            if (req.file) {
                offer_image = req?.file?.filename;
            }
            let categoryId: any = null;
            let categoryObjectId = null;

            if (category_id) {
                categoryId = await OfferCategory.findOne({ id: category_id }).lean();
                Logger.info(`${fileName + fn} Found category: ${JSON.stringify(categoryId)}`);
                categoryObjectId = categoryId._id;
            }
            const result: any = await Offer.create({
                offer_name: offer_name,
                offer_link: offer_link,
                valid_from: valid_from,
                valid_to: valid_to,
                categoryId: categoryObjectId,
                offer_image: offer_image,
                status: status,
                created_by: req.user?.object_id,
            });

            Logger.info(`${fileName + fn} Created blog: ${JSON.stringify(result)}`);

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
    public async update(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[offer][update]";
            const id = parseInt(req.params.id);
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { offer_name, offer_link, valid_from, valid_to, category_id, status } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            let offer_image: any;
            if (req.file) {
                offer_image = req.file.filename;
            }
            let categoryId: any = null;
            let categoryObjectId = null;

            if (category_id) {
                categoryId = await OfferCategory.findOne({ id: category_id }).lean();
                Logger.info(`${fileName + fn} Found category: ${JSON.stringify(categoryId)}`);
                categoryObjectId = categoryId._id;
            }
            const offer = await Offer.findOne({ id: id });
            if (!offer) {
                return serverResponse(res, HttpCodeEnum.NOTFOUND, constructResponseMsg(this.locale, "award-not-found"), {});
            }

            await Offer.findOneAndUpdate(
                { id: id },
                {
                    offer_name: offer_name,
                    offer_link: offer_link,
                    valid_from: valid_from,
                    valid_to: valid_to,
                    offer_image: offer_image || offer.offer_image,
                    categoryId: categoryObjectId,
                    status: status,
                    updated_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-update"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Delete
    public async delete(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[offer][delete]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result = await Offer.deleteOne({ id: id });

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-delete"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Status
    public async status(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[offer][status]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const { status } = req.body;
            const updationstatus = await Offer.findOneAndUpdate({ id: id }, { status: status }).lean();
            const updatedData: any = await Offer.find({ id: id }).lean();
            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-status"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
