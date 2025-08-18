import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { removeObjectKeys, serverResponse, serverErrorHandler, removeSpace, constructResponseMsg, serverInvalidRequest, groupByDate } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import OurJourney from "../../../models/our-journey";

const fileName = "[admin][category][index.ts]";
export default class OurJourneyController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    //     public async getList(req: Request, res: Response): Promise<any> {
    //     try {
    //         const { locale, page, limit } = req.query;
    //         this.locale = (locale as string) || "en";

    //         const pageNumber = parseInt(page as string) || 1;
    //         const limitNumber = parseInt(limit as string) || 10;
    //         const skip = (pageNumber - 1) * limitNumber;

    //         // Fetch all (pagination is kept for both types together)
    //         const results = await OurJourney.find()
    //             .sort({ _id: -1 })
    //             .skip(skip)
    //             .limit(limitNumber)
    //             .populate("created_by", "id name")
    //             .lean();

    //         const totalCount = await OurJourney.countDocuments();
    //         const totalPages = Math.ceil(totalCount / limitNumber);

    //         let imageTypeObj = null;
    //         const iconTypeArr: any[] = [];

    //         results.forEach(item => {
    //             if (item.type === "imageType") {
    //                 imageTypeObj = item;
    //             } else if (item.type === "iconType") {
    //                 iconTypeArr.push(item);
    //             }
    //         });

    //         // Sort iconTypeArr in ascending order of value.year
    //         iconTypeArr.sort((a, b) => {
    //             const yearA = a.value && a.value.year ? a.value.year : 0;
    //             const yearB = b.value && b.value.year ? b.value.year : 0;
    //             return yearA - yearB;
    //         });

    //         return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["category-fetched"]), {
    //             data: {
    //                 imageType: imageTypeObj,
    //                 iconType: iconTypeArr,
    //             },
    //             totalCount,
    //             totalPages,
    //             currentPage: pageNumber,
    //         });
    //     } catch (err: any) {
    //         return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
    //     }
    // }

    // Checked

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const { locale, page, limit } = req.query;
            this.locale = (locale as string) || "en";

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            const results = await OurJourney.find().sort({ _id: -1 }).skip(skip).limit(limitNumber).populate("created_by", "id name").lean();

            const totalCount = await OurJourney.countDocuments();
            const totalPages = Math.ceil(totalCount / limitNumber);

            // Separate imageType and iconType
            let imageTypeObj = null;
            const iconTypeArr: any[] = [];

            results.forEach((item: any) => {
                if (item.type === "image") {
                    imageTypeObj = item;
                } else if (item.type === "icon") {
                    iconTypeArr.push(item);
                }
            });

            return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["category-fetched"]), {
                data: {
                    imageType: imageTypeObj,
                    iconType: iconTypeArr,
                },
                totalCount,
                totalPages,
                currentPage: pageNumber,
            });
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getById(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);

            // Find category by id and fetch details
            const result: any = await OurJourney.findOne({ id }).lean();

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["category-fetched"]), result);
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
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            let { type, value } = req.body;
            // Parse value if it's a string
            if (typeof value === "string") {
                try {
                    value = JSON.parse(value);
                } catch (parseErr) {
                    return serverErrorHandler(parseErr, res, "Invalid JSON in value field.", HttpCodeEnum.SERVERERROR, {});
                }
            }

            let image: any;
            if (req.file) {
                image = req.file.filename;
            }

            let resultDoc; 

            if (type === "image") {
                // Find existing image type
                const existingDoc = await OurJourney.findOne({ type: "image" });
                if (existingDoc) {
                    resultDoc = await OurJourney.findOneAndUpdate(
                        { type: "image" },
                        {
                            type,
                            value: { ...value, image },
                            updated_by: req.user.object_id,
                        },
                        { new: true }
                    );
                } else {
                    resultDoc = await OurJourney.create({
                        type,
                        value: { ...value, image },
                        created_by: req.user.object_id,
                        updated_by: req.user.object_id,
                    });
                }
            } else {
                resultDoc = await OurJourney.create({
                    type,
                    value,
                    created_by: req.user.object_id,
                });
            }

            if (resultDoc) {
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "category-add"), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //Update
    public async update(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[update]";
            const id = parseInt(req.params.id);
            Logger.info(`${fileName + fn} OurJourney id: ${id}`);

            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            let { type, value } = req.body;
            if (typeof value === "string") {
                try {
                    value = JSON.parse(value);
                } catch (parseErr) {
                    return serverErrorHandler(parseErr, res, "Invalid JSON in value field.", HttpCodeEnum.SERVERERROR, {});
                }
            }

            let image: any;
            if (req.file) {
                image = req.file.filename;
            }

            let updateObj: any = {
                type: type,
                updated_by: req.user.object_id,
            };

            if (type === "image") {
                updateObj.value = { ...value, image };
            } else {
                updateObj.value = { ...value };
            }

            const result = await OurJourney.findOneAndUpdate({ id: id }, updateObj, { new: true });

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "category-update"), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
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
            const result = await OurJourney.deleteOne({ id: id });

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
            const fn = "[status]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const { status } = req.body;
            const updationstatus = await OurJourney.findOneAndUpdate({ id: id }, { status: status }).lean();
            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["category-status"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
