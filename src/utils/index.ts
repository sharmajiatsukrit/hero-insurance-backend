import { Response, Request } from "express";
import { networkRequest } from "./request";
import UAparser from "ua-parser-js";
import { UserAgentType } from "../enums";
import { DeviceDetails, IpInfoData } from "../interfaces";
import { HttpCodeEnum } from "../enums/server";
import camelcase from "camelcase-keys";
import crypto from "crypto";
import ServerMessages from "../config/messages";
import { MessageKey } from "../config/messages/msgkey";
import Logger from '../utils/logger';

function serverResponse(response: Response, code: number, message: string, result: Array<Object> | Object): Response<any> {
    const formattedData = camelcase(result, { deep: true });
    return response.status(code).json({
        status: true,
        code: code,
        message: message,
        data: formattedData,
    });
}

function serverResponse2(response: Response, code: number, message: string, result: Array<Object> | Object): Response<any> {
    const formattedData = camelcase(result, { deep: false });
    return response.status(code).json({
        status: true,
        code: code,
        message: message,
        data: formattedData,
    });
}

function serverErrorHandler(err: any, response: Response, message: string = "", code: number = HttpCodeEnum.SERVERERROR, data: any = []): Response<any> {
    Logger.error(err);
    if (err.name === "Error") {
        return response.status(HttpCodeEnum.OK).json({
            status: false,
            code: HttpCodeEnum.OK,
            message: message || "An error occured",
            data,
            error: err,
        });
    }

    return response.status(code).json({
        status: false,
        code: code,
        message: "Internal server error",
        data: [],
        error: err,
    });
}

function serverThirdPartyErrorHandler(err: any, response: Response, message: string = "", code: number = HttpCodeEnum.SERVERERROR, data: any = []): Response<any> {
    Logger.error(err);
    if (err.name === "Error") {
        return response.status(HttpCodeEnum.OK).json({
            status: false,
            code: HttpCodeEnum.OK,
            message: message || "An error occured",
            data,
            error: err,
        });
    }

    return response.status(code).json({
        status: false,
        code: code,
        message: "Internal server error",
        data: [],
        error: err,
    });
}

function serverInvalidRequest(req: Request, res: Response, message: string = "") {
    return res.status(HttpCodeEnum.BADREQUEST).json({
        status: false,
        code: HttpCodeEnum.BADREQUEST,
        message: message || "Required fields are missing or invalid",
        data: [],
    });
}

function removeObjectKeys(data: any, deleteKeys: Array<string> = []) {
    const newObject = Object.keys(data).reduce<any>((object, key) => {
        if (!deleteKeys.includes(key)) {
            object[key] = data[key];
        }
        return object;
    }, {});

    return newObject;
}

function getDeviceDetails(req: Request): DeviceDetails {
    const userAgent: string = req.headers["user-agent"] || "";

    const customRegex = [[/(\w+)\/([0-9.]+)/i], [UAparser.BROWSER.NAME, UAparser.BROWSER.VERSION]];
    const customParser = new UAparser({ browser: customRegex });
    const userAgentType = customParser.setUA(userAgent).getBrowser();

    const deviceData = {
        device_type: "",
        device_os: "",
        device_os_version: "",
        device_vendor: "",
        device_engine: "",
        device_version: "",
        device_browser: "",
        device_browser_version: "",
        device_app_version: "",
    };

    if (userAgentType.name === UserAgentType.ArchChatIos) {
        deviceData.device_type = "ios_app";
        deviceData.device_os = "iOS";
        deviceData.device_os_version = (req.body && req.body.device_version) || "";
        deviceData.device_app_version = (req.body && req.body.app_version) || "";
    } else {
        const uaParsedResult = new UAparser(userAgent).getResult();
        deviceData.device_type = uaParsedResult.device.type || "desktop";
        deviceData.device_os = uaParsedResult.os.name || "";
        deviceData.device_os_version = uaParsedResult.os.name || "";
        deviceData.device_vendor = uaParsedResult.device.vendor || "";
        deviceData.device_engine = uaParsedResult.engine.name || "";
        deviceData.device_version = uaParsedResult.os.version || "";
        deviceData.device_browser = uaParsedResult.browser.name || "";
        deviceData.device_browser_version = uaParsedResult.browser.version || "";
    }

    return deviceData;
}

function getDetailsFromIp(ip: string): Promise<IpInfoData> {
    const url: string = `http://ip-api.com/json/${ip}`;
    return networkRequest("GET", url)
        .then((result) => {
            if (result.status === 200) {
                return Promise.resolve(result.data);
            }

            throw new Error("Error in fetching ip details");
        })
        .catch((err) => Promise.reject(err));
}

function encryptText(text: string): string | undefined {
    if (!process.env.ENC_KEY || !process.env.ENC_IV) return undefined;
    let cipher = crypto.createCipheriv("aes-256-cbc", process.env.ENC_KEY, process.env.ENC_IV);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

function decryptText(text: string): string | undefined {
    if (!process.env.ENC_KEY || !process.env.ENC_IV) return undefined;
    let decipher = crypto.createDecipheriv("aes-256-cbc", process.env.ENC_KEY, process.env.ENC_IV);
    decipher.setAutoPadding(false);
    let decrypted = decipher.update(text, "base64", "utf8");
    return decrypted + decipher.final("utf8");
}

function encryptTextInternal(text: string): string | undefined {
    if (!process.env.ENC_KEY_INTERNAL || !process.env.ENC_IV_INTERNAL) return undefined;
    let cipher = crypto.createCipheriv("aes-256-cbc", process.env.ENC_KEY_INTERNAL, process.env.ENC_IV_INTERNAL);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

function decryptTextInternal(text: string): string | undefined {
    if (!process.env.ENC_KEY_INTERNAL || !process.env.ENC_IV_INTERNAL) return undefined;
    let decipher = crypto.createDecipheriv("aes-256-cbc", process.env.ENC_KEY_INTERNAL, process.env.ENC_IV_INTERNAL);
    let decrypted = decipher.update(text, "hex", "utf8");
    return decrypted + decipher.final("utf8");
}

function constructResponseMsg(locale: string, msg: string): string {
    return ServerMessages.errorMsgLocale(locale, MessageKey[msg]);
}

function removeSpace(txt: string): string {
    return txt.replace(/\s/g, "");
}

function groupByDate(input: any) {
    const output: any = Object.keys(input).map((date) => ({
        date,
        data: input[date],
    }));
    return output;
};

async function firebaseUrlShortner(url: string) {
    try {
        const firebaseRequestUrl = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_API_KEY}`;

        const data = {
            dynamicLinkInfo: {
                domainUriPrefix: "https://arkchat.page.link",
                link: url,
                androidInfo: {
                    androidPackageName: "com.arkchat",
                },
                iosInfo: {
                    iosBundleId: "com.arkchat",
                    iosAppStoreId: "1618932796",
                },
                navigationInfo: {
                    enableForcedRedirect: true,
                },
            },
            suffix: {
                option: "SHORT",
            },
        };

        const requestData = await networkRequest("POST", firebaseRequestUrl, data);

        if (requestData.status === 200) {
            const responseData = requestData.data;

            const shortLink: string = responseData.shortLink;
            return Promise.resolve(shortLink);
        }

        throw new Error("Error in generating firbase short link");
    } catch (err: any) {
        return Promise.reject(err);
    }
}

async function verificationCheck(email: string, website: string): Promise<boolean> {
    try {
        const domain = email.split('@');
        return Promise.resolve(website.includes(domain[1]));
    } catch (err) {
        return Promise.reject(err);
    }
}

export {
    serverResponse,
    serverResponse2,
    removeObjectKeys,
    getDeviceDetails,
    getDetailsFromIp,
    serverErrorHandler,
    encryptText,
    decryptText,
    removeSpace,
    groupByDate,
    constructResponseMsg,
    serverInvalidRequest,
    serverThirdPartyErrorHandler,
    encryptTextInternal,
    decryptTextInternal,
    firebaseUrlShortner,
    verificationCheck
};
