import { Branch as IBranch } from "@prisma/client";
export class Branch {
  constructor(private readonly branch: IBranch) {}

  getBranch<K extends keyof IBranch>(field?: K): IBranch[K] | IBranch {
    return (field && this.branch[field]) || this.branch;
  }
}
