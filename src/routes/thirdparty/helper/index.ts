import expres, { Router } from "express";
import HelperController from "../../../controllers/user/helper";
import { authRequest, validateRequest } from "../../../utils/middleware";


const routes: Router = expres.Router();
const helperController = new HelperController();

routes.get("/get-my-profile", validateRequest, authRequest, helperController.getMyProfile.bind(helperController));

export default routes;