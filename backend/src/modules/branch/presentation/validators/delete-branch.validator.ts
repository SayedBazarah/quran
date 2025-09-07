import { globalValidatorMiddleware } from "@/shared/middlewares";
import { param } from "express-validator";

export const deleteBranchValidator = [
  param("id").isString().withMessage("Id must be a string"),
  globalValidatorMiddleware,
];
