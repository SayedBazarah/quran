import { globalValidatorMiddleware } from "@/shared/middlewares/global-validator.middleware";
import { param } from "express-validator";

export const deleteAdminValidator = [
  param("id").isNumeric().withMessage("ID must be a number"),
  globalValidatorMiddleware,
];
