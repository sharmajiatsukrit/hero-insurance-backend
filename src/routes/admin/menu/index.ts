import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import MenuController from "../../../controllers/admin/menu";


const routes: Router= expres.Router();
const menuController =new MenuController();
routes.get("/list", validateRequest, authAdmin, menuController.getList.bind(menuController));
routes.post("/add", validateRequest, authAdmin, menuController.add.bind(menuController));
routes.post("/drop-down-menu/add", validateRequest, authAdmin, menuController.addDropDownMenu.bind(menuController));
routes.get("/by-id/:id", validateRequest, authAdmin, menuController.getById.bind(menuController));
routes.put("/update/:id", validateRequest, authAdmin, menuController.update.bind(menuController));
routes.delete("/delete/:id", validateRequest, authAdmin, menuController.delete.bind(menuController));
routes.patch("/status/:id", validateRequest, authAdmin, menuController.status.bind(menuController));


export default routes;