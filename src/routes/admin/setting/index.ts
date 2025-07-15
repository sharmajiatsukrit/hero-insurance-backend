import expres, { Router } from "express";
import SettingController from "../../../controllers/admin/setting";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import { upload } from "../../../utils/storage";

const routes: Router = expres.Router();
const settingController = new SettingController();

routes.get("/get-settings", validateRequest, authAdmin, settingController.getSettings.bind(settingController));
routes.post("/save-app_details", validateRequest, authAdmin, upload.fields([{ name: "site_logo" }, { name: "site_favicon" }]), settingController.saveAppDetails.bind(settingController));

routes.post("/save-smtp_details", validateRequest, authAdmin, settingController.saveSMTPDetails.bind(settingController));


export default routes;
