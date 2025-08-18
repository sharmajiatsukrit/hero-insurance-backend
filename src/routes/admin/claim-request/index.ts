import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import ClaimRequestController from "../../../controllers/admin/claim-request";



const routes: Router = expres.Router();
const claimRequestController = new ClaimRequestController();

routes.get("/list", validateRequest, authAdmin, claimRequestController.getList.bind(claimRequestController));
routes.get("/by-id/:id", validateRequest, authAdmin, claimRequestController.getById.bind(claimRequestController));
export default routes;
