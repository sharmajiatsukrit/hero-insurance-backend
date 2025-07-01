import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import { upload } from "../../../utils/storage";
import AwardController from "../../../controllers/admin/award";
const routes: Router= expres.Router();
const awardController =new AwardController();
routes.get("/list", validateRequest, authAdmin, awardController.getList.bind(awardController));
routes.post("/add", validateRequest, authAdmin,upload.single("award_image"), awardController.add.bind(awardController));
routes.put("/update/:id", validateRequest, authAdmin,upload.single("award_image"), awardController.update.bind(awardController));
routes.get("/by-id/:id", validateRequest, authAdmin, awardController.getById.bind(awardController));
routes.delete("/delete/:id", validateRequest, authAdmin, awardController.delete.bind(awardController));
routes.patch("/status/:id", validateRequest, authAdmin, awardController.status.bind(awardController));


export default routes;