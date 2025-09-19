import expres, { Router } from "express";
import UserDetailController from "../../../controllers/admin/user-detail";
import { authAdmin, validateRequest } from "../../../utils/middleware";

const routes: Router = expres.Router();
const userDetailController = new UserDetailController();

routes.get("/list", validateRequest, authAdmin, userDetailController.getList.bind(userDetailController));
routes.get("/by-id/:id", validateRequest, authAdmin, userDetailController.getById.bind(userDetailController));

export default routes;
