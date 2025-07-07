import expres, { Router } from "express";
import HelperController from "../../../controllers/admin/helper";
import { authAdmin, validateRequest } from "../../../utils/middleware";

const routes: Router = expres.Router();
const helperController = new HelperController();

routes.get("/get-categories", validateRequest, authAdmin, helperController.getCategories.bind(helperController));
// routes.get("/get-attribute-items-by-key/:attribute_key", validateRequest, authAdmin, helperController.getAttributeItemsByKey.bind(helperController));
routes.get("/get-countries", validateRequest, authAdmin, helperController.getCounties.bind(helperController));
routes.get("/get-states", validateRequest, authAdmin, helperController.getStates.bind(helperController));
routes.get("/get-cities", validateRequest, authAdmin, helperController.getCities.bind(helperController));

routes.get("/get-roles", validateRequest, authAdmin, helperController.getRoles.bind(helperController));
routes.get("/get-customers", validateRequest, authAdmin, helperController.getCustomers.bind(helperController));
routes.get("/dashboard/get-totals", validateRequest, authAdmin, helperController.getDashboardTotals.bind(helperController));
routes.get("/get-offer-categories", validateRequest, authAdmin, helperController.getOfferCategories.bind(helperController));

export default routes;
