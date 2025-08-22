import expres, { Router } from "express";
import { validateRequest } from "../../../utils/middleware";
import TestimonialController from "../../../controllers/user/testimonial";
const routes: Router= expres.Router();
const testimonialController = new TestimonialController();
routes.get("/list", validateRequest, testimonialController.getList.bind(testimonialController));
routes.get("/by-id/:id", validateRequest, testimonialController.getById.bind(testimonialController));


export default routes;