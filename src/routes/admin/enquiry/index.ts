import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import EnquiryController from "../../../controllers/admin/enquiry";

const routes: Router = expres.Router();
const enquiryController = new EnquiryController();

routes.get("/list", validateRequest, authAdmin, enquiryController.getList.bind(enquiryController));
routes.get("/by-id/:id", validateRequest, authAdmin, enquiryController.getById.bind(enquiryController));
export default routes;
