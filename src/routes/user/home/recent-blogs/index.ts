import expres, { Router } from "express";
import BlogController from "../../../../controllers/user/blog";
import { authRequest, validateRequest } from "../../../../utils/middleware";
const routes: Router= expres.Router();
const blogController =new BlogController();
routes.get("/list", validateRequest, authRequest, blogController.getList.bind(blogController));


export default routes;