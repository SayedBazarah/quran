import { globalValidatorMiddleware } from "@/shared/middlewares";
import { body } from "express-validator";

export const updateCourseValidator = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be a number"),
  body("price").optional().isNumeric().withMessage("Duration must be a number"),
  globalValidatorMiddleware,
];
