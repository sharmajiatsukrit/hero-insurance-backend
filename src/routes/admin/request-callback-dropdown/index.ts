import expres, { Router } from "express";

import { authAdmin, validateRequest } from "../../../utils/middleware";
import RequestCallbackDropdownController from "../../../controllers/admin/request-callback-dropdown";

const routes: Router = expres.Router();
const requestCallbackDropdownController = new RequestCallbackDropdownController();

routes.get("/list", validateRequest, authAdmin, requestCallbackDropdownController.getList.bind(requestCallbackDropdownController));
routes.post("/add", validateRequest, authAdmin, requestCallbackDropdownController.add.bind(requestCallbackDropdownController));
routes.put("/update/:id", validateRequest, authAdmin, requestCallbackDropdownController.update.bind(requestCallbackDropdownController));
routes.get("/by-id/:id", validateRequest, authAdmin, requestCallbackDropdownController.getById.bind(requestCallbackDropdownController));
routes.delete("/delete/:id", validateRequest, authAdmin, requestCallbackDropdownController.delete.bind(requestCallbackDropdownController));
routes.patch("/status/:id", validateRequest, authAdmin, requestCallbackDropdownController.status.bind(requestCallbackDropdownController));

export default routes;
