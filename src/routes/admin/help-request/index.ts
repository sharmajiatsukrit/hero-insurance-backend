import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import EnquiryController from "../../../controllers/admin/enquiry";
import HelpRequestController from "../../../controllers/admin/help-request";

const routes: Router = expres.Router();
const helpRequestController = new HelpRequestController();


routes.get("/list", validateRequest, authAdmin, helpRequestController.getList.bind(helpRequestController));
routes.get("/by-id/:id", validateRequest, authAdmin, helpRequestController.getById.bind(helpRequestController));
export default routes;
