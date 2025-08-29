import expres, { Router } from "express";
import { validateRequest } from "../../../utils/middleware";
import MenuController from "../../../controllers/user/menu";


const routes: Router= expres.Router();
const menuController =new MenuController();
routes.get("/list", validateRequest, menuController.getList.bind(menuController));

export default routes;