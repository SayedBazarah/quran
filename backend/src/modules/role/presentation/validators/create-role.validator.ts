import { globalValidatorMiddleware } from "@/shared/middlewares";
import { body } from "express-validator";

export const createRoleValidator = [
  body("name").isString().withMessage("Name must be a string"),
  body("isDefault").isBoolean().withMessage("isDefault must be a boolean"),
  body("permissions")
    .isArray()
    .withMessage("Permissions must be an array")
    .custom((value) => {
      if (!value.every((item: unknown) => typeof item === "string")) {
        throw new Error("Each permission must be a string");
      }
      return true;
    }),
  globalValidatorMiddleware,
];
