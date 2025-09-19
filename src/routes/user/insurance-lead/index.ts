import expres, { Router } from "express";
import { validateRequest } from "../../../utils/middleware";
import InsuranceLeadController from "../../../controllers/user/insurance-lead";


const routes: Router= expres.Router();
const insuranceLeadController = new InsuranceLeadController();
routes.post("/add", validateRequest, insuranceLeadController.add.bind(insuranceLeadController));


export default routes;