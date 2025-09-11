'use client';

import { Box, Card, Stack, Button, Divider, Typography } from '@mui/material';

import axios, { endpoints } from 'src/lib/axios';
import { GlobalPermissionCode } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetPendingEnrollments } from 'src/actions/student';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

export default function AnalyticsOverviewView() {
  const { user } = useAuthContext();
  const { enrollment, refetch } = useGetPendingEnrollments();

  const acceptEnrollment = async (id: string) => {
    await axios.post(endpoints.student.acceptEnrollment.replace(':id', id));
    refetch();
  };

  const renderEnrollments = () => (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          دورات بنتظار القبول
        </Typography>
        {enrollment?.map((item) => (
          <Card key={item.id} sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">{item.student?.name}</Typography>
              <Button variant="contained" color="primary" onClick={() => acceptEnrollment(item.id)}>
                قبول الطالب بالدورة
              </Button>
            </Stack>
          </Card>
        ))}
      </Box>
    );
  return (
    <DashboardContent>
      {/* Pending Enrollments */}
      <RoleBasedGuard
        hasContent
        currentRole={user?.role?.permissions?.map((p) => p.code) || []}
        allowedRoles={[GlobalPermissionCode.AcceptEnrollment]}
        sx={{
          marginY: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: '1fr auto 1fr',
            },
            gap: 2,
          }}
        >
          {renderEnrollments()}
          <Divider orientation="vertical" flexItem />
        </Box>
      </RoleBasedGuard>{' '}
    </DashboardContent>
  );
}
