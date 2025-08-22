import expres, { Router } from "express";
import { validateRequest } from "../../../utils/middleware";
import ClaimRequestController from "../../../controllers/user/claim-request";
const routes: Router= expres.Router();
const claimRequestController = new ClaimRequestController();
routes.post("/add", validateRequest, claimRequestController.add.bind(claimRequestController));


export default routes;