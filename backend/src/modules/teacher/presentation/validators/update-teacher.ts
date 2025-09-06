import { globalValidatorMiddleware } from "@/shared/middlewares/global-validator.middleware";
import { body } from "express-validator";

export const updateTeacherValidator = [
  body("email").optional().isEmail().withMessage("Email is invalid"),
  body("password")
    .optional()
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
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
  body("gender")
    .isString()
    .withMessage("Gender must be a string")
    .isIn(["male", "female"])
    .withMessage("Gender must be male, female, or other"),
  body("branchId")
    .optional()
    .isString()
    .withMessage("BranchId must be a string"),
  globalValidatorMiddleware,
];
