import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Box, Chip, Stack, Button } from '@mui/material';

import axios, { endpoints } from 'src/lib/axios';

import { Scrollbar } from 'src/components/scrollbar';

import { getErrorMessage } from 'src/auth/utils';

import { EnrollmentStatus, type IStudentItem, type IEnrollmentItem } from 'src/types/student';

import { EnrollmentEditForm } from './enrollment-form';
import { NewEnrollmentForm } from './new-enrollemtn-form';

type Props = {
  student: IStudentItem;
};
export default function StudentEnrollments({ student }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<IEnrollmentItem | null>(null);
  const newEnrollment = useBoolean();

  const onClose = useCallback(() => {
    setEnrollment(null);
  }, [setEnrollment]);

  const onEndEnrollment = useCallback(async () => {
    try {
      await axios.post(endpoints.student.closeEnrollment.replace(':id', student.id), {
        enrollmentId: enrollment?.id,
      });
      onClose();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  }, [enrollment, student.id, onClose]);
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
          {student.enrollments?.map((item, index) => (
            <Stack
              key={index}
              direction="row"
              justifyContent="space-between"
              sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, pb: 1.5 }}
            >
              <Box>
                {item.course?.name}
                {'   '}
                <Chip
                  label={
                    (item.status === EnrollmentStatus.active && 'يدرس') ||
                    (item.status === EnrollmentStatus.dropout && 'منقطع') ||
                    (item.status === EnrollmentStatus.end && 'انتهت') ||
                    (item.status === EnrollmentStatus.late && 'متاخر') ||
                    'بنتظار قبول الدورة'
                  }
                  color={
                    (item.status === EnrollmentStatus.active && 'default') ||
                    (item.status === EnrollmentStatus.dropout && 'error') ||
                    (item.status === EnrollmentStatus.end && 'success') ||
                    (item.status === EnrollmentStatus.late && 'warning') ||
                    'info'
                  }
                  size="small"
                />
              </Box>
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
          onClose={onClose}
          enrollment={enrollment}
          onEndEnrollment={onEndEnrollment}
          error={errorMessage}
        />
      )}
    </>
  );
}
