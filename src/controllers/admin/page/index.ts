import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";

import validate from "./validate";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import Page from "../../../models/page";
import PageImage from "../../../models/page-image";

const fileName = "[admin][page][index.ts]";
export default class PageController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    public async getPageSectionData(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[pagesection][get]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { key } = req.params;
            const filter: any = {};
            filter.key = key;
            filter.status = true;
            const result: any = await Page.findOne(filter).lean();

            let formattedResult: any = {};

            if (result) {
                formattedResult = {
                    ...result,
                    value: {
                        ...result.value,
                        ...(result.value?.image && {
                            image: `${process.env.RESOURCE_URL}${result.value.image}`,
                        }),
                        ...(result.value?.additional_image && {
                            additional_image: `${process.env.RESOURCE_URL}${result.value.additional_image}`,
                        }),
                    },
                };
            }
            if (result) {
                // result.offer_image = `${process.env.RESOURCE_URL}${result.offer_image}`;
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-fetched"]), formattedResult);
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
                    value: { title, sub_title, image },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "home_banner_section" },
                {
                    value: { title, sub_title, image },
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

            const { title, counter_data } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);
            const newdata: any = {};
            newdata.title = title;
            newdata.counter_data = counter_data;
            const hpcs = await Page.findOne({ key: "home_performance_counters_section" });
            if (!hpcs) {
                const result: any = await Page.create({
                    key: "home_performance_counters_section",
                    value: newdata,
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "home_performance_counters_section" },
                {
                    value: newdata,
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

            const { title, description, additional_title, additional_description } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);
            let image: string | undefined;
            let additional_image: string | undefined;

            if (req.files && !Array.isArray(req.files)) {
                const files = req.files as { [key: string]: Express.Multer.File[] };

                image = files.image?.[0]?.filename;
                additional_image = files.additional_image?.[0]?.filename;
            }
            const exixtingData = await Page.findOne({ key: "about_us_header_section" });
            if (!exixtingData) {
                await Page.create({
                    key: "about_us_header_section",
                    value: { title, description, additional_title, additional_description, image, additional_image },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "about_us_header_section" },
                {
                    value: { title, description, additional_title, additional_description, image, additional_image },
                    created_by: req.user?.object_id,
                }
            );
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
            const exixtingData = await Page.findOne({ key: "about_us_achievements_section" });
            if (!exixtingData) {
                const result: any = await Page.create({
                    key: "about_us_achievements_section",
                    value: { title, individual_achievements },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "about_us_achievements_section" },
                {
                    value: { title, individual_achievements },
                    created_by: req.user?.object_id,
                }
            );
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
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
            // const result: any = await Page.create({
            //     key: "about_us_essence_of_hero_section",
            //     value: { core_values },
            //     created_by: req.user?.object_id,
            // });
            // return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            const exist = await Page.findOne({ key: "about_us_essence_of_hero_section" });
            if (!exist) {
                const result: any = await Page.create({
                    key: "about_us_essence_of_hero_section",
                    value: { core_values },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "about_us_essence_of_hero_section" },
                {
                    value: { core_values },
                    created_by: req.user?.object_id,
                }
            );
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
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
                    value: { email, description, image, locations: JSON.parse(locations) },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "contact_us_section" },
                {
                    value: { email, description, image, locations: JSON.parse(locations) },
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
                    value: { title, image },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "claims_heading_section" },
                {
                    value: { title, image },
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

    //Seo Details
    public async addPageSeoDetails(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[addPageSeoDetail][add]";
            const { locale, key } = req.query;
            this.locale = (locale as string) || "en";
            const { meta_title, meta_description, key_words } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const seoDetail = await Page.findOne({ key: key });
            if (!seoDetail) {
                const result: any = await Page.create({
                    key: key,
                    value: { meta_title, meta_description, key_words },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: key },
                {
                    value: { meta_title, meta_description, key_words },
                    created_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getPageSeoDetails(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[addPageSeoDetail][add]";
            const { locale, key } = req.query;
            this.locale = (locale as string) || "en";

            const seoDetail = await Page.findOne({ key: key }).lean();
            if (seoDetail) {
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), seoDetail);
            }

            throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Car Insurance Page
    public async addCISS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[car_insurance_seo_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { meta_description } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const seoDetail = await Page.findOne({ key: "car_insurance_seo_section" });
            if (!seoDetail) {
                const result: any = await Page.create({
                    key: "car_insurance_seo_section",
                    value: { meta_description },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "car_insurance_seo_section" },
                {
                    value: { meta_description },
                    created_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Bike Insurance Page
    public async addBISS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[bike_insurance_seo_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { meta_description } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const seoDetail = await Page.findOne({ key: "bike_insurance_seo_section" });
            if (!seoDetail) {
                const result: any = await Page.create({
                    key: "bike_insurance_seo_section",
                    value: { meta_description },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "bike_insurance_seo_section" },
                {
                    value: { meta_description },
                    created_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Health Insurance Page
    public async addHISS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[health_insurance_seo_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { meta_description } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const seoDetail = await Page.findOne({ key: "health_insurance_seo_section" });
            if (!seoDetail) {
                const result: any = await Page.create({
                    key: "health_insurance_seo_section",
                    value: { meta_description },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "health_insurance_seo_section" },
                {
                    value: { meta_description },
                    created_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Corporate Insurance Page
    public async addCorpISS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[corporate_insurance_seo_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { meta_description } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const seoDetail = await Page.findOne({ key: "corporate_insurance_seo_section" });
            if (!seoDetail) {
                const result: any = await Page.create({
                    key: "corporate_insurance_seo_section",
                    value: { meta_description },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "corporate_insurance_seo_section" },
                {
                    value: { meta_description },
                    created_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Tailored Insurance Page
    public async addTIBSS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[tailored_insurance_seo_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { meta_description } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const seoDetail = await Page.findOne({ key: "tailored_insurance_seo_section" });
            if (!seoDetail) {
                const result: any = await Page.create({
                    key: "tailored_insurance_seo_section",
                    value: { meta_description },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "tailored_insurance_seo_section" },
                {
                    value: { meta_description },
                    created_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Term Insurance Page
    public async addTISS(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[term_insurance_seo_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { meta_description } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const seoDetail = await Page.findOne({ key: "term_insurance_seo_section" });
            if (!seoDetail) {
                const result: any = await Page.create({
                    key: "term_insurance_seo_section",
                    value: { meta_description },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            await Page.findOneAndUpdate(
                { key: "term_insurance_seo_section" },
                {
                    value: { meta_description },
                    created_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    //page content

    public async getPageContentImageList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[pagesection][get]";
            // Set locale
            const { locale, page, limit, search } = req.query;
            this.locale = (locale as string) || "en";
            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            this.locale = (locale as string) || "en";

            const filter: any = {};
            if (search) {
                filter.$or = [{ key: { $regex: search, $options: "i" } }];
            }
            filter.status = true;
            const result: any = await PageImage.find(filter).skip(skip).limit(limitNumber).lean();

            let formattedResult: any = [];

            if (result) {
                formattedResult = result.map((item: any) => ({
                    ...item,
                    image: `${process.env.RESOURCE_URL}${item.image}`,
                }));
            }
            const totalCount = await PageImage.countDocuments(filter);
            const totalPages = Math.ceil(totalCount / limitNumber);
            if (result) {
                // result.offer_image = `${process.env.RESOURCE_URL}${result.offer_image}`;
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["enquiry-fetched"]), {
                    data: formattedResult,
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

    public async addPageContentImage(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { key, image } = req.body;

            let img: any;
            if (req.file) {
                img = req?.file?.filename;
            }

            const result: any = await PageImage.create({
                key,
                image: img,
                created_by: req.user?.object_id,
            });
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            console.log(err);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async editPageContentImage(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            const { id } = req.params;

            this.locale = (locale as string) || "en";
            const { key, image } = req.body;
            let img: any;
            if (req.file) {
                img = req?.file?.filename;
            }
            const result: any = await PageImage.findOneAndUpdate(
                { id },
                {
                    key,
                    image: img,
                    created_by: req.user?.object_id,
                }
            );
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            console.log(err);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async deletePageContentImage(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            const { id } = req.params;

            this.locale = (locale as string) || "en";
            const result: any = await PageImage.findOneAndDelete({ id });
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            console.log(err);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async addPageContent(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[term_insurance_seo_section][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { key, content } = req.body;
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);

            const contentDetail = await Page.findOne({ key });
            if (!contentDetail) {
                const result: any = await Page.create({
                    key,
                    value: { content },
                    created_by: req.user?.object_id,
                });
                return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
            }
            const rollBackKey = `${key}_rollback`;

            const rollBackContentDetail = await Page.findOne({ key: rollBackKey });

            if (!rollBackContentDetail) {
                await Page.create({
                    key: rollBackKey,
                    value: contentDetail.value,
                    created_by: req.user?.object_id,
                });
            } else {
                await Page.findOneAndUpdate(
                    { key: rollBackKey },
                    {
                        value: contentDetail.value,
                        updated_by: req.user?.object_id,
                    }
                );
            }

            await Page.findOneAndUpdate(
                { key },
                {
                    value: { content },
                    created_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            console.log(err);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async pageContentRollback(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[term_insurance_seo_section][add]";
            const { locale } = req.query;
            const { key } = req.params;
            this.locale = (locale as string) || "en";
            Logger.info(`${fileName + fn} req.body: ${JSON.stringify(req.body)}`);
            const rollBackKey = `${key}_rollback`;

            const rollBackContentDetail = await Page.findOne({ key: rollBackKey });

            if (rollBackContentDetail) {
                await Page.findOneAndUpdate(
                    { key },
                    {
                        value: rollBackContentDetail.value,
                        updated_by: req.user?.object_id,
                    }
                );
            }

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            console.log(err);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }        
}
