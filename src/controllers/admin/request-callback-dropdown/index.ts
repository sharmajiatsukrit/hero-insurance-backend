import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import validate from "./validate";
import { constructResponseMsg, serverErrorHandler, serverResponse } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import RequestCallbackDropdown from "../../../models/request-callback-dropdown";

export default class RequestCallbackDropdownController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const { locale, page, limit, search } = req.query;
            this.locale = (locale as string) || "en";

            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            const baseFilter: any = {};

            if (search) {
                baseFilter.$or = [{ name: { $regex: search, $options: "i" } }];
            }

            // Fetch both types in parallel
            const [serviceData, timeSlotData, serviceDataCount, timeSlotDataCount] = await Promise.all([
                RequestCallbackDropdown.find({ ...baseFilter, type: 0 })
                    .sort({ _id: -1 })
                    .skip(skip)
                    .limit(limitNumber)
                    .lean(),

                RequestCallbackDropdown.find({ ...baseFilter, type: 1 })
                    .sort({ _id: -1 })
                    .skip(skip)
                    .limit(limitNumber)
                    .lean(),

                RequestCallbackDropdown.countDocuments({ ...baseFilter, type: 0 }),
                RequestCallbackDropdown.countDocuments({ ...baseFilter, type: 1 }),
            ]);

            return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["insurance-type-fetched"]), {
                serviceData: {
                    data: serviceData,
                    totalCount: serviceDataCount,
                    totalPages: Math.ceil(serviceDataCount / limitNumber),
                    currentPage: pageNumber,
                },
                timeSlotData: {
                    data: timeSlotData,
                    totalCount: timeSlotDataCount,
                    totalPages: Math.ceil(timeSlotDataCount / limitNumber),
                    currentPage: pageNumber,
                },
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
            const result: any = await RequestCallbackDropdown.findOne({ id: id }).lean();

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["insurance-type-fetched"]), result);
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
            const { name, key, type, status } = req.body;
            await RequestCallbackDropdown.create({
                name: name,
                key,
                type,
                status,
                created_by: req.user.object_id,
            });

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "insurance-type-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //Update
    public async update(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[update]";

            const id = parseInt(req.params.id);

            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { name, key, status, type } = req.body;
            let result: any = await RequestCallbackDropdown.findOneAndUpdate(
                { id: id },
                {
                    name: name,
                    key,
                    status: status,
                    type,
                    updated_by: req.user.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "insurance-type-update"), {});
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
            const result = await RequestCallbackDropdown.deleteOne({ id: id });

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["insurance-type-delete"]), {});
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
            const updationstatus = await RequestCallbackDropdown.findOneAndUpdate({ id: id }, { status: status }).lean();
            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["insurance-type-status"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
