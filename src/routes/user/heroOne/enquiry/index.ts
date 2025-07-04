import expres, { Router } from "express";
import { validateRequest } from "../../../../utils/middleware";
import EnquiryController from "../../../../controllers/user/enquiry";
const routes: Router= expres.Router();
const enquiryController = new EnquiryController();
routes.get("/list", validateRequest, enquiryController.getList.bind(enquiryController));
routes.get("/by-id/:id", validateRequest, enquiryController.getById.bind(enquiryController));


export default routes;