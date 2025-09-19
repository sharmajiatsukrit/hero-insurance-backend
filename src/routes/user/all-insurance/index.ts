import expres, { Router } from "express";
import { validateRequest } from "../../../utils/middleware";
import AllInsuranceRequestController from "../../../controllers/user/all-insurance";

const routes: Router= expres.Router();
const allInsuranceRequestController = new AllInsuranceRequestController();
routes.post("/add", validateRequest, allInsuranceRequestController.add.bind(allInsuranceRequestController));


export default routes;