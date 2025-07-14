import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import LocationController from "../../../controllers/admin/location";


const routes: Router= expres.Router();
const locationController =new LocationController();
routes.get("/list", validateRequest, authAdmin, locationController.getList.bind(locationController));
routes.post("/add", validateRequest, authAdmin, locationController.add.bind(locationController));
routes.put("/update/:id", validateRequest, authAdmin, locationController.update.bind(locationController));
routes.get("/by-id/:id", validateRequest, authAdmin, locationController.getById.bind(locationController));
routes.delete("/delete/:id", validateRequest, authAdmin, locationController.delete.bind(locationController));
routes.patch("/status/:id", validateRequest, authAdmin, locationController.status.bind(locationController));


export default routes;