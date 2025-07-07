import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import OfferCategory from "../../../models/offer-category";

const fileName = "[admin][offer-category][index.ts]";
export default class OfferCategoryController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getById(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result: any = await OfferCategory.findOne({ id }).lean();

            if (result) {
                const categoryImgUrl = `${process.env.RESOURCE_URL}${result.image}`;

                // Format the result to include the full image URL
                const formattedResult = {
                    ...result,
                    image: categoryImgUrl,
                };

                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["category-fetched"]), formattedResult);
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
            const fn = "[add]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { name, status } = req.body;
            let image: any;
            if (req.file) {
                image = req?.file?.filename;
            }
            const result: any = await OfferCategory.create({
                name: name,
                image: image,
                status: status,
                created_by: req.user.object_id,
            });

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "category-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
    //Update
    public async update(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[update]";
            const id = parseInt(req.params.id);
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { name, status } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            let image: any;
            if (req.file) {
                image = req.file.filename;
            }

            const offerCategory = await OfferCategory.findOne({ id: id });
            if (!offerCategory) {
                return serverResponse(res, HttpCodeEnum.NOTFOUND, constructResponseMsg(this.locale, "award-not-found"), {});
            }

            await OfferCategory.findOneAndUpdate(
                { id: id },
                {
                    name: name,
                    image: image || offerCategory.image,
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
            const fn = "[delete]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result = await OfferCategory.deleteOne({ id: id });

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["category-delete"]), {});
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
            const updationstatus = await OfferCategory.findOneAndUpdate({ id: id }, { status: status }).lean();
            const updatedData: any = await OfferCategory.find({ id: id }).lean();
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
