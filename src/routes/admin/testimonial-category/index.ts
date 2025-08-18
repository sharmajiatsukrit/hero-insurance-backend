import expres, { Router } from "express";
import TestimonialCategoryController from "../../../controllers/admin/testimonial-category";
import { authAdmin, validateRequest } from "../../../utils/middleware";

const routes: Router = expres.Router();
const testimonialCategoryController = new TestimonialCategoryController();

routes.get("/list", validateRequest, authAdmin, testimonialCategoryController.getList.bind(testimonialCategoryController));
routes.post("/add", validateRequest, authAdmin, testimonialCategoryController.add.bind(testimonialCategoryController));
routes.put("/update/:id", validateRequest, authAdmin, testimonialCategoryController.update.bind(testimonialCategoryController));
routes.get("/by-id/:id", validateRequest, authAdmin, testimonialCategoryController.getById.bind(testimonialCategoryController));
routes.delete("/delete/:id", validateRequest, authAdmin, testimonialCategoryController.delete.bind(testimonialCategoryController));
routes.patch("/status/:id", validateRequest, authAdmin, testimonialCategoryController.status.bind(testimonialCategoryController));

export default routes;
