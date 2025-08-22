import expres, { Router } from "express";
import { validateRequest } from "../../../utils/middleware";
import BODController from "../../../controllers/user/board-of-director";
const routes: Router= expres.Router();
const bodController = new BODController();
routes.get("/list", validateRequest, bodController.getList.bind(bodController));
routes.get("/by-id/:id", validateRequest, bodController.getById.bind(bodController));


export default routes;