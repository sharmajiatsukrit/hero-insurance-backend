import expres, { Router } from "express";
import BlogController from "../../../../controllers/user/blog";
import { validateRequest } from "../../../../utils/middleware";
const routes: Router= expres.Router();
const blogController =new BlogController();
routes.get("/list", validateRequest, blogController.getList.bind(blogController));


export default routes;