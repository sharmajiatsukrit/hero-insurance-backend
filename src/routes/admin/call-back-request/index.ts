import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import CallBackRequestController from "../../../controllers/admin/call-back-request";

const routes: Router = expres.Router();
const callBackRequestController = new CallBackRequestController();

routes.get("/list", validateRequest, authAdmin, callBackRequestController.getList.bind(callBackRequestController));
routes.get("/by-id/:id", validateRequest, authAdmin, callBackRequestController.getById.bind(callBackRequestController));
export default routes;
