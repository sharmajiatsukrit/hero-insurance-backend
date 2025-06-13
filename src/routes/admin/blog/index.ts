import expres, { Router } from "express";
import BlogController from "../../../controllers/admin/blog";
import { authAdmin, validateRequest } from "../../../utils/middleware";

const routes: Router= expres.Router();
const blogController =new BlogController();
routes.get("/list", validateRequest, authAdmin, blogController.getList.bind(blogController));
routes.post("/add", validateRequest, authAdmin, blogController.add.bind(blogController));
routes.put("/update/:id", validateRequest, authAdmin, blogController.update.bind(blogController));
routes.get("/by-id/:id", validateRequest, authAdmin, blogController.getById.bind(blogController));

export default routes;