export interface IAdminItem {
  id: string;
  avatar: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  nationalId: string;
  nationalIdImg: string;
  role: IRoleItem;
  branch: IBranchItem;
}

export interface IAdminTableFilters {
  name: string;
}

export interface IRoleItem {
  id: string;
  name: string;
  isDefault?: boolean;
  permissions?: {
    id: string;
    name: string;
    code: string;
  }[];
}

export interface IRoleTableFilters {
  name: string;
}

export interface IBranchItem {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  _count?: {
    teachers: number;
    students: number;
    admins: number;
  };
}
export interface IBranchTableFilters {
  name: string;
}
