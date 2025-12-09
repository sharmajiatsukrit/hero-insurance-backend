import expres, { Router } from "express";
import { validateRequest } from "../../../utils/middleware";
import OfferController from "../../../controllers/user/offer";
const routes: Router= expres.Router();
const offrController = new OfferController();
routes.get("/list", validateRequest, offrController.getList.bind(offrController));
routes.get("/by-id/:id", validateRequest, offrController.getById.bind(offrController));


export default routes;