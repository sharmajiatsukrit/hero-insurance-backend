import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import InsuranceLeadController from "../../../controllers/admin/insurance-lead";


const routes: Router = expres.Router();
const insuranceLeadController = new InsuranceLeadController();

routes.get("/list", validateRequest, authAdmin, insuranceLeadController.getList.bind(insuranceLeadController));
routes.get("/by-id/:id", validateRequest, authAdmin, insuranceLeadController.getById.bind(insuranceLeadController));
export default routes;
