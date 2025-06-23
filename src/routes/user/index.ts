import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../utils/middleware";
import AuthRouter from "./auth";
import AuthRoutes from "../user/auth";

import Deviceid from "./deviceid";

import DashboardRoutes from "./dashboard";
import NotificationRoutes from "../user/notification";
import HelperRoutes from "../user/helper";
import BlogRoute from "./blog/index";
import RecentBlogRoute from "./home/recent-blogs/index";


const routes: Router = expres.Router();
routes.use("/auth", AuthRoutes);
// routes.use("/search", SearchRouter);


routes.use("/firebase", Deviceid);

routes.use("/dashboard", DashboardRoutes);
routes.use("/notifications", NotificationRoutes);
routes.use("/helper", HelperRoutes);
routes.use("/blog", BlogRoute);
routes.use("/recent-blog", RecentBlogRoute);




export default routes;
