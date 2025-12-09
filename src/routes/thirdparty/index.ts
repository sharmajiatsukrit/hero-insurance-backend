import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../utils/middleware";
import AuthRouter from "./auth";
import AuthRoutes from "../user/auth";

import Deviceid from "./deviceid";

import HeroRoutes from "./hero";
import HelperRoutes from "../user/helper";

const routes: Router = expres.Router();
routes.use("/auth", AuthRoutes);
// routes.use("/search", SearchRouter);


routes.use("/firebase", Deviceid);

routes.use("/integration", HeroRoutes);
// routes.use("/notifications", NotificationRoutes);
// routes.use("/helper", HelperRoutes);


export default routes;
