import type { IBranchItem } from './admin';

export interface ITeacherItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  nationalId: string;
  nationalIdImg: string;
  avatar: string;
  username: string;

  branch: IBranchItem;
}

export interface ITeacherTableFilters {
  name: string;
}
