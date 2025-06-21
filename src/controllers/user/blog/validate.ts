import { body, param, query } from "express-validator";

const validate = (endPoint: string) => {
    let validationRules: any = [];

    switch (endPoint) {
        
        case "getById":
            validationRules = [
                param("id")
                    .isInt({ min: 1 })
                    .withMessage("Blog ID must be a positive integer")
            ];
            break;

        case "getList":
            validationRules = [
                query("page")
                    .optional()
                    .isInt({ min: 1 })
                    .withMessage("Page must be a positive integer"),
                query("limit")
                    .optional()
                    .isInt({ min: 1, max: 100 })
                    .withMessage("Limit must be between 1 and 100"),
                query("search")
                    .optional()
                    .isLength({ min: 1, max: 50 })
                    .withMessage("Search term must be between 1 and 50 characters")
                    .trim(),
                query("status")
                    .optional()
                    .isIn(['true', 'false'])
                    .withMessage("Status must be 'true' or 'false'"),
                query("locale")
                    .optional()
                    .isIn(['en', 'ar', 'fr', 'es'])
                    .withMessage("Locale must be one of: en, ar, fr, es")
            ];
            break;

        default:
            validationRules = [];
            break;
    }

    return validationRules;
};

export default validate;