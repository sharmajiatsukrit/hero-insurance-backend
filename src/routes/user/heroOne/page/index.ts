import expres, { Router } from "express";
import { validateRequest } from "../../../../utils/middleware";
import PageController from "../../../../controllers/user/page";

const routes: Router= expres.Router();
const pageController = new PageController();
routes.get("/:key", validateRequest, pageController.getPageSection.bind(pageController));


export default routes;