import { globalValidatorMiddleware } from "@/shared/middlewares";
import { param } from "express-validator";

export const deleteCourseValidator = [
  param("id").isNumeric().withMessage("ID must be a number"),
  globalValidatorMiddleware,
];
