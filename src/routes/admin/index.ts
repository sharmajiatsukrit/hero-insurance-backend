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
import PageRoute from "./page"
import OfferCategoryRoute from "./offer-category"
import MenuRoute from "./menu"



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
routes.use("/award", AwardRoute);
routes.use("/bod", BoardOfDirectorRoute);
routes.use("/key-officer", KeyOfficerRoute);
routes.use("/offer", OfferRoute);
routes.use("/page", PageRoute);
routes.use("/offer-category", OfferCategoryRoute);
routes.use("/menu", MenuRoute);









export default routes;
