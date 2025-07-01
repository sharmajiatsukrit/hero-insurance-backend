import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import { upload } from "../../../utils/storage";
import BODController from "../../../controllers/admin/board-of-director";

const routes: Router= expres.Router();
const bodController =new BODController();
routes.get("/list", validateRequest, authAdmin, bodController.getList.bind(bodController));
routes.post("/add", validateRequest, authAdmin,upload.single("bod_image"), bodController.add.bind(bodController));
routes.put("/update/:id", validateRequest, authAdmin,upload.single("bod_image"), bodController.update.bind(bodController));
routes.get("/by-id/:id", validateRequest, authAdmin, bodController.getById.bind(bodController));
routes.delete("/delete/:id", validateRequest, authAdmin, bodController.delete.bind(bodController));
routes.patch("/status/:id", validateRequest, authAdmin, bodController.status.bind(bodController));


export default routes;