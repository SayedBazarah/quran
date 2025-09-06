import type { IBranchItem } from 'src/types/admin';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Stack, Alert } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axios, { endpoints } from 'src/lib/axios';
import { useGetBranches } from 'src/actions/branch';
import { GlobalPermissionCode } from 'src/global-config';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type BranchQuickEditSchemaType = zod.infer<typeof BranchQuickEditSchema>;

export const BranchQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
  phone: schemaHelper.phoneNumber({
    isValid: isValidPhoneNumber,
    message: {
      invalid_type: 'الرقم غير صحيح!',
      required: 'رقم الهاتف مطلوب!',
    },
  }),
  address: zod.string().min(1, { message: 'العنوان مطلوب!' }),
});

type Props = {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
  branch?: IBranchItem;
  refetch: () => void;
};

export function BranchQuickEditForm({ isNew = true, branch, open, onClose }: Props) {
  const { user } = useAuthContext();
  const { refetch } = useGetBranches();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const defaultValues: BranchQuickEditSchemaType = {
    name: branch?.name || '',
    phone: branch?.phone || '',
    address: branch?.address || '',
  };

  const creatingPermission = user?.role?.permissions?.find(
    (p) => p.code === GlobalPermissionCode.CreateBranch
  );
  const updatingPermission = user?.role?.permissions?.find(
    (p) => p.code === GlobalPermissionCode.UpdateBranch
  );

  const methods = useForm<BranchQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(BranchQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isNew) await axios.post(endpoints.branch.new, data);
      else await axios.patch(endpoints.branch.update.replace(':id', branch?.id || ''), data);
      reset();
      onClose();
      refetch();
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  if (isNew && !creatingPermission)
    return (
      <Dialog open={open} onClose={onClose}>
        <Alert severity="error">لا تملك الصلاخيات لاضافة فرع</Alert>
      </Dialog>
    );

  if (!isNew && !updatingPermission)
    return (
      <Dialog open={open} onClose={onClose}>
        <Alert severity="error">لا تملك صلاحية لتحديث الفروع </Alert>
      </Dialog>
    );
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={() => {
        reset();
        onClose();
        setErrorMessage('');
      }}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>{isNew ? 'اضافة فرع' : 'تحديث سريع'}</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack direction="column" pt={2} spacing={2}>
            <Field.Text name="name" label="اسم الفرع" />
          </Stack>
          <Stack direction="row" pt={2} spacing={2}>
            <Field.Phone
              name="phone"
              label="الهاتف"
              placeholder="رقم هاتف الفرع"
              defaultCountry="EG"
            />
            <Field.Text name="address" label="العنوان" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack flex={1} direction="row" spacing={2} justifyContent="space-between">
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={onClose}>
                الغاء
              </Button>

              <Button type="submit" variant="contained" loading={isSubmitting}>
                {isNew ? 'اضافة فرع' : 'تحديث'}
              </Button>
            </Stack>
          </Stack>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
