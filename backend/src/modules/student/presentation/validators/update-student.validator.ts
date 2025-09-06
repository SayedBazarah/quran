import { globalValidatorMiddleware } from "@/shared/middlewares/global-validator.middleware";
import { body } from "express-validator";

export const updateStudentValidator = [
  body("email").optional().isEmail().withMessage("Email is invalid"),
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("phone")
    .optional()
    .isString()
    .withMessage("Phone number is invalid")
    .isLength({
      min: 10,
      max: 14,
    }),
  body("nationalId")
    .isString()
    .withMessage("National ID must be a string")
    .isLength({ min: 14, max: 14 })
    .withMessage("National ID must be at 14 characters long"),

  body("gender")
    .isString()
    .withMessage("Gender must be a string")
    .isIn(["male", "female"])
    .withMessage("Gender must be male, female, or other"),
  body("branchId")
    .optional()
    .isString()
    .withMessage("BranchId must be a string"),
  body("birthDate").isString().withMessage("BithDate must be a string"),
  body("address").isString().withMessage("Address must be a string"),
  body("adminId").isString().withMessage("adminId must be a string"),

  globalValidatorMiddleware,
];
