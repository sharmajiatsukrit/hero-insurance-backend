import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import CorporateInsuranceRequestController from "../../../controllers/admin/corporate-insurance";


const routes: Router = expres.Router();
const corporateInsuranceController = new CorporateInsuranceRequestController();

routes.get("/list", validateRequest, authAdmin, corporateInsuranceController.getList.bind(corporateInsuranceController));
routes.get("/by-id/:id", validateRequest, authAdmin, corporateInsuranceController.getById.bind(corporateInsuranceController));
export default routes;
