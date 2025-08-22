import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";

import { upload } from "../../../utils/storage";
import InsuranceSolutionController from "../../../controllers/admin/insurance-solution";
const routes: Router = expres.Router();
const insuranceSolutionController = new InsuranceSolutionController();

routes.get("/list", validateRequest, authAdmin, insuranceSolutionController.getList.bind(insuranceSolutionController));
routes.get("/by-id/:id", validateRequest, authAdmin, insuranceSolutionController.getById.bind(insuranceSolutionController));
routes.post("/add", validateRequest, authAdmin, upload.single("image"), insuranceSolutionController.add.bind(insuranceSolutionController));
routes.put("/update/:id", validateRequest, authAdmin, upload.single("image"), insuranceSolutionController.update.bind(insuranceSolutionController));
routes.delete("/delete/:id", validateRequest, authAdmin, insuranceSolutionController.delete.bind(insuranceSolutionController));
routes.patch("/status/:id", validateRequest, authAdmin, insuranceSolutionController.updateStatus.bind(insuranceSolutionController));

export default routes;
