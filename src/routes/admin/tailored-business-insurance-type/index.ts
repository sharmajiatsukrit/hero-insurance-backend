import expres, { Router } from "express";

import { authAdmin, validateRequest } from "../../../utils/middleware";
import TailoredBusinessInsuranceTypeController from "../../../controllers/admin/tailored-business-insurance-type";


const routes: Router = expres.Router();
const tailoredBusinessInsuranceTypeController = new TailoredBusinessInsuranceTypeController();

routes.get("/list", validateRequest, authAdmin, tailoredBusinessInsuranceTypeController.getList.bind(tailoredBusinessInsuranceTypeController));
routes.post("/add", validateRequest, authAdmin, tailoredBusinessInsuranceTypeController.add.bind(tailoredBusinessInsuranceTypeController));
routes.put("/update/:id", validateRequest, authAdmin, tailoredBusinessInsuranceTypeController.update.bind(tailoredBusinessInsuranceTypeController));
routes.get("/by-id/:id", validateRequest, authAdmin, tailoredBusinessInsuranceTypeController.getById.bind(tailoredBusinessInsuranceTypeController));
routes.delete("/delete/:id", validateRequest, authAdmin, tailoredBusinessInsuranceTypeController.delete.bind(tailoredBusinessInsuranceTypeController));
routes.patch("/status/:id", validateRequest, authAdmin, tailoredBusinessInsuranceTypeController.status.bind(tailoredBusinessInsuranceTypeController));

export default routes;
