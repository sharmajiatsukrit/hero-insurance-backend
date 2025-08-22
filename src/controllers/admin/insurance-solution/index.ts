import { Request, Response } from "express";
import { ValidationChain } from "express-validator";;
import { serverResponse, serverErrorHandler } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import InsuranceSolution from "../../../models/insurance-soluction";

export default class InsuranceSolutionController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const { locale, } = req.query;
            this.locale = (locale as string) || "en";

            const result = await InsuranceSolution.find().lean()

            if (result.length > 0) {
                const formattedResult = result.map((item: any) => ({
                    ...item,
                    image:`${process.env.RESOURCE_URL}${item.image}`,

                }));
                return serverResponse(
                    res,
                    HttpCodeEnum.OK,
                    ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["banner-fetched"]),
                    { data: formattedResult }
                );
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getById(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result = await InsuranceSolution.findOne({ id }).lean();

            if (result) {
                const formattedResult = {
                   ...result,
                   image:`${process.env.RESOURCE_URL}${result.image}`,

                };

                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["banner-fetched"]), formattedResult);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async add(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, link, status } = req.body;

            let imageName: any;
            if (req.file) {
                imageName = req?.file?.filename;
            } else {
                return serverResponse(res, HttpCodeEnum.SERVERERROR, "No Banner Attached", {});
            }

            await InsuranceSolution.create({
                title, link, image:imageName,  status,
                created_by: req.user.object_id
            });

            return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["banner-add"]), {});

        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, link, status } = req.body;
            const { id } = req.params;

            let imageName: any;
            if (req.file) {
                imageName = req?.file?.filename;
            }

            let result: any = await InsuranceSolution.findOneAndUpdate(
                { id: id },
                {
                   title, link, image:imageName,  status,
                    updated_by: req.user.object_id
                });

           
            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["banner-update"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["server-error"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async delete(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { id } = req.params;

            const result = await InsuranceSolution.findOne({ id: id });

            if (result) {
                await InsuranceSolution.deleteOne();
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["banner-delete"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async updateStatus(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { id } = req.params;
            const { status } = req.body;

            const result = await InsuranceSolution.findOne({ id: id });

            if (result) {
                result.status = status;
                await result.save();

                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["banner-status"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

}
