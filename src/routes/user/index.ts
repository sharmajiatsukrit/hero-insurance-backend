import expres, { Router } from "express";
import AuthRoutes from "../user/auth";

import Deviceid from "./deviceid";

import NotificationRoutes from "../user/notification";
import HelperRoutes from "../user/helper";
import BlogRoute from "./blog/index";
import RecentBlogRoute from "./home/recent-blogs/index";


const routes: Router = expres.Router();
routes.use("/auth", AuthRoutes);
// routes.use("/search", SearchRouter);


routes.use("/firebase", Deviceid);
routes.use("/notifications", NotificationRoutes);
routes.use("/helper", HelperRoutes);
routes.use("/blog", BlogRoute);
routes.use("/recent-blog", RecentBlogRoute);

export default routes;
