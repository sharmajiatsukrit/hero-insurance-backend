import expres, { Router } from "express";
import HeroController from "../../../controllers/thirdparty/hero";
import { UserRouteEndPoints, AdminRouteEndPoints } from "../../../enums/user";
import { authRequest, validateRequest } from "../../../utils/middleware";
import { upload } from "../../../utils/storage";

const routes: Router = expres.Router();
const heroController = new HeroController();

routes.post("/lead-generation", validateRequest, heroController.leadGeneration.bind(heroController));
routes.post("/token-validation", validateRequest, heroController.tokenValidation.bind(heroController));
routes.post("/health-quote", validateRequest, heroController.healthQuote.bind(heroController));
routes.post("/misp-login", validateRequest, heroController.mispLogin.bind(heroController));
routes.post("/misp-auth", validateRequest, heroController.mispAuth.bind(heroController));
routes.post("/renewal-link", validateRequest, heroController.renewalLink.bind(heroController));
routes.post("/cp-details", validateRequest, heroController.cpDetails.bind(heroController));
routes.post("/register-claim", validateRequest, heroController.registerCliam.bind(heroController));
routes.post("/cleaver-tap-event", validateRequest, heroController.cleaverTapEvent.bind(heroController));

// routes.get("/get-offer-filters/:product_id", validateRequest, authRequest, dashboardController.getOfferFilters.bind(dashboardController));


export default routes;