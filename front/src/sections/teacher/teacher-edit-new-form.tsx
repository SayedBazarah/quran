import type { ITeacherItem } from 'src/types/teacher';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box, Stack, Alert, MenuItem } from '@mui/material';

import { appendFormData } from 'src/utils/append-form-data';

import axios, { endpoints } from 'src/lib/axios';
import { useGetBranches } from 'src/actions/branch';
import { GlobalPermissionCode } from 'src/global-config';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type TeacherQuickEditSchemaType = zod.infer<typeof TeacherQuickEditSchema>;

export const TeacherQuickEditSchema = zod.object({
  avatar: schemaHelper.file({
    message: 'الصورة غير صحيحة!',
  }),
  name: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
  email: zod.string().email({ message: 'البريد الإلكتروني غير صحيح!' }),
  phone: schemaHelper.phoneNumber({
    isValid: isValidPhoneNumber,
    message: {
      invalid_type: 'الرقم غير صحيح!',
      required: 'رقم الهاتف مطلوب!',
    },
  }),
  nationalId: zod
    .string()
    .min(1, { message: 'الهوية الوطنية مطلوبة!' })
    .length(14, { message: 'الهوية الوطنية يجب أن تكون 14 رقم!' }),
  gender: zod.string().min(1, { message: 'الجنس مطلوب!' }),
  nationalIdImg: schemaHelper.file({
    message: 'الصورة غير صحيحة!',
  }),
  branchId: zod.string().min(1, { message: 'الفرع مطلوب!' }),
});
// ----------------------------------------------------------------------

type Props = {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
  teacher?: ITeacherItem;
  refetch: () => void;
};

export function TeacherQuickEditForm({ isNew = true, refetch, teacher, open, onClose }: Props) {
  const { user } = useAuthContext();
  const { branches } = useGetBranches();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const creatingPermission = user?.role?.permissions?.find(
    (p) => p.code === GlobalPermissionCode.CreateTeacher
  );
  const updatingPermission = user?.role?.permissions?.find(
    (p) => p.code === GlobalPermissionCode.UpdateTeacher
  );

  const defaultValues: TeacherQuickEditSchemaType = {
    avatar: teacher?.avatar || '',
    name: teacher?.name || '',
    email: teacher?.email || '',
    phone: teacher?.phone || '',
    gender: teacher?.gender || '',
    branchId: teacher?.branch?.id || '',
    nationalId: teacher?.nationalId || '',
    nationalIdImg: teacher?.nationalIdImg || '',
  };

  const methods = useForm<TeacherQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(TeacherQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      appendFormData(formData, data);
      if (isNew)
        await axios.post(endpoints.teacher.new, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      else
        await axios.patch(endpoints.teacher.update.replace(':id', teacher?.id || ''), formData, {
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

  if (isNew && !creatingPermission)
    return (
      <Dialog open={open} onClose={onClose}>
        <Alert severity="error">لا تملك الصلاخيات لاضافة مدرس</Alert>
      </Dialog>
    );

  if (!isNew && !updatingPermission)
    return (
      <Dialog open={open} onClose={onClose}>
        <Alert severity="error">لا تملك صلاحية لتحديث المدرسين </Alert>
      </Dialog>
    );

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>{isNew ? 'اضافة مدرس' : 'تحديث سريع'}</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <Box />
            <Field.UploadAvatar name="avatar" />

            <Field.Text fullWidth name="name" label="اسم المدرس" />
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Field.Text select name="branchId" label="الفرع">
                {branches.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name}
                  </MenuItem>
                ))}
              </Field.Text>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Field.Text name="email" label="البريد الإلكتروني" />
              <Field.Phone name="phone" placeholder="رقم الهاتف" defaultCountry="EG" />
            </Stack>
            <Stack direction="row" spacing={2}>
              <Field.Text name="nationalId" label="رقم البطاقة" disabled={!!teacher} />
              <Field.Text select name="gender" label="الجنس" disabled={!!teacher}>
                <MenuItem value="male">رجل</MenuItem>
                <MenuItem value="female">سيدة</MenuItem>
              </Field.Text>
            </Stack>
            <Field.Upload name="nationalIdImg" disabled={!!teacher} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            الغاء
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            {isNew ? 'اضافة مدرس' : 'تحديث'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
