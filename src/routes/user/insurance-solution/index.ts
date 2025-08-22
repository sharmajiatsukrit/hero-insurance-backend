import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";

import { upload } from "../../../utils/storage";
import InsuranceSolutionController from "../../../controllers/admin/insurance-solution";
const routes: Router = expres.Router();
const insuranceSolutionController = new InsuranceSolutionController();

routes.get("/list", validateRequest, insuranceSolutionController.getList.bind(insuranceSolutionController));
routes.get("/by-id/:id", validateRequest, insuranceSolutionController.getById.bind(insuranceSolutionController));

export default routes;
