import { body } from "express-validator";

const validate = (endPoint: string) => {
    let validationRules: any = [];

    switch (endPoint) {
        case "add":
            validationRules = [
                body("name")
                    .notEmpty()
                    .withMessage("Name is required")
                    .isLength({ min: 3, max: 100 })
                    .withMessage("Name must be between 3 and 100 characters")
                    .trim(),

                body("email")
                    .notEmpty()
                    .withMessage("Email is required")
                    .isEmail()
                    .withMessage("Must be a valid email")
                    .normalizeEmail(),

                body("mobile_no")
                    .notEmpty()
                    .withMessage("Mobile number is required")
                    .isMobilePhone('en-IN')
                    .withMessage("Must be a valid mobile number"),

                body("description")
                    .optional()
                    .isLength({ max: 1000 })
                    .withMessage("Description cannot exceed 1000 characters")
                    .trim(),

                body("status")
                    .optional()
                    .isBoolean()
                    .withMessage("Status must be a boolean value")
            ];
            break;

       
        default:
            validationRules = [];
            break;
    }

    return validationRules;
};

export default validate;