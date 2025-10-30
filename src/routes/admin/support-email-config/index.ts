import expres, { Router } from "express";
import RoleController from "../../../controllers/admin/roles";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import SupportEmailConfigController from "../../../controllers/admin/support-email-config";


const routes: Router = expres.Router();
const supportEmailConfigController = new SupportEmailConfigController();


routes.post("/add", authAdmin, validateRequest, supportEmailConfigController.add.bind(supportEmailConfigController));
routes.get("/get/:type", authAdmin, validateRequest, supportEmailConfigController.getByType.bind(supportEmailConfigController));

export default routes;
