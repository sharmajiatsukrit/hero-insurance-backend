import expres, { Router } from "express";
import { authRequest, validateRequest } from "../../../utils/middleware";
import HelpRequestController from "../../../controllers/user/help-request";
const routes: Router= expres.Router();
const helpRequestController = new HelpRequestController();
routes.post("/add", validateRequest, authRequest, helpRequestController.add.bind(helpRequestController));
routes.get("/list", validateRequest, authRequest, helpRequestController.list.bind(helpRequestController));


export default routes;