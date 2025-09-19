import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import { serverResponse, serverErrorHandler, constructResponseMsg } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import MenuItem from "../../../models/menu";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";

const fileName = "[admin][menu_item][index.ts]";
export default class MenuController {
    public locale: string = "en";

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }
    public buildTree(items: any, parent: number | null = null) {
        return items
            .filter((item:any) => item.parent_id === parent)
            .sort((a: any, b: any) => a.menu_order - b.menu_order)
            .map((item:any) => ({
                title: item.title,
                url: item.url,
                is_main_menu_item: item.is_main_menu_item,
                submenu: this.buildTree(items, item.id),
            }));
    }

    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const filter: any = {};
            filter.status = true;

            const results: any = await MenuItem.find(filter).lean();
            console.log(results)
            const formatedResult = this.buildTree(results, null);

            if (results.length > 0) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["faq-fetched"]), { data: formatedResult });
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }
}
