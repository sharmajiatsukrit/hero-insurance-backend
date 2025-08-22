import expres, { Router } from "express";
import AuthRoutes from "../user/auth";

import Deviceid from "./deviceid";

import NotificationRoutes from "../user/notification";
import HelperRoutes from "../user/helper";
import BlogRoute from "./blog/index";
import RecentBlogRoute from "./home/recent-blogs/index";
import OfferRoute from "./offer";
import TestimonialRoute from "./testimonial";
import AwardRoute from "./award";
import BODRoute from "./board-of-director";
import EnquiryRoute from "./enquiry";
import ClaimRequestRoute from "./claim-request";
import KeyOfficerRoute from "./key-officer";
import PageSectionRoute from "./page";
import InsuranceSolutionyRoute from "./insurance-solution"




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
routes.use("/claim-request", ClaimRequestRoute);
routes.use("/page", PageSectionRoute);
routes.use("/insurance-solution", InsuranceSolutionyRoute);



export default routes;
