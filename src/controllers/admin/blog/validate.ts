import { body, param, query } from "express-validator";

const validate = (endPoint: string) => {
    let validationRules: any = [];

    switch (endPoint) {
        case "add":
            validationRules = [
                body("name")
                    .notEmpty()
                    .withMessage("Blog name is required")
                    .isLength({ min: 3, max: 100 })
                    .withMessage("Blog name must be between 3 and 100 characters")
                    .trim(),
                body("description")
                    .optional()
                    .isLength({ max: 1000 })
                    .withMessage("Description cannot exceed 1000 characters")
                    .trim(),
                body("image")
                    .optional()
                    .isURL()
                    .withMessage("Image must be a valid URL"),
                body("status")
                    .optional()
                    .isBoolean()
                    .withMessage("Status must be a boolean value")
            ];
            break;

        case "update":
            validationRules = [
                param("id")
                    .isInt({ min: 1 })
                    .withMessage("Blog ID must be a positive integer"),
                body("name")
                    .optional()
                    .isLength({ min: 3, max: 100 })
                    .withMessage("Blog name must be between 3 and 100 characters")
                    .trim(),
                body("description")
                    .optional()
                    .isLength({ max: 1000 })
                    .withMessage("Description cannot exceed 1000 characters")
                    .trim(),
                body("image")
                    .optional()
                    .isURL()
                    .withMessage("Image must be a valid URL"),
                body("status")
                    .optional()
                    .isBoolean()
                    .withMessage("Status must be a boolean value")
            ];
            break;

        case "getById":
            validationRules = [
                param("id")
                    .isInt({ min: 1 })
                    .withMessage("Blog ID must be a positive integer")
            ];
            break;

        case "delete":
            validationRules = [
                param("id")
                    .isInt({ min: 1 })
                    .withMessage("Blog ID must be a positive integer")
            ];
            break;

        case "status":
            validationRules = [
                param("id")
                    .isInt({ min: 1 })
                    .withMessage("Blog ID must be a positive integer"),
                body("status")
                    .notEmpty()
                    .withMessage("Status is required")
                    .isBoolean()
                    .withMessage("Status must be a boolean value")
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

        case "getActiveBlogs":
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
                query("locale")
                    .optional()
                    .isIn(['en', 'ar', 'fr', 'es'])
                    .withMessage("Locale must be one of: en, ar, fr, es")
            ];
            break;

        case "getStats":
            validationRules = [
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