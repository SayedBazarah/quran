import type { ICourseItem } from 'src/types/course';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box, Stack, Alert, Typography } from '@mui/material';

import axios, { endpoints } from 'src/lib/axios';
import { GlobalPermissionCode } from 'src/global-config';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type CourseQuickEditSchemaType = zod.infer<typeof CourseQuickEditSchema>;

export const CourseQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
  price: zod.number().min(1, { message: 'سعر الدورة مطلوب!' }),
  duration: zod.number().min(1, { message: 'مدة الدورة مطلوب!' }),
});
// ----------------------------------------------------------------------

type Props = {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
  course?: ICourseItem;
  refetch: () => void;
};

export function CourseQuickEditForm({ isNew = true, course, open, refetch, onClose }: Props) {
  const { user } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const creatingPermission = user?.role?.permissions?.find(
    (p) => p.code === GlobalPermissionCode.CreateCourse
  );
  const updatingPermission = user?.role?.permissions?.find(
    (p) => p.code === GlobalPermissionCode.UpdateCourse
  );

  const defaultValues: CourseQuickEditSchemaType = {
    name: course?.name || '',
    price: course?.price || 0,
    duration: course?.duration || 0,
  };

  const methods = useForm<CourseQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(CourseQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isNew) await axios.post(endpoints.course.new, data);
      else await axios.patch(endpoints.course.update.replace(':id', `${course?.id}`), data);

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
        <Alert severity="error">لا تملك الصلاخيات لاضلاع الدورة</Alert>
      </Dialog>
    );

  if (!isNew && !updatingPermission)
    return (
      <Dialog open={open} onClose={onClose}>
        <Alert severity="error">لا تملك صلاحية لتحديث الدورة</Alert>
      </Dialog>
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
      <DialogTitle>{isNew ? 'اضافة دورة' : 'تحديث سريع'}</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <Box />
            {/* <RHFUploadAvatar name="pic" /> */}
            <Field.Text name="name" label="اسم الدورة" />
            <Stack direction="row" spacing={2}>
              <Field.Text
                name="price"
                label="سعر الدورة"
                type="number"
                slotProps={{
                  input: {
                    endAdornment: <Typography>جنية</Typography>,
                  },
                }}
              />
              <Field.Text
                name="duration"
                label="مدة الدورة"
                type="number"
                slotProps={{
                  input: {
                    endAdornment: <Typography>يوم</Typography>,
                  },
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            الغاء
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            {isNew ? 'اضافة دورة' : 'تحديث'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
