import expres, { Router } from "express";
import AuthRoutes from "../admin/auth";
import UsersRoutes from "./users";
import RolesRoutes from "./roles";
import PermissionsRoutes from "./permissions";
import CountryRoutes from "./country";
import StateRoutes from "./states";
import CityRoutes from "./cities";
import CategoryRoutes from "./category";
import ProductsRoutes from "./products";
import HelperRoutes from "./helper";
import Customer from "./customer";
import Banner from "./banner";
import BlogRoute from "./blog";
import Faq from "./faq";
import Setting from "./setting";
import BugReport from "./issue-report";
import EnquiryRoute from "./enquiry";
import TestimonialRoute from "./testimonial"
import AwardRoute from "./award"
import BoardOfDirectorRoute from "./board-of-director"
import KeyOfficerRoute from "./key-officer"
import OfferRoute from "./offer"
import AdsRoute from "./ads"
import PageRoute from "./page"
import OfferCategoryRoute from "./offer-category"
import MenuRoute from "./menu"
import LocationRoute from "./location"
import TestimonialCategoryRoute from "./testimonial-category"
import InsuranceTypeRoute from "./insurance-type"
import ClaimRequestRoute from "./claim-request"
import OurJourneyRoute from "./our-journey"
import InsuranceSolutionyRoute from "./insurance-solution"
import UserDetailRoute from "./user-detail"
import CorporateInsuranceRequestRoute from "./corporate-insurance"
import AllInsuranceRequestRoute from "./all-insurance"
import CallBackRequestRoute from "./call-back-request"
import InsuranceLeadRoute from "./insurance-lead"
import SupportEmailConfigRoute from "./support-email-config"
import CorporateInsuranceTypeRoute from "./corporate-insurance-type"
import TailoredBusinessInsuranceTypeRoute from "./tailored-business-insurance-type"
import RequestCallbackDropdownRoute from "./request-callback-dropdown"
import HelpRequestRoute from "./help-request"






const routes: Router = expres.Router();
routes.use("/auth", AuthRoutes);
routes.use("/users", UsersRoutes);
routes.use("/roles", RolesRoutes);
routes.use("/permissions", PermissionsRoutes);
routes.use("/country", CountryRoutes);
routes.use("/state", StateRoutes);
routes.use("/city", CityRoutes);
routes.use("/category", CategoryRoutes);
routes.use("/product", ProductsRoutes);
routes.use("/helper", HelperRoutes);
routes.use("/customer", Customer);
routes.use("/banner", Banner);
routes.use("/faq", Faq);
routes.use("/setting", Setting);
routes.use("/issue-report", BugReport);
routes.use("/blog", BlogRoute);
routes.use("/enquiry", EnquiryRoute);
routes.use("/testimonial", TestimonialRoute);
routes.use("/testimonial-category", TestimonialCategoryRoute);
routes.use("/award", AwardRoute);
routes.use("/bod", BoardOfDirectorRoute);
routes.use("/key-officer", KeyOfficerRoute);
routes.use("/offer", OfferRoute);
routes.use("/ads", AdsRoute);
routes.use("/page", PageRoute);
routes.use("/offer-category", OfferCategoryRoute);
routes.use("/menu", MenuRoute);
routes.use("/location", LocationRoute);
routes.use("/insurance-type", InsuranceTypeRoute);
routes.use("/claim-request", ClaimRequestRoute);
routes.use("/our-journey", OurJourneyRoute);
routes.use("/insurance-solution", InsuranceSolutionyRoute);
routes.use("/user-detail", UserDetailRoute);
routes.use("/corporate-insurance-request", CorporateInsuranceRequestRoute);
routes.use("/all-insurance-request", AllInsuranceRequestRoute);
routes.use("/call-back-request", CallBackRequestRoute);
routes.use("/insurance-lead", InsuranceLeadRoute);
routes.use("/support-email-config", SupportEmailConfigRoute);
routes.use("/corporate-insurance-type", CorporateInsuranceTypeRoute);
routes.use("/tailored-business-insurance-type", TailoredBusinessInsuranceTypeRoute);
routes.use("/request-callback-dropdown", RequestCallbackDropdownRoute);
routes.use("/help-request", HelpRequestRoute);














export default routes;
