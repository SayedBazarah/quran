import { RequestHandler } from "express";
import { prisma } from "@/shared/prisma/client";
import { CreateBranchUseCase } from "../application/create-branch";
import { UpdateBranchUseCase } from "../application/update-branch";
import { BranchPrismaRepository } from "../infrastructure/branch-prisma-repository";
import { DeleteBranchUseCase } from "../application/delete-branch";

// Define the interface
export interface IBranchController {
  list: RequestHandler<{}, {}, {}>;
  //   create: RequestHandler<{}, {}, {}>;
  // Add other methods as needed
}

export class BranchController implements IBranchController {
  private repo: BranchPrismaRepository;
  constructor() {
    this.repo = new BranchPrismaRepository(prisma);
  }
  list: RequestHandler = async (req, res) => {
    const branches = await this.repo.findAll();
    res.json(branches);
  };
  create: RequestHandler = async (req, res) => {
    const { name, phone, address } = req.body;
    const useCase = new CreateBranchUseCase(this.repo);

    const branch = await useCase.execute(name, phone, address);

    res.json(branch);
  };

  update: RequestHandler = async (req, res) => {
    const { name, phone, address } = req.body;
    const useCase = new UpdateBranchUseCase(this.repo);

    const role = await useCase.execute(req.params.id, name, phone, address);

    res.json(role);
  };
  delete: RequestHandler = async (req, res) => {
    const useCase = new DeleteBranchUseCase(this.repo);

    await useCase.execute(req.params.id);

    res.json({ message: "Branch deleted" });
  };
}
