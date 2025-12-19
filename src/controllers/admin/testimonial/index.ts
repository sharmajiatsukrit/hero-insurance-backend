import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import Testimonial from "../../../models/testimonial";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import Location from "../../../models/location";
import TestimonialCategory from "../../../models/testimonial-category";

const fileName = "[admin][testimonial][index.ts]";
export default class TestimonialController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[testimonial][getList]";
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
            const results = await Testimonial.find(filter).sort({ _id: -1 }).skip(skip).limit(limitNumber).populate("locationId", "id region location latitude longitude").populate("categoryId", "id name").lean();

            const totalCount = await Testimonial.countDocuments(filter);
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

    public async getById(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[testimonial][getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result: any = await Testimonial.findOne({ id: id }).populate("locationId", "id region location latitude longitude").populate("categoryId", "id name").lean();
            

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //add
    public async add(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[testimonial][add]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { name, location, star_rating, description, locationId, categoryId, status = true } = req.body;
            const rating = Number(star_rating);
            let result: any;
            let locationData: any = null;
            let locationObjId: any = null;
            let categoryData: any = null;
            let categoryObjectId = null;
            if (locationId) {
                locationData = await Location.findOne({ id: locationId }).lean();
                locationObjId = locationData._id;
            }
            if (categoryId) {
                categoryData = await TestimonialCategory.findOne({ id: categoryId }).lean();
                categoryObjectId = categoryData?._id;
            }
            result = await Testimonial.create({
                name: name,
                location: location,
                star_rating: rating,
                description: description,
                locationId: locationObjId,
                categoryId:categoryObjectId,
                status: status,
            });

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "enquiry-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //Update
    public async update(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[testimonial][update]";
            const id = parseInt(req.params.id);

            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { name, location, star_rating, description, locationId, categoryId, status = true } = req.body;
            const rating = Number(star_rating);

            let locationData: any = null;
            let locationObjId: any = null;
            let categoryData: any = null;
            let categoryObjectId = null;

            if (locationId) {
                locationData = await Location.findOne({ id: locationId }).lean();
                locationObjId = locationData?._id;
            }
             if (categoryId) {
                categoryData = await TestimonialCategory.findOne({ id: categoryId }).lean();
                categoryObjectId = categoryData?._id;
            }

            const updateData: any = {
                name,
                location,
                star_rating: rating,
                description,
                locationId: locationObjId,
                categoryId:categoryObjectId,
                status,
            };

            if (locationObjId) {
                updateData.locationId = locationObjId;
            }

            await Testimonial.findOneAndUpdate({ id }, updateData);

            const updatedData: any = await Testimonial.findOne({ id })
                .populate("locationId", "id region location latitude longitude") // Populate location info if needed
                .lean();

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "enquiry-update"), updatedData);
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Delete
    public async delete(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[testimonial][delete]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result = await Testimonial.deleteOne({ id: id });

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-delete"]), result);
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
            const fn = "[enquiry][status]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const { status } = req.body;
            const updationstatus = await Testimonial.findOneAndUpdate({ id: id }, { status: status }).lean();
            const updatedData: any = await Testimonial.find({ id: id }).lean();
            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-status"]), updatedData);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
