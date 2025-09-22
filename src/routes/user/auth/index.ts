import expres, { Router } from "express";
import AuthController from "../../../controllers/user/auth";
import { UserRouteEndPoints, AdminRouteEndPoints } from "../../../enums/user";
import { authRequest, validateRequest } from "../../../utils/middleware";
import { upload } from "../../../utils/storage";

const routes: Router = expres.Router();
const authController = new AuthController();

// Applied authRequest to protect from misuse
routes.post("/signin", authController.validate(UserRouteEndPoints.SignIn), validateRequest, authController.signIn.bind(authController));
routes.post("/verify-otp", authController.validate(UserRouteEndPoints.Verifyotplogin), validateRequest, authController.verifyLoginOTP.bind(authController));
//user profile
routes.post("/update-profile", validateRequest, authRequest, authController.updateProfileDetail.bind(authController));
routes.get("/get-profile", validateRequest, authRequest, authController.getProfileDetail.bind(authController));

export default routes;
