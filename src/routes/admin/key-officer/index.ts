import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import { upload } from "../../../utils/storage";
import KeyOfficerController from "../../../controllers/admin/key-officer";


const routes: Router= expres.Router();
const keyOfficerController =new KeyOfficerController();
routes.get("/list", validateRequest, authAdmin, keyOfficerController.getList.bind(keyOfficerController));
routes.post("/add", validateRequest, authAdmin,upload.single("kof_image"), keyOfficerController.add.bind(keyOfficerController));
routes.put("/update/:id", validateRequest, authAdmin,upload.single("kof_image"), keyOfficerController.update.bind(keyOfficerController));
routes.get("/by-id/:id", validateRequest, authAdmin, keyOfficerController.getById.bind(keyOfficerController));
routes.delete("/delete/:id", validateRequest, authAdmin, keyOfficerController.delete.bind(keyOfficerController));
routes.patch("/status/:id", validateRequest, authAdmin, keyOfficerController.status.bind(keyOfficerController));


export default routes;