import type { IStudentItem, IEnrollmentItem } from 'src/types/student';

import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Box, Stack, Button } from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';

import { EnrollmentEditForm } from './enrollment-form';
import { NewEnrollmentForm } from './new-enrollemtn-form';

type Props = {
  student: IStudentItem;
};
export default function StudentEnrollments({ student }: Props) {
  const [enrollment, setEnrollment] = useState<IEnrollmentItem | null>(null);
  const newEnrollment = useBoolean();
  return (
    <>
      <Scrollbar>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="end">
            <Box display="flex" alignItems="center" gap={1}>
              <Button variant="contained" color="primary" onClick={newEnrollment.onTrue}>
                اضافة دورة جديدة
              </Button>
            </Box>
          </Stack>
          {student.enrollments?.map((item) => (
            <Stack
              key={item.id}
              direction="row"
              justifyContent="space-between"
              sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, pb: 1.5 }}
            >
              <Box>{item.course?.name}</Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setEnrollment(item);
                  }}
                >
                  عرض بيانات الدورة
                </Button>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Scrollbar>
      {newEnrollment.value && (
        <NewEnrollmentForm
          studentId={student.id}
          open={newEnrollment.value}
          onClose={newEnrollment.onFalse}
        />
      )}
      {enrollment && (
        <EnrollmentEditForm
          studentId={student.id}
          open={!!enrollment}
          onClose={() => setEnrollment(null)}
          enrollment={enrollment}
        />
      )}
    </>
  );
}
