import expres, { Router } from "express";
import { validateRequest } from "../../../utils/middleware";
import CorporateInsuranceRequestController from "../../../controllers/user/corporate-insurance";


const routes: Router= expres.Router();
const corporateInsuranceRequestController = new CorporateInsuranceRequestController();
routes.post("/add", validateRequest, corporateInsuranceRequestController.add.bind(corporateInsuranceRequestController));


export default routes;