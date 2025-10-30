import expres, { Router } from "express";

import { authAdmin, validateRequest } from "../../../utils/middleware";
import CorporateInsuranceTypeController from "../../../controllers/admin/corporate-insurance-type";

const routes: Router = expres.Router();
const corporateInsuranceTypeController = new CorporateInsuranceTypeController();

routes.get("/list", validateRequest, authAdmin, corporateInsuranceTypeController.getList.bind(corporateInsuranceTypeController));
routes.post("/add", validateRequest, authAdmin, corporateInsuranceTypeController.add.bind(corporateInsuranceTypeController));
routes.put("/update/:id", validateRequest, authAdmin, corporateInsuranceTypeController.update.bind(corporateInsuranceTypeController));
routes.get("/by-id/:id", validateRequest, authAdmin, corporateInsuranceTypeController.getById.bind(corporateInsuranceTypeController));
routes.delete("/delete/:id", validateRequest, authAdmin, corporateInsuranceTypeController.delete.bind(corporateInsuranceTypeController));
routes.patch("/status/:id", validateRequest, authAdmin, corporateInsuranceTypeController.status.bind(corporateInsuranceTypeController));

export default routes;
