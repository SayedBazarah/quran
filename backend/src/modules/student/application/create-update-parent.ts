import { Parent } from "@prisma/client";
import { IStudentRepository } from "../domain/student-repository";

export class CreateUpdateParentUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(parent: Parent): Promise<Parent> {
    const newParent = await this.repo.createUpdateParent(parent);

    return newParent;
  }
}
