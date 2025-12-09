import expres, { Router } from "express";
import { validateRequest } from "../../../utils/middleware";
import AdsController from "../../../controllers/user/ads";
const routes: Router= expres.Router();
const adsController = new AdsController();
routes.get("/list", validateRequest, adsController.getList.bind(adsController));
routes.get("/by-id/:id", validateRequest, adsController.getById.bind(adsController));


export default routes;