import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import { upload } from "../../../utils/storage";
import OfferCategoryController from "../../../controllers/admin/offer-category";


const routes: Router= expres.Router();
const offerCategory =new OfferCategoryController();
routes.post("/add", validateRequest, authAdmin,upload.single("image"), offerCategory.add.bind(offerCategory));
routes.put("/update/:id", validateRequest, authAdmin,upload.single("image"), offerCategory.update.bind(offerCategory));
routes.get("/by-id/:id", validateRequest, authAdmin, offerCategory.getById.bind(offerCategory));
routes.delete("/delete/:id", validateRequest, authAdmin, offerCategory.delete.bind(offerCategory));
routes.patch("/status/:id", validateRequest, authAdmin, offerCategory.status.bind(offerCategory));


export default routes;