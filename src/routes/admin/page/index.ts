import expres, { Router } from "express";
import { authAdmin, validateRequest } from "../../../utils/middleware";
import { upload } from "../../../utils/storage";
import PageController from "../../../controllers/admin/page";

const routes: Router = expres.Router();
const pageController = new PageController();
// Home Page (H)
routes.post("/home/add/banner_section", validateRequest, authAdmin, upload.single("image"), pageController.addHBS.bind(pageController));
routes.post("/home/add/performance_counters_section", validateRequest, authAdmin, pageController.addHPCS.bind(pageController));
routes.post("/home/add/hero_insurance_broking_details_section", validateRequest, authAdmin, pageController.addHHIBDS.bind(pageController));
routes.post("/home/add/tailored_business_solutions_section", validateRequest, authAdmin, pageController.addHTBSS.bind(pageController));
routes.post("/home/add/awards_and_recognitions_section", validateRequest, authAdmin, pageController.addHAARS.bind(pageController));
routes.post("/home/add/customer_testimonials_section", validateRequest, authAdmin, pageController.addHCTS.bind(pageController));

// About Us Page (AU)
routes.post(
    "/about-us/add/header_section",
    validateRequest,
    authAdmin,
    upload.fields([{ name: "image" }, { name: "additional_image" }]),
    pageController.addAUHS.bind(pageController)
);
routes.post("/about-us/add/achievements_section", validateRequest, authAdmin, pageController.addAUAS.bind(pageController));
routes.post("/about-us/add/essence_of_hero_section", validateRequest, authAdmin, pageController.addAUEOHS.bind(pageController));

// Contact Us Page (CU)
routes.post("/contact_us/add/contact_us_section", validateRequest, authAdmin, upload.single("image"), pageController.addCUHS.bind(pageController));

// Claims Page (C)
routes.post("/claims/add/heading_section", validateRequest, authAdmin, upload.single("image"), pageController.addCHS.bind(pageController));

// Awards Page (A)
routes.post("/award/add/awards_section", validateRequest, authAdmin, pageController.addAS.bind(pageController));

//add seo detail
routes.get("/seo-detail", validateRequest, authAdmin, pageController.getPageSeoDetails.bind(pageController));
routes.post("/seo-detail", validateRequest, authAdmin, pageController.addPageSeoDetails.bind(pageController));

// Car Insurance Page
routes.post("/car-insurance/add/seo-detail", validateRequest, authAdmin, pageController.addCISS.bind(pageController));

// Bike Insurance Page
routes.post("/bike-insurance/add/seo-detail", validateRequest, authAdmin, pageController.addBISS.bind(pageController));

// Heatlh Insurance Page
routes.post("/health-insurance/add/seo-detail", validateRequest, authAdmin, pageController.addHISS.bind(pageController));

// Corporate Insurance Page
routes.post("/corporate-insurance/add/seo-detail", validateRequest, authAdmin, pageController.addCorpISS.bind(pageController));

// tailored Insurance Page
routes.post("/tailored-insurance/add/seo-detail", validateRequest, authAdmin, pageController.addTIBSS.bind(pageController));

// TERM Insurance Page
routes.post("/term-insurance/add/seo-detail", validateRequest, authAdmin, pageController.addTISS.bind(pageController));

// pages content
routes.post("/content/add", validateRequest, authAdmin, pageController.addPageContent.bind(pageController));

//pages content rollback to 1 step prev 
routes.get("/content/rollback/:key", validateRequest, authAdmin, pageController.pageContentRollback.bind(pageController));

// Get endpoints
routes.get("/list/:key", validateRequest, authAdmin, pageController.getPageSectionData.bind(pageController));

export default routes;
