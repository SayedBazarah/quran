import { globalValidatorMiddleware } from "@/shared/middlewares/global-validator.middleware";
import { body, param } from "express-validator";

export const createUpdateParentValidator = [
  param("id").optional().isString().withMessage("Id must be a string"),
  body("studentId").isString().withMessage("studentId is not a string"),
  body("email").optional().isEmail().withMessage("Email is invalid").optional(),
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("phone")
    .isString()
    .withMessage("Phone number is invalid")
    .isLength({
      min: 10,
      max: 14,
    })
    .withMessage("Phone number must be 10 digits"),
  body("nationalIdImg").optional().isString(),
  body("nationalId")
    .isString()
    .withMessage("National ID must be a string")
    .isLength({ min: 14, max: 14 })
    .withMessage("National ID must be at 14 characters long"),
  body("relationship").isString(),
  body("gender")
    .isString()
    .withMessage("Gender must be a string")
    .isIn(["male", "female"])
    .withMessage("Gender must be male, female, or other"),
  body("birthDate").isString().withMessage("BithDate must be a string"),
  globalValidatorMiddleware,
];
