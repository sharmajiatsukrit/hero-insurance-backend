import expres, { Router } from "express";
import CustomerController from "../../../controllers/admin/customer";
import { authAdmin, authRequest, validateRequest } from "../../../utils/middleware";
import Fileupload from "../../../utils/middleware/multer";
import { upload } from "../../../utils/storage";
const routes: Router = expres.Router();
const customerController = new CustomerController();

routes.get("/list", validateRequest, authAdmin, customerController.getList.bind(customerController));
routes.post("/add", validateRequest, authAdmin, upload.single("company_logo"), customerController.add.bind(customerController));
routes.put("/update/:id", validateRequest, authAdmin,  customerController.update.bind(customerController));
routes.get("/by-id/:id", validateRequest, authAdmin, customerController.getById.bind(customerController));
routes.delete("/delete/:id", validateRequest, authAdmin, customerController.delete.bind(customerController));
routes.patch("/status/:id", validateRequest, authAdmin, customerController.status.bind(customerController));
routes.put("/update-companylogo/:id", upload.single("company_logo"), authAdmin, validateRequest, customerController.updateCompanyLogo.bind(customerController));

export default routes;