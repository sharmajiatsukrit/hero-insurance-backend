import expres, { Router } from "express";
import { validateRequest } from "../../../../utils/middleware";
import KeyOfficerController from "../../../../controllers/user/key-officer";
const routes: Router= expres.Router();
const keyOfficerController = new KeyOfficerController();
routes.get("/list", validateRequest, keyOfficerController.getList.bind(keyOfficerController));
routes.get("/by-id/:id", validateRequest, keyOfficerController.getById.bind(keyOfficerController));


export default routes;