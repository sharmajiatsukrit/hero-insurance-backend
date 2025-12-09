import expres, { Router } from "express";
import AuthRoutes from "../user/auth";

import Deviceid from "./deviceid";

import HelperRoutes from "../user/helper";
import BlogRoute from "./blog/index";
import RecentBlogRoute from "./home/recent-blogs/index";
import OfferRoute from "./offer";
import AdsRoute from "./ads";
import TestimonialRoute from "./testimonial";
import AwardRoute from "./award";
import BODRoute from "./board-of-director";
import EnquiryRoute from "./enquiry";
import ClaimRequestRoute from "./claim-request";
import KeyOfficerRoute from "./key-officer";
import PageSectionRoute from "./page";
import InsuranceSolutionyRoute from "./insurance-solution"
import MenuRoute from "./menu";
import AllInsuranceRoute from "./all-insurance";
import CorporateInsuranceRoute from "./corporate-insurance";
import CallBackRequestRoute from "./call-back-request";
import InsuranceLeadRoute from "./insurance-lead";
import HelpRequestRoute from "./help-request";





const routes: Router = expres.Router();
routes.use("/auth", AuthRoutes);
// routes.use("/search", SearchRouter);


routes.use("/firebase", Deviceid);
routes.use("/helper", HelperRoutes);
routes.use("/blog", BlogRoute);
routes.use("/recent-blog", RecentBlogRoute);
routes.use("/offer", OfferRoute);
routes.use("/ads", AdsRoute);
routes.use("/testimonial", TestimonialRoute);
routes.use("/awards", AwardRoute);
routes.use("/key-officer", KeyOfficerRoute);
routes.use("/bod", BODRoute);
routes.use("/enquiry", EnquiryRoute);
routes.use("/claim-request", ClaimRequestRoute);
routes.use("/help-request", HelpRequestRoute);
routes.use("/page", PageSectionRoute);
routes.use("/insurance-solution", InsuranceSolutionyRoute);
routes.use("/menu", MenuRoute);
routes.use("/all-insurance-request", AllInsuranceRoute);
routes.use("/corporate-insurance-request", CorporateInsuranceRoute);
routes.use("/call-back-request", CallBackRequestRoute);
routes.use("/insurance-lead", InsuranceLeadRoute);




export default routes;
