import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import moment from "moment";
import { Setting } from "../../../models";
import { removeObjectKeys, serverResponse, serverErrorHandler, removeSpace, constructResponseMsg, serverInvalidRequest, groupByDate } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import EmailService from "../../../utils/email";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";

const fileName = "[admin][faq][index.ts]";
export default class SettingController {
    public locale: string = "en";
    public emailService;

    constructor() {
        this.emailService = new EmailService();
    }

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    // Checked
    public async getSettings(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getList]";
            // Set locale
            const { locale, key } = req.query;
            this.locale = (locale as string) || "en";

            const result: any = await Setting.findOne({ key: key }).lean();
            let formattedResult: any = {};

            if (result) {
                formattedResult = {
                    ...result,
                    value: {
                        ...result.value,
                        ...(result.value?.site_logo && {
                            site_logo: `${process.env.RESOURCE_URL}${result.value.site_logo}`,
                        }),
                        ...(result.value?.site_favicon && {
                            site_favicon: `${process.env.RESOURCE_URL}${result.value.site_favicon}`,
                        }),
                    },
                };
            }
            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["settings-fetched"]), formattedResult);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //add

    public async saveAppDetails(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[add]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { site_name, site_url } = req.body;
            // Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            let site_logo: string | undefined;
            let site_favicon: string | undefined;

            if (req.files && !Array.isArray(req.files)) {
                const files = req.files as { [key: string]: Express.Multer.File[] };

                site_logo = files.site_logo?.[0]?.filename;
                site_favicon = files.site_favicon?.[0]?.filename;
            }
            let existing = await Setting.findOne({ key: "app_details" });
            if (!existing) {
                await Setting.create({
                    key: "app_details",
                    value: { site_name, site_url, site_logo, site_favicon },
                    created_by: req.user.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "settings-saved"), {});
            }
            let result: any = await Setting.findOneAndUpdate(
                { key: "app_details" },
                {
                    value: { site_name, site_url, site_logo, site_favicon },
                    created_by: req.user.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "settings-saved"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async saveSMTPDetails(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[add]";
            // Set locale
            const { locale, key } = req.query;
            this.locale = (locale as string) || "en";

            const { smtp_host, encrtption, smtp_port, username, password, from_email, smtp_enabled, from_name } = req.body;
            // Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);
            let existing = await Setting.findOne({ key: "smtp_details" });
            if (!existing) {
                await Setting.create({
                    key: "smtp_details",
                    value: { smtp_host, encrtption, smtp_port, username, password, from_email, smtp_enabled, from_name },
                    created_by: req.user.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "settings-saved"), {});
            }
            let result: any = await Setting.findOneAndUpdate(
                { key: "smtp_details" },
                {
                    value: { smtp_host, encrtption, smtp_port, username, password, from_email, smtp_enabled, from_name },
                    created_by: req.user.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "settings-saved"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
