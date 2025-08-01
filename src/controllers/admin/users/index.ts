import { Request, Response } from "express";
import { ValidationChain } from "express-validator";
import validator from "validator";
import Bcrypt from "bcryptjs";
import { DateTime } from "luxon";
import moment from "moment";
import { Roles, Permissions, User, Country, State, City } from "../../../models";
import { removeObjectKeys, serverResponse, serverErrorHandler, removeSpace, constructResponseMsg, serverInvalidRequest, groupByDate } from "../../../utils";
import { HttpCodeEnum } from "../../../enums/server";
import validate from "./validate";
import EmailService from "../../../utils/email";
import { getPostsForAdmin, getPostsForAdminBySubscriberId, getChatCount, getPostCount, postDelete } from "../../../services/Chat";
import Logger from "../../../utils/logger";
import ServerMessages, { ServerMessagesEnum } from "../../../config/messages";

const fileName = "[admin][users][index.ts]";
export default class UserController {
    public locale: string = "en";
    public emailService;

    constructor() {
        this.emailService = new EmailService();
    }

    public validate(endPoint: string): ValidationChain[] {
        return validate(endPoint);
    }


    // Checked
    public async getList(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getList]";
            // Set locale
            const { locale, page, limit, search } = req.query;
            this.locale = (locale as string) || "en";

            // Parse page and limit from query params, set defaults if not provided
            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 5;

            // Calculate the number of documents to skip
            const skip = (pageNumber - 1) * limitNumber;
            let searchQuery = {};
            if (search) {
                searchQuery = {

                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { phone: { $regex: search, $options: 'i' } },
                        { date_of_birth: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } }, 
                    ]
                };
            } else {
                searchQuery = {};
            }
            const results = await User.find(searchQuery)
                .sort({ id: -1 })
                .skip(skip)
                .limit(limitNumber).lean().populate("country_id","id name")
                .populate("state_id","id name")
                .populate("city_id","id name")
                .populate("created_by","id name")
                .populate("updated_by","id name")
                .populate("role_id","id name");
            
            let formattedResults: any[] = [];

            if (results.length > 0) {
                formattedResults = results.map((item, index) => ({
                    ...item,
                    profile_img: item.profile_img ? `${process.env.RESOURCE_URL}${item.profile_img}` : null,
                }));
            }

            // Get the total number of documents in the User collection that match the filter
            const totalCount = await User.countDocuments();

            if (results.length > 0) {
                const totalPages = Math.ceil(totalCount / limitNumber);
                return serverResponse(
                    res,
                    HttpCodeEnum.OK,
                    ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["user-fetched"]),
                    { data: formattedResults, totalPages, totalCount, currentPage: pageNumber }
                );
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }


    // Checked
    public async getById(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[getDetailsById]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result: any = await User.findOne({ id: id })
                                        .lean()
                                        .populate("country_id","id name")
                                        .populate("state_id","id name")
                                        .populate("city_id","id name")
                                        .populate("created_by","id name")
                                        .populate("updated_by","id name")
                                        .populate("role_id","id name");

            if (result) {
                result.profile_img = result.profile_img ? `${process.env.RESOURCE_URL}${result.profile_img}` : null;
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["user-fetched"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async add(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[add]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { name, phone, email, date_of_birth, city_id, state_id, country_id, address, role_id, password } = req.body;

            // Validate password length
            if (password.length < 8) {
                return serverResponse(res, HttpCodeEnum.BADREQUEST, constructResponseMsg(this.locale, "password-length"), {});
            }

            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return serverResponse(res, HttpCodeEnum.BADREQUEST, constructResponseMsg(this.locale, "email-already-exists"), {});
            }

            const role: any = await Roles.findOne({ id: role_id }).lean();
            const country: any = await Country.findOne({ id: country_id }).lean();
            const state: any = await State.findOne({ id: state_id }).lean();
            const city: any = await City.findOne({ id: city_id }).lean();
            const hashedPassword = await Bcrypt.hash(password, 10);
            let profile_img: any;
            if (req.file) {
                profile_img = req?.file?.filename;
            }

            const userData = await User.create({
                name: name,
                phone: phone,
                email: email,
                password: hashedPassword,
                date_of_birth: date_of_birth,
                profile_img: profile_img,
                city_id: city?._id,
                state_id: state?._id,
                country_id: country?._id,
                address: address,
                role_id: role?._id,
                status: 1,
                created_by: req.user.object_id
            });

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "user-add"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[update]";

            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";
            const { name, phone, email, date_of_birth, city_id, state_id, country_id, address, role_id, password } = req.body;
            const id = parseInt(req.params.id);
            const role: any = await Roles.findOne({ id: role_id }).lean();
            const country: any = await Country.findOne({ id: country_id }).lean();
            const state: any = await State.findOne({ id: state_id }).lean();
            const city: any = await City.findOne({ id: city_id }).lean();
            let profile_img: any;
            if (req.file) {
                profile_img = req?.file?.filename;
            }
            // console.log(role,country,state,city);
            await User.findOneAndUpdate({ id: id }, {
                name: name,
                phone: phone,
                email: email,
                date_of_birth: date_of_birth,
                city_id: city?._id,
                state_id: state?._id,
                country_id: country?._id,
                address: address,
                role_id: role?._id,
                status: 1,
                profile_img,
                updated_by: req.user.object_id
            });

            if (password?.length >= 8) {
                const hashedPassword = await Bcrypt.hash(password, 10);
                await User.findOneAndUpdate({ id: id }, { password: hashedPassword });
            }
           

            return serverResponse(res, HttpCodeEnum.OK, constructResponseMsg(this.locale, "user-update"), {});
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }


    private async getExistingUser(email: string): Promise<any> {
        // Search on encrypted email field
        const messageToSearchWith: any = new User({ email });
        messageToSearchWith.encryptFieldsSync();

        const userData: any = await User.findOne({ "$or": [{ email: messageToSearchWith.email }, { communication_email: messageToSearchWith.email }] });

        if (userData) {
            return Promise.resolve(userData._doc);
        }

        return Promise.resolve({ is_email_verified: false });
    }


    // Checked
    public async delete(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[delete]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const result = await User.deleteOne({ id: id });

            if (result) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["user-delete"]), result);
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    // Checked
    public async status(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[status]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const id = parseInt(req.params.id);
            const { status } = req.body;
            const updationstatus = await User.findOneAndUpdate({ id: id }, { status: status }).lean();
            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["user-status"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async changePass(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[changepass]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { id } = req.params;
            const { currentpass, newpass, confirmpass } = req.body;

            // Fetch the user by id
            const user = await User.findOne({ id: id }).lean();

            if (!user) {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }

            // Check if the current password matches the user's password
            const isMatch = await Bcrypt.compare(currentpass, user.password);
            if (!isMatch) {
                return serverResponse(res, HttpCodeEnum.UNAUTHORIZED, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["incorrect-password"]), {});
            }

            // Check if new password and confirm password match
            if (newpass !== confirmpass) {
                return serverResponse(res, HttpCodeEnum.BADREQUEST, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["password-mismatch"]), {});
            }

            // Hash the new password
            const saltRounds = 10;
            const hashedPassword = await Bcrypt.hash(newpass, saltRounds);

            // Update the user's password
            const updationstatus = await User.findOneAndUpdate({ id: id }, { password: hashedPassword }).lean();

            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["password-updated"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["update-failed"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }

    public async updateProfileImg(req: Request, res: Response): Promise<any> {
        try {
            const fn = "[updateProfileImg]";
            // Set locale
            const { locale } = req.query;
            this.locale = (locale as string) || "en";

            const { id } = req.params;

            let product_image: string | undefined;
            if (req.files && typeof req.files === 'object') {

                if ('product_image' in req.files) {
                    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                    product_image = files['product_image'][0].path;
                }
            }

            // Fetch the user by id
            const user = await User.findOne({ id: id }).lean();

            if (!user) {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["not-found"]));
            }

            // Update the user's profile image
            const updationstatus = await User.findOneAndUpdate({ id: id }, { profile_img_url: product_image }).lean();

            if (updationstatus) {
                return serverResponse(res, HttpCodeEnum.OK, ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["profile-img-updated"]), {});
            } else {
                throw new Error(ServerMessages.errorMsgLocale(this.locale, ServerMessagesEnum["update-failed"]));
            }
        } catch (err: any) {
            return serverErrorHandler(err, res, err.message, HttpCodeEnum.SERVERERROR, {});
        }
    }


}