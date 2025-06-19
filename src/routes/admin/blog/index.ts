import expres, { Router } from "express";
import BlogController from "../../../controllers/admin/blog";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import { upload } from "../../../utils/storage";
const routes: Router= expres.Router();
const blogController =new BlogController();
routes.get("/list", validateRequest, authAdmin, blogController.getList.bind(blogController));
routes.post("/add", validateRequest, authAdmin,upload.single("blog_image"), blogController.add.bind(blogController));
routes.put("/update/:id", validateRequest, authAdmin,upload.single("blog_image"), blogController.update.bind(blogController));
routes.get("/by-id/:id", validateRequest, authAdmin, blogController.getById.bind(blogController));
routes.delete("/delete/:id", validateRequest, authAdmin, blogController.delete.bind(blogController));
routes.patch("/status/:id", validateRequest, authAdmin, blogController.status.bind(blogController));


export default routes;