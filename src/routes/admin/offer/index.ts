import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import { upload } from "../../../utils/storage";
import OfferController from "../../../controllers/admin/offer";


const routes: Router= expres.Router();
const offerController =new OfferController();
routes.get("/list", validateRequest, authAdmin, offerController.getList.bind(offerController));
routes.post("/add", validateRequest, authAdmin,upload.single("offer_image"), offerController.add.bind(offerController));
routes.put("/update/:id", validateRequest, authAdmin,upload.single("offer_image"), offerController.update.bind(offerController));
routes.get("/by-id/:id", validateRequest, authAdmin, offerController.getById.bind(offerController));
routes.delete("/delete/:id", validateRequest, authAdmin, offerController.delete.bind(offerController));
routes.patch("/status/:id", validateRequest, authAdmin, offerController.status.bind(offerController));


export default routes;