import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import EnquiryController from "../../../controllers/admin/enquiry";

const routes: Router = expres.Router();
const enquiryController = new EnquiryController();

routes.get("/list", validateRequest, authAdmin, enquiryController.getList.bind(enquiryController));
routes.post("/add", validateRequest, authAdmin, enquiryController.add.bind(enquiryController));
routes.put("/update/:id", validateRequest, authAdmin, enquiryController.update.bind(enquiryController));
routes.get("/by-id/:id", validateRequest, authAdmin, enquiryController.getById.bind(enquiryController));
routes.delete("/delete/:id", validateRequest, authAdmin, enquiryController.delete.bind(enquiryController));
routes.patch("/status/:id", validateRequest, authAdmin, enquiryController.status.bind(enquiryController));

export default routes;
