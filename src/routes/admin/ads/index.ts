import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import { upload } from "../../../utils/storage";
import AdsController from "../../../controllers/admin/ads";


const routes: Router= expres.Router();
const adsController =new AdsController();
routes.get("/list", validateRequest, authAdmin, adsController.getList.bind(adsController));
routes.post("/add", validateRequest, authAdmin,upload.single("image"), adsController.add.bind(adsController));
routes.put("/update/:id", validateRequest, authAdmin,upload.single("image"), adsController.update.bind(adsController));
routes.get("/by-id/:id", validateRequest, authAdmin, adsController.getById.bind(adsController));
routes.delete("/delete/:id", validateRequest, authAdmin, adsController.delete.bind(adsController));
routes.patch("/status/:id", validateRequest, authAdmin, adsController.status.bind(adsController));


export default routes;