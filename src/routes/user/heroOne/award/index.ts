import expres, { Router } from "express";
import { validateRequest } from "../../../../utils/middleware";
import AwardController from "../../../../controllers/user/award";
const routes: Router= expres.Router();
const awardController = new AwardController();
routes.get("/list", validateRequest, awardController.getList.bind(awardController));
routes.get("/by-id/:id", validateRequest, awardController.getById.bind(awardController));


export default routes;