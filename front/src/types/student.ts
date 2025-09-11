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
  enrollmentLogs: IEnrollmentLogItem[];
  student: IStudentItem;
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
  fired: boolean;
  firedAt: string;
  firedBy: IAdminItem;
  graduated: string;
  enrollmentLogs: IEnrollmentLogItem[];
}

export interface IStudentTableFilters {
  name: string;
  teacher: string[];
  admin: string[];
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

export interface IEnrollmentLogItem {
  id: string;
  student: IStudentItem;
  enrollment: IEnrollmentItem;
  admin: IAdminItem;
  note: string;
  createdAt: string;
}
export enum EnrollmentStatus {
  pending = 'pending',
  active = 'active',
  late = 'late',
  dropout = 'dropout',
  end = 'end',
}

export type EnrollmentStatusType = keyof typeof EnrollmentStatus;

// I want value to be the key of the enum

export const EnrollmentStatusList = [
  { value: EnrollmentStatus.pending, label: 'بنتظار القبول' },
  { value: EnrollmentStatus.dropout, label: 'انقطع' },
  { value: EnrollmentStatus.late, label: 'متأخر' },
  { value: EnrollmentStatus.end, label: 'انتهي من الدورة' },
  { value: EnrollmentStatus.active, label: 'يدرس' }, // default
];
