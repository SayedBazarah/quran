import { RequestHandler } from "express";
import { prisma } from "@/shared/prisma/client";
import { RolePrismaRepository } from "../infrastructure/role-prisma-repository";
import { CreateRoleUseCase } from "../application/create-role";
import { GetRolePermissionsUseCase } from "../application/permissions-list";
import { UpdateRoleUseCase } from "../application/update-role";

// Define the interface
export interface IRoleController {
  list: RequestHandler<{}, {}, {}>;
  //   create: RequestHandler<{}, {}, {}>;
  // Add other methods as needed
}

export class RoleController implements IRoleController {
  private repo: RolePrismaRepository;
  constructor() {
    this.repo = new RolePrismaRepository(prisma);
  }
  list: RequestHandler = async (req, res) => {
    const roles = await this.repo.findAll();
    res.json(roles);
  };
  create: RequestHandler = async (req, res) => {
    console.log("---- LOGs ----", {
      body: req.body,
    });
    const { name, isDefault, permissions } = req.body;
    const useCase = new CreateRoleUseCase(this.repo);

    const role = await useCase.execute(name, isDefault, permissions);

    res.json(role);
  };
  update: RequestHandler = async (req, res) => {
    const { name, isDefault, permissions } = req.body;
    const useCase = new UpdateRoleUseCase(this.repo);

    const role = await useCase.execute(
      req.params.id,
      name,
      isDefault,
      permissions
    );

    res.json(role);
  };
  permissionsList: RequestHandler = async (req, res) => {
    const useCase = new GetRolePermissionsUseCase(this.repo);
    const permissions = await useCase.execute();
    res.json(permissions);
  };
}
