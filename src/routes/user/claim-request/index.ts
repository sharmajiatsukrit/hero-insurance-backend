import expres, { Router } from "express";
import { authRequest, validateRequest } from "../../../utils/middleware";
import ClaimRequestController from "../../../controllers/user/claim-request";
const routes: Router= expres.Router();
const claimRequestController = new ClaimRequestController();
routes.post("/add", validateRequest, claimRequestController.add.bind(claimRequestController));
routes.post("/user/add", validateRequest, authRequest, claimRequestController.add.bind(claimRequestController));
routes.get("/user/list", validateRequest, authRequest, claimRequestController.list.bind(claimRequestController));


export default routes;