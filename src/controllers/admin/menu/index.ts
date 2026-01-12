import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";

import validate from "./validate";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";
import MenuItem from "../../../models/menu";

const fileName = "[admin][menu][index.ts]";
export default class MenuItemController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }

    // public async getList(req: Request, res: Response): Promise<any> {
    //     try {
    //         const { locale, search } = req.query;
    //         this.locale = (locale as string) || "en";

    //         const filter: any = {menu_type:0};
    //         filter.status = true; // Usually, 'true' means active; change if needed
    //         if (search) {
    //             filter.$or = [{ name: { $regex: search, $options: "i" } }];
    //         }
    //         const results: any = await MenuItem.find(filter).lean().populate("created_by", "id name");

    //         if (results.length > 0) {
    //             return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["faq-fetched"]), { data: results });
    //         } else {
    //             throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
    //         }
    //     } catch (err: any) {
    //         return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
    //     }
    // }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const { locale, search } = req.query;
            this.locale = (locale as string) || "en";

            const baseFilter: any = {};

            if (search) {
                baseFilter.$or = [{ name: { $regex: search, $options: "i" } }];
            }

            const [menu, dropDownMenu, extraMenu] = await Promise.all([
                MenuItem.find({ ...baseFilter, menu_type: 0 })
                    .lean()
                    .populate("created_by", "id name"),

                MenuItem.find({ ...baseFilter, menu_type: 1 })
                    .lean()
                    .populate("created_by", "id name"),

                MenuItem.find({ ...baseFilter, menu_type: 2 })
                    .lean()
                    .populate("created_by", "id name"),
            ]);

            return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["faq-fetched"]), {
                menu,
                dropDownMenu,
                extraMenu
            });
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async getById(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[menu][getById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result: any = await MenuItem.findOne({ id: id }).lean().populate("created_by", "id name");

            if (result) {
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
            const fn = "[menu][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, url, parent_id, menu_order, is_main_menu_item, status } = req.body;
            let existingParent_Id: any;
            if (parent_id) {
                existingParent_Id = await MenuItem.findOne({ id: +parent_id });
                if (!existingParent_Id) {
                    throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
                }
            }
            const result: any = await MenuItem.create({
                title,
                url,
                menu_order,
                parent_id: parent_id || null,
                is_main_menu_item,
                status: status,
                created_by: req.user?.object_id,
            });
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "menu-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async addDropDownMenu(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[menu][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, url, menu_order, status } = req.body;
            const result: any = await MenuItem.create({
                title,
                url,
                menu_order,
                status: status,
                menu_type: 1,
                created_by: req.user?.object_id,
            });
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "menu-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async updateDropDownMenu(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[menu][add]";
            const id = parseInt(req.params.id);
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, url, menu_order, status } = req.body;
            const menu = await MenuItem.findOne({ id: id });
            if (!menu) {
                return serverResponse(res, HttpCodeEnum.NOTFOUND, constructResponseMsg(this.locale, "not-found"), {});
            }
            const result: any = await MenuItem.findOneAndUpdate(
                { id },
                {
                    title,
                    url,
                    menu_order,
                    status: status,
                    menu_type: 1,
                    updated_by: req.user?.object_id,
                }
            );
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "menu-update"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[menu][update]";
            const id = parseInt(req.params.id);
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, url, parent_id, menu_order, is_main_menu_item, status } = req.body;

            const menu = await MenuItem.findOne({ id: id });
            if (!menu) {
                return serverResponse(res, HttpCodeEnum.NOTFOUND, constructResponseMsg(this.locale, "award-not-found"), {});
            }
            let existingParent_Id: any;
            if (parent_id) {
                existingParent_Id = await MenuItem.findOne({ id: +parent_id });
                if (!existingParent_Id) {
                    throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
                }
            }

            await MenuItem.findOneAndUpdate(
                { id: id },
                {
                    title,
                    url,
                    menu_order,
                    parent_id: parent_id || null,
                    is_main_menu_item,
                    status: status,
                    updated_by: req.user?.object_id,
                }
            );

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "award-update"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async addExtraMenu(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[menu][add]";
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, url, menu_order, status } = req.body;
            const result: any = await MenuItem.create({
                title,
                url,
                menu_order,
                status: status,
                menu_type: 2,
                created_by: req.user?.object_id,
            });
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "menu-add"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async updateExtraMenu(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[menu][add]";
            const id = parseInt(req.params.id);
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { title, url, menu_order, status } = req.body;
            const menu = await MenuItem.findOne({ id: id });
            if (!menu) {
                return serverResponse(res, HttpCodeEnum.NOTFOUND, constructResponseMsg(this.locale, "not-found"), {});
            }
            const result: any = await MenuItem.findOneAndUpdate(
                { id },
                {
                    title,
                    url,
                    menu_order,
                    status: status,
                    menu_type: 2,
                    updated_by: req.user?.object_id,
                }
            );
            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "menu-update"), {});
        } catch (err: any) {
            // Logger.error(`${fileName + fn} Error: ${err.message}`);
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Delete
    public async delete(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[menu][delete]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result = await MenuItem.deleteOne({ id: id });

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["menu-delete"]), {});
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
            const fn = "[menu][status]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const { status } = req.body;
            const updationstatus = await MenuItem.findOneAndUpdate({ id: id }, { status: status }).lean();
            const updatedData: any = await MenuItem.find({ id: id }).lean();
            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["menu-status"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
