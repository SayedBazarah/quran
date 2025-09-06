import { globalValidatorMiddleware } from "@/shared/middlewares";
import { body } from "express-validator";

export const createCourseValidator = [
  body("name").isString().withMessage("Name must be a string"),
  body("duration").isNumeric().withMessage("Duration must be a number"),
  body("price").isNumeric().withMessage("Duration must be a number"),
  globalValidatorMiddleware,
];
