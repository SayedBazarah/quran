// Add Permissions to permission table in prisma when application postup if it's not added

import { prisma } from "@/shared/prisma/client";

export enum GlobalPermissionCode {
  CreateAdmin = "create-admin",
  ReadAdmin = "read-admin",
  DeleteAdmin = "delete-admin",
  UpdateAdmin = "update-admin",
  CreateTeacher = "create-teacher",
  ReadTeacher = "read-teacher",
  DeleteTeacher = "delete-teacher",
  UpdateTeacher = "update-teacher",
  CreateStudent = "create-student",
  ReadStudent = "read-student",
  DeleteStudent = "delete-student",
  UpdateStudent = "update-student",
  ReadReports = "read-reports",
  ReadStudentDelayReports = "read-student-delay-reports",
  CreateCourse = "create-course",
  ReadCourse = "read-course",
  DeleteCourse = "delete-course",
  UpdateCourse = "update-course",
  CreateBranch = "create-branch",
  ReadBranch = "read-branch",
  DeleteBranch = "delete-branch",
  UpdateBranch = "update-branch",
  CreateRole = "create-role",
  ReadRole = "read-role",
  DeleteRole = "delete-role",
  UpdateRole = "update-role",
  AcceptStudent = "accept-student",
  AcceptEnrollment = "accept-enrollment",
}

export const GLOBAL_PERMISSIONS = [
  {
    name: "انشاء موظف",
    code: GlobalPermissionCode.CreateAdmin,
  },
  {
    name: "قراءة بيانات الموظفين",
    code: GlobalPermissionCode.ReadAdmin,
  },
  {
    name: "مسح بيانات الموظفين",
    code: GlobalPermissionCode.DeleteAdmin,
  },
  {
    name: "تعديل بيانات الموظفين",
    code: GlobalPermissionCode.UpdateAdmin,
  },
  {
    name: "انشاء مدرس",
    code: GlobalPermissionCode.CreateTeacher,
  },
  {
    name: "قراءة بيانات المدرسين",
    code: GlobalPermissionCode.ReadTeacher,
  },
  {
    name: "مسح بيانات المدرسين",
    code: GlobalPermissionCode.DeleteTeacher,
  },
  {
    name: "تعديل بيانات المدرسين",
    code: GlobalPermissionCode.UpdateTeacher,
  },
  {
    name: "انشاء طالب",
    code: GlobalPermissionCode.CreateStudent,
  },
  {
    name: "قراءة بيانات الطالبين",
    code: GlobalPermissionCode.ReadStudent,
  },
  {
    name: "مسح بيانات الطالبين",
    code: GlobalPermissionCode.DeleteStudent,
  },
  {
    name: "تعديل بيانات الطالبين",
    code: GlobalPermissionCode.UpdateStudent,
  },
  {
    name: "قراءة التقارير",
    code: GlobalPermissionCode.ReadReports,
  },
  {
    name: "قراءة تقارير تاخر الطلاب",
    code: GlobalPermissionCode.ReadStudentDelayReports,
  },
  {
    name: "إنشاء الدورة",
    code: GlobalPermissionCode.CreateCourse,
  },
  {
    name: "قراءة الدورة",
    code: GlobalPermissionCode.ReadCourse,
  },
  {
    name: "حذف الدورة",
    code: GlobalPermissionCode.DeleteCourse,
  },
  {
    name: "تحديث الدورة",
    code: GlobalPermissionCode.UpdateCourse,
  },
  {
    name: "إنشاء فرع",
    code: GlobalPermissionCode.CreateBranch,
  },
  {
    name: "قراءة فرع",
    code: GlobalPermissionCode.ReadBranch,
  },
  {
    name: "حذف فرع",
    code: GlobalPermissionCode.DeleteBranch,
  },
  {
    name: "تحديث فرع",
    code: GlobalPermissionCode.UpdateBranch,
  },
  {
    name: "إنشاء وظيفة",
    code: GlobalPermissionCode.CreateRole,
  },
  {
    name: "قراءة وظيفة",
    code: GlobalPermissionCode.ReadRole,
  },
  {
    name: "حذف وظيفة",
    code: GlobalPermissionCode.DeleteRole,
  },
  {
    name: "تحديث وظيفة",
    code: GlobalPermissionCode.UpdateRole,
  },
  {
    name: "قبول طالب",
    code: GlobalPermissionCode.AcceptStudent,
  },
  {
    name: "قبول دورة",
    code: GlobalPermissionCode.AcceptEnrollment,
  },
];

export async function ensureGlobalPermissions() {
  for (const permission of GLOBAL_PERMISSIONS) {
    const exists = await prisma.permission.findUnique({
      where: { code: permission.code },
    });
    if (!exists) {
      await prisma.permission.create({
        data: { ...permission },
      });
    }
  }
}
