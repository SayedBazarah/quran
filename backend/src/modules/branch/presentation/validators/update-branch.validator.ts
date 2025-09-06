import { globalValidatorMiddleware } from "@/shared/middlewares";
import { body } from "express-validator";

export const updateBranchValidator = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("address").optional().isString().withMessage("Address must be a string"),
  body("phone").optional().isString().withMessage("Phone must be a string"),
  globalValidatorMiddleware,
];
