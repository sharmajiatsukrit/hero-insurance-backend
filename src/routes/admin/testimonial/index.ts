import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import TestimonialController from "../../../controllers/admin/testimonial";

const routes: Router = expres.Router();
const testimonialController = new TestimonialController();

routes.get("/list", validateRequest, authAdmin, testimonialController.getList.bind(testimonialController));
routes.post("/add", validateRequest, authAdmin, testimonialController.add.bind(testimonialController));
routes.put("/update/:id", validateRequest, authAdmin, testimonialController.update.bind(testimonialController));
routes.get("/by-id/:id", validateRequest, authAdmin, testimonialController.getById.bind(testimonialController));
routes.delete("/delete/:id", validateRequest, authAdmin, testimonialController.delete.bind(testimonialController));
routes.patch("/status/:id", validateRequest, authAdmin, testimonialController.status.bind(testimonialController));

export default routes;
