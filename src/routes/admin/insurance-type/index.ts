import expres, { Router } from "express";

import { authAdmin, validateRequest } from "../../../utils/middleware";
import InsuranceTypeController from "../../../controllers/admin/insurance-type";

const routes: Router = expres.Router();
const insuranceTypeController = new InsuranceTypeController();

routes.get("/list", validateRequest, authAdmin, insuranceTypeController.getList.bind(insuranceTypeController));
routes.post("/add", validateRequest, authAdmin, insuranceTypeController.add.bind(insuranceTypeController));
routes.put("/update/:id", validateRequest, authAdmin, insuranceTypeController.update.bind(insuranceTypeController));
routes.get("/by-id/:id", validateRequest, authAdmin, insuranceTypeController.getById.bind(insuranceTypeController));
routes.delete("/delete/:id", validateRequest, authAdmin, insuranceTypeController.delete.bind(insuranceTypeController));
routes.patch("/status/:id", validateRequest, authAdmin, insuranceTypeController.status.bind(insuranceTypeController));

export default routes;
