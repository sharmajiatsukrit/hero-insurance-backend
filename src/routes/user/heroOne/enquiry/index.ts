import expres, { Router } from "express";
import { validateRequest } from "../../../../utils/middleware";
import EnquiryController from "../../../../controllers/user/enquiry";
const routes: Router= expres.Router();
const enquiryController = new EnquiryController();
routes.get("/add", validateRequest, enquiryController.add.bind(enquiryController));


export default routes;