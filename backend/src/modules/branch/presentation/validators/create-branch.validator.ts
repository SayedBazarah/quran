import { globalValidatorMiddleware } from "@/shared/middlewares";
import { body } from "express-validator";

export const createBranchValidator = [
  body("name").isString().withMessage("Name must be a string"),
  body("address").isString().withMessage("Address must be a string"),
  body("phone").isString().withMessage("Phone must be a string"),
  globalValidatorMiddleware,
];
