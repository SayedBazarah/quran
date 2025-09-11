'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { Box, Tab, Card, Tabs, useTheme } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetStudentById } from 'src/actions/student';
import { DashboardContent } from 'src/layouts/dashboard';
import { GlobalPermissionCode } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NotFoundView } from 'src/sections/error';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

import StudentDetails from '../student-details';
import { StudentParentForm } from '../student-parent-form';
import StudentEnrollments from '../student-enrollments-list';

type Props = {
  id: string;
};

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    value: '',
    label: 'نظرة عامة',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
  },
  {
    value: 'parent',
    label: 'بيانات ولي الامر',
    icon: <Iconify width={24} icon="solar:user-rounded-bold" />,
  },
  {
    value: 'enrollments',
    label: 'الدورات',
    icon: <Iconify width={24} icon="ic:round-view-list" />,
  },
];

// ----------------------------------------------------------------------

const TAB_PARAM = 'tab';

export function StudentDetailsView({ id }: Props) {
  const { user } = useAuthContext();
  const { student, studentLoading, refetch } = useGetStudentById(id);

  const theme = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(TAB_PARAM) ?? '';

  const createRedirectPath = (currentPath: string, query: string) => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  if (studentLoading) return <LoadingScreen />;
  if (!student) return <NotFoundView />;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ملف الطالب"
        links={[
          { name: 'لوحة التحكم', href: paths.dashboard.root },
          { name: 'الطلاب', href: paths.dashboard.student.root },
          { name: student.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <RoleBasedGuard
        hasContent
        currentRole={user?.role?.permissions?.map((p) => p.code) || []}
        allowedRoles={[GlobalPermissionCode.UpdateStudent]}
        sx={{
          marginY: 'auto',
        }}
      >
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              px: { md: 2 },
              mb: 3,
              bgcolor: 'background.paper',
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Tabs value={selectedTab}>
              {NAV_ITEMS.map((tab) => (
                <Tab
                  component={RouterLink}
                  key={tab.value}
                  value={tab.value}
                  icon={tab.icon}
                  label={tab.label}
                  href={createRedirectPath(pathname, tab.value)}
                />
              ))}
            </Tabs>
          </Box>

          {selectedTab === '' && <StudentDetails refetch={refetch} student={student} />}
          {selectedTab === 'parent' && (
            <StudentParentForm refetch={refetch} studentId={student.id} parent={student.parent} />
          )}
          {selectedTab === 'enrollments' && <StudentEnrollments student={student} />}
        </Card>
      </RoleBasedGuard>
    </DashboardContent>
  );
}
