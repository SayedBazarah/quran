import { Router } from "express";
import * as validators from "./validators";
import { RoleController } from "./role.controller";

const router = Router();
const roleController = new RoleController();

// Local login
router.post("/create", validators.createRoleValidator, roleController.create);
router.patch(
  "/update/:id",
  validators.updateRoleValidator,
  roleController.update
);

router.get("/list", roleController.list);
router.get("/permissions", roleController.permissionsList);

export default router;
