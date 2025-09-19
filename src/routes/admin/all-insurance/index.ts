import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import AllInsuranceRequestController from "../../../controllers/admin/all-insurance";

const routes: Router = expres.Router();
const allInsuranceRequestController = new AllInsuranceRequestController();

routes.get("/list", validateRequest, authAdmin, allInsuranceRequestController.getList.bind(allInsuranceRequestController));
routes.get("/by-id/:id", validateRequest, authAdmin, allInsuranceRequestController.getById.bind(allInsuranceRequestController));
export default routes;
