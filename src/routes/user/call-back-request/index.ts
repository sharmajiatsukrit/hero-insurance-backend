import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import CallBackRequestController from "../../../controllers/user/call-back-request";

const routes: Router = expres.Router();
const callBackRequestController = new CallBackRequestController();

routes.post("/add", validateRequest, callBackRequestController.add.bind(callBackRequestController));
export default routes;
