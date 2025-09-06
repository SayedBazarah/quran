import { globalValidatorMiddleware } from "@/shared/middlewares/global-validator.middleware";
import { param } from "express-validator";

export const findByEmailValidator = [
  param("email").isEmail().withMessage("Email is invalid"),
  globalValidatorMiddleware,
];
