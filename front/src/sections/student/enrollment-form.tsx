import type { IEnrollmentItem } from 'src/types/student';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {
  Box,
  Card,
  Stack,
  Alert,
  Divider,
  MenuItem,
  TextField,
  IconButton,
  Typography,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { appendFormData } from 'src/utils/append-form-data';

import axios, { endpoints } from 'src/lib/axios';
import { useGetAdmins } from 'src/actions/admin';
import { useGetTeachers } from 'src/actions/teacher';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
// import { mutate } from 'swr';\\\

// ----------------------------------------------------------------------

export type StudentQuickEditSchemaType = zod.infer<typeof StudentQuickEditSchema>;

export const StudentQuickEditSchema = zod.object({
  teacherId: zod.string().min(1, { message: 'المدرس مطلوب!' }),
  adminId: zod.string().min(1, { message: 'المشرف مطلوب!' }),
  status: zod.string(),
  startDate: zod.string(),
  course: zod.string().min(1, { message: 'الدورة مطلوب!' }),
});
// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  studentId: string;
  enrollment: IEnrollmentItem;
};

enum EnrollmentStatus {
  started = 'active',
  dropout = 'dropout',
  ended = 'ended',
}

const StatusList = [
  { value: EnrollmentStatus.started, label: 'يدرس الدورة' },
  { value: EnrollmentStatus.dropout, label: 'منقطع عن الدورة' },
  { value: EnrollmentStatus.ended, label: 'انتهي من الدورة' },
];
export function EnrollmentEditForm({ studentId, enrollment, open, onClose }: Props) {
  const router = useRouter();
  const { admins } = useGetAdmins();
  const { teachers } = useGetTeachers();
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: StudentQuickEditSchemaType = {
    teacherId: enrollment.teacher?.id,
    adminId: enrollment.admin?.id,
    status: enrollment.status,
    startDate: fDate(enrollment.startDate),
    course: enrollment.course?.name,
  };

  const methods = useForm<StudentQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(StudentQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  console.log(errors);
  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('DATA');
      console.log(data);
      await axios.patch(endpoints.student.updateEnroll.replace(':id', enrollment?.id), data);
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const handleCreatingNote = async () => {
    try {
      await axios.post(endpoints.student.enrollLog.replace(':id', studentId), {
        note: note,
        enrollmentId: enrollment?.id,
      });
      mutate(endpoints.student.details.replace(':id', studentId));
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  };
  // ----------------------------------------
  const renderStudentForm = () => (
    <Stack direction="column" spacing={2}>
      <Field.Text name="course" label="الدورة" disabled />
      <Field.Text name="startDate" label="تريخ بداية الدورة" disabled />
      <Field.Text select name="status" label="حالة الدورة">
        {StatusList.map((r) => (
          <MenuItem key={r.value} value={r.value}>
            {r.label}
          </MenuItem>
        ))}
      </Field.Text>
      <Field.Text select name="teacherId" label="المدرس" disabled={!!enrollment.endDate}>
        {teachers.map((r) => (
          <MenuItem key={r.id} value={r.id}>
            {r.name}
          </MenuItem>
        ))}
      </Field.Text>
      <Field.Text select name="adminId" label="المشرف" disabled={!!enrollment.endDate}>
        {admins.map((r) => (
          <MenuItem key={r.id} value={r.id}>
            {r.name}
          </MenuItem>
        ))}
      </Field.Text>
      {!enrollment.endDate && (
        <Stack direction="row" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" color="error" onClick={onClose}>
            انهاء الدورة
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            تحديث
          </Button>
        </Stack>
      )}
      <Divider sx={{ my: 2 }} />
      <Stack direction="column" spacing={2}>
        <Typography variant="h6">كتابة ملاحظات الدورة</Typography>
        <TextField
          fullWidth
          multiline
          type="text"
          label="اكتب ملاحظة"
          onChange={(value) => setNote(value.target.value)}
          name="notes"
          rows={2}
        />
        <Button color="primary" variant="contained" fullWidth onClick={handleCreatingNote}>
          اضافة ملاحظة
        </Button>
      </Stack>
    </Stack>
  );

  const renderNotes = () => (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6">ملاحظات الدورة</Typography>
      {enrollment.enrollmentLogs?.map((item) => (
        <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box>
            <Typography variant="body1">{item.note}</Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Typography variant="caption" color="textDisabled" sx={{ alignSelf: 'flex-end' }}>
              {item.admin?.name} | {fDate(item.createdAt)}
            </Typography>
          </Box>
        </Card>
      ))}
    </Stack>
  );
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Typography variant="h6">بيانات الدورة</Typography>
          <IconButton
            size="large"
            color="error"
            onClick={onClose}
            sx={{
              bgcolor: 'error.main',
              '&:hover .icon': {
                color: 'error.main',
              },
            }}
          >
            <Iconify
              className="icon"
              icon="carbon:close"
              sx={{
                color: 'white',
              }}
            />
          </IconButton>
        </Stack>
      </DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box sx={{ my: 2, display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 2 }}>
            <Box>{renderStudentForm()}</Box>
            <Divider orientation="vertical" flexItem />
            <Box>{renderNotes()}</Box>
          </Box>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
