import expres, { Router } from "express";
import AuthRoutes from "../user/auth";

import Deviceid from "./deviceid";

import NotificationRoutes from "../user/notification";
import HelperRoutes from "../user/helper";
import BlogRoute from "./blog/index";
import RecentBlogRoute from "./home/recent-blogs/index";
import OfferRoute from "./heroOne/offer";
import TestimonialRoute from "./heroOne/testimonial";
import AwardRoute from "./heroOne/award";
import BODRoute from "./heroOne/board-of-director";
import EnquiryRoute from "./heroOne/enquiry";
import KeyOfficerRoute from "./heroOne/key-officer";
import PageSectionRoute from "./heroOne/page";



const routes: Router = expres.Router();
routes.use("/auth", AuthRoutes);
// routes.use("/search", SearchRouter);


routes.use("/firebase", Deviceid);
routes.use("/notifications", NotificationRoutes);
routes.use("/helper", HelperRoutes);
routes.use("/blog", BlogRoute);
routes.use("/recent-blog", RecentBlogRoute);
routes.use("/offer", OfferRoute);
routes.use("/testimonial", TestimonialRoute);
routes.use("/awards", AwardRoute);
routes.use("/key-officer", KeyOfficerRoute);
routes.use("/bod", BODRoute);
routes.use("/enquiry", EnquiryRoute);
routes.use("/page", PageSectionRoute);


export default routes;
