import { Branch } from "@prisma/client";

export interface IBranchRepository {
  // List
  create(branch: Partial<Branch>): Promise<Branch>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Branch[]>;
  update(branch: Partial<Branch>): Promise<Branch>;
}
