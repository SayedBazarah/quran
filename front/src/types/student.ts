import type { ICourseItem } from './course';
import type { ITeacherItem } from './teacher';
import type { IAdminItem, IBranchItem } from './admin';

export interface IEnrollmentItem {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  course: ICourseItem;
  teacher: ITeacherItem;
  admin: IAdminItem;
}

export interface IStudentItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  address: string;
  nationalId: string;
  age?: number;
  avatar: string;
  nationalIdImg: string;

  teacher: ITeacherItem;
  admin: IAdminItem;
  branch: IBranchItem;
  enrollments: IEnrollmentItem[];
  parent: IParentItem;
}

export interface IStudentTableFilters {
  name: string;
}

export interface IParentItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  nationalId: string;
  nationalIdImg: string;
  relationship: string;
}
