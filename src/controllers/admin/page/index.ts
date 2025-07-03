import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";

import validate from "./validate";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import Page from "../../../models/page";

const fileName = "[admin][page][index.ts]";
export default class PageController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }
    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[offer][getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { key } = req.params;
            const result: any = await Page.find({ key: key }).lean();
            // console.log(result);

            if (result) {
                // result.offer_image = `${process.env.RESOURCE_URL}${result.offer_image}`;
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //page_Home Banner Section
    public async addHBS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[home_banner_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, sub_title } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            let image: any;
            if (req.file) {
                image = req?.file?.filename;
            }
            const hbs = await Page.findOne({ key: "home_banner_section" });
            if (!hbs) {
                const result: any = await Page.create({
                    key: "home_banner_section",
                    value: { title, sub_title },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "home_banner_section" },
                {
                    value: { title, sub_title },
                    created_by: req.user?.object_id,
                }
            );
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //page_Home Performance Counters Section
    public async addHPCS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[home_performance_counters_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const hpcs = await Page.findOne({ key: "home_performance_counters_section" });
            if (!hpcs) {
                const result: any = await Page.create({
                    key: "home_performance_counters_section",
                    value: { title },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "home_performance_counters_section" },
                {
                    value: { title },
                    created_by: req.user?.object_id,
                }
            );
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //page_Home Hero Insurance Broking Details Section
    public async addHHIBDS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[home_hero_insurance_broking_details_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { main_title, section_description, fid_data } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const hibds = await Page.findOne({ key: "home_hero_insurance_broking_details_section" });
            if (!hibds) {
                const result: any = await Page.create({
                    key: "home_hero_insurance_broking_details_section",
                    value: { main_title, section_description, fid_data },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "home_hero_insurance_broking_details_section" },
                {
                    value: { main_title, section_description, fid_data },
                    created_by: req.user?.object_id,
                }
            );
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //page_Home Tailored Business Solutions Section
    public async addHTBSS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[home_tailored_business_solutions_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { solutions_data } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const hibds = await Page.findOne({ key: "home_tailored_business_solutions_section" });
            if (!hibds) {
                const result: any = await Page.create({
                    key: "home_tailored_business_solutions_section",
                    value: { solutions_data },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "home_tailored_business_solutions_section" },
                {
                    value: { solutions_data },
                    created_by: req.user?.object_id,
                }
            );
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //
    //page_Home Awards & Recognitions Section
    public async addHAARS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[home_awards_and_recognitions_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { promotional_video_link } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const hibds = await Page.findOne({ key: "home_awards_and_recognitions_section" });
            if (!hibds) {
                const result: any = await Page.create({
                    key: "home_awards_and_recognitions_section",
                    value: { promotional_video_link },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "home_awards_and_recognitions_section" },
                {
                    value: { promotional_video_link },
                    created_by: req.user?.object_id,
                }
            );
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //page_Home Customer Testimonials Section
    public async addHCTS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[home_customer_testimonials_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, rating } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const hibds = await Page.findOne({ key: "home_customer_testimonials_section" });
            if (!hibds) {
                const result: any = await Page.create({
                    key: "home_customer_testimonials_section",
                    value: { title, rating },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "home_customer_testimonials_section" },
                {
                    value: { title, rating },
                    created_by: req.user?.object_id,
                }
            );
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // About Us Page
    //page_About us Header Section
    public async addAUHS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[about_us_header_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, description } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            let image: any;
            if (req.file) {
                image = req?.file?.filename;
            }
            // const hbs = await Page.findOne({ key: "about_us_header_section" });
            // if (!hbs) {
            //     const result: any = await Page.create({
            //         key: "about_us_header_section",
            //         value: { title, description },
            //         created_by: req.user?.object_id,
            //     });
            //     return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            // }
            // await Page.findOneAndUpdate(
            //     { key: "about_us_header_section" },
            //     {
            //         value: { title, description },
            //         created_by: req.user?.object_id,
            //     }
            // );
            const result: any = await Page.create({
                key: "about_us_header_section",
                value: { title, description },
                created_by: req.user?.object_id,
            });

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //page_About us Achievements  Section
    public async addAUAS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[about_us_achievements_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, individual_achievements } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);
            const result: any = await Page.create({
                key: "about_us_achievements_section",
                value: { title, individual_achievements },
                created_by: req.user?.object_id,
            });
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            //const hibds = await Page.findOne({ key: "about_us_achievements_section" });
            // if (!hibds) {
            //     const result: any = await Page.create({
            //         key: "about_us_achievements_section",
            //         value: { title, individual_achievements },
            //         created_by: req.user?.object_id,
            //     });
            //     return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            // }
            // await Page.findOneAndUpdate(
            //     { key: "about_us_achievements_section" },
            //     {
            //         value: { title, individual_achievements },
            //         created_by: req.user?.object_id,
            //     }
            // );
            // return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //page_About us Essence of Hero
    public async addAUEOHS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[about_us_essence_of_hero_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { core_values } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);
            const result: any = await Page.create({
                key: "about_us_essence_of_hero_section",
                value: { core_values },
                created_by: req.user?.object_id,
            });
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            //const hibds = await Page.findOne({ key: "about_us_essence_of_hero_section" });
            // if (!hibds) {
            //     const result: any = await Page.create({
            //         key: "about_us_essence_of_hero_section",
            //         value: { core_values },
            //         created_by: req.user?.object_id,
            //     });
            //     return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            // }
            // await Page.findOneAndUpdate(
            //     { key: "about_us_essence_of_hero_section" },
            //     {
            //         value: { core_values },
            //         created_by: req.user?.object_id,
            //     }
            // );
            // return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Contact Us Page
    //page_ontact us Contact Us Section
    public async addCUHS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[contact_us_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { email, description, locations } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            let image: any;
            if (req.file) {
                image = req?.file?.filename;
            }
            const hbs = await Page.findOne({ key: "contact_us_section" });
            if (!hbs) {
                const result: any = await Page.create({
                    key: "contact_us_section",
                    value: { email, description, locations: JSON.parse(locations) },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "contact_us_section" },
                {
                    value: { email, description, locations: JSON.parse(locations) },
                    created_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Claims Page
    //page_Claims us Claims Section
    public async addCHS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[claims_heading_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            let image: any;
            if (req.file) {
                image = req?.file?.filename;
            }
            const hbs = await Page.findOne({ key: "claims_heading_section" });
            if (!hbs) {
                const result: any = await Page.create({
                    key: "claims_heading_section",
                    value: { title },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "claims_heading_section" },
                {
                    value: { title },
                    created_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Awards Page
    //page_About us Awards Section
    public async addAS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[awards_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, description, listed_points } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const hbs = await Page.findOne({ key: "awards_section" });
            if (!hbs) {
                const result: any = await Page.create({
                    key: "awards_section",
                    value: { title, description, listed_points },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "awards_section" },
                {
                    value: { title, description, listed_points },
                    created_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
