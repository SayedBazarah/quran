import { globalValidatorMiddleware } from "@/shared/middlewares";
import { body, param } from "express-validator";

export const updateRoleValidator = [
  param("id").isString().withMessage("Id must be a string"),
  body("name").optional().isString().withMessage("Name must be a string"),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
  body("permissions")
    .optional()
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
