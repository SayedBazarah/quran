import type { IStudentItem } from 'src/types/student';

import dayjs from 'dayjs';
import * as zod from 'zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, Alert, MenuItem } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { appendFormData } from 'src/utils/append-form-data';

import axios, { endpoints } from 'src/lib/axios';
import { useGetBranches } from 'src/actions/branch';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';

import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type StudentQuickEditSchemaType = zod.infer<typeof StudentQuickEditSchema>;

export const StudentQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'الاسم الطالب مطلوب!' }),
  phone: schemaHelper.phoneNumber({
    isValid: isValidPhoneNumber,
    message: {
      required: 'رقم الهاتف مطلوب!',
      invalid_type: 'رقم الهاتف غير صحيح !',
    },
  }),
  gender: zod.string(),
  birthDate: schemaHelper.date({
    message: {
      required: 'تاريخ الميلاد مطلوب!',
      invalid_type: 'تاريخ الميلاد غير صحيح !',
    },
  }),
  address: zod.string().min(1, { message: 'العنوان مطلوب!' }),
  branchId: zod.string().min(1, { message: 'الفرع مطلوب!' }),
  nationalId: zod.string().min(1, { message: 'رقم الهوية مطلوب !' }).length(14, {
    message: 'رقم الهوية يجب ان يكون 14 رقم!',
  }),
  nationalIdImg: schemaHelper.file({
    message: 'الصورة غير صحيحة!',
  }),
  avatar: schemaHelper.file({
    message: 'الصورة غير صحيحة!',
  }),
});
// ----------------------------------------------------------------------

type Props = {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
  currentStudent?: IStudentItem;
  refetch: () => void;
};

export function StudentQuickEditForm({
  isNew = true,
  refetch,
  currentStudent,
  open,
  onClose,
}: Props) {
  const { branches } = useGetBranches();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: StudentQuickEditSchemaType = {
    name: currentStudent?.name || '',
    phone: currentStudent?.phone || '',
    gender: currentStudent?.gender || 'ذكر',
    birthDate: currentStudent?.birthDate || '',
    address: currentStudent?.address || '',
    nationalId: currentStudent?.nationalId || '',
    branchId: currentStudent?.branch?.id || '',
    nationalIdImg: currentStudent?.nationalIdImg || '',
    avatar: currentStudent?.avatar || '',
  };

  const methods = useForm<StudentQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(StudentQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      appendFormData(formData, data);
      if (isNew)
        await axios.post(endpoints.student.new, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      else
        await axios.patch(endpoints.student.update.replace(':id', currentStudent?.id || ''), data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      reset();
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  // ----------------------------------------
  const renderStudentForm = () => (
    <Stack direction="column" spacing={2}>
      <RHFUploadAvatar name="avatar" />
      <Field.Text fullWidth name="name" label="اسم الطالب" />
      <Stack direction="row" spacing={2}>
        <Field.Phone name="phone" label="رقم الهاتف" placeholder="ادخل رقم الهاتف" country="EG" />
        <Field.Text name="address" label="العنوان" />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Field.Text name="nationalId" label="رقم الهوية" />
        <Controller
          name="birthDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DesktopDatePicker
              openTo="year"
              views={['year', 'month', 'day']}
              label="تاريخ الميلاد"
              value={dayjs(field.value)}
              onChange={(date) => field.onChange(dayjs(date) ?? null)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Field.Text select name="branchId" label="الفرع">
          {branches.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {r.name}
            </MenuItem>
          ))}
        </Field.Text>
        <Field.Text select name="gender" label="النوع">
          <MenuItem value="male">رجل</MenuItem>
          <MenuItem value="female">سيدة</MenuItem>
        </Field.Text>
      </Stack>
      <Field.Upload name="nationalIdImg" />
    </Stack>
  );

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>{isNew ? 'اضافة طالب' : 'تحديث سريع'}</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>{renderStudentForm()}</DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            الغاء
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            {isNew ? 'اضافة طالب' : 'تحديث'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
