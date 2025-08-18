import expres, { Router } from "express";

import { authAdmin, validateRequest } from "../../../utils/middleware";
import OurJourneyController from "../../../controllers/admin/our-journey";
import { upload } from "../../../utils/storage";

const routes: Router = expres.Router();
const ourJourneyController = new OurJourneyController();

routes.get("/list", validateRequest, authAdmin, ourJourneyController.getList.bind(ourJourneyController));
routes.post("/add", validateRequest, authAdmin, upload.single("image"), ourJourneyController.add.bind(ourJourneyController));
routes.put("/update/:id", validateRequest, authAdmin, upload.single("image"), ourJourneyController.update.bind(ourJourneyController));
routes.get("/by-id/:id", validateRequest, authAdmin, ourJourneyController.getById.bind(ourJourneyController));
routes.delete("/delete/:id", validateRequest, authAdmin, ourJourneyController.delete.bind(ourJourneyController));
routes.patch("/status/:id", validateRequest, authAdmin, ourJourneyController.status.bind(ourJourneyController));

export default routes;
