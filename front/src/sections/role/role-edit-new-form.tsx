import type { IRoleItem } from 'src/types/admin';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Stack, Alert } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axios, { endpoints } from 'src/lib/axios';
import { GlobalPermissionCode } from 'src/global-config';
import { useGetRoles, useGetPermissions } from 'src/actions/role';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type RoleQuickEditSchemaType = zod.infer<typeof RoleQuickEditSchema>;

export const RoleQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
  isDefault: zod.boolean().optional(),
  permissions: zod.array(
    zod
      .object({
        id: zod.string(),
        name: zod.string().min(2).max(100),
      })
      .optional()
  ),
});

type Props = {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
  role?: IRoleItem;
  refetch: () => void;
};

export function RoleQuickEditForm({ isNew = true, role, open, onClose }: Props) {
  const { user } = useAuthContext();
  const { permissions } = useGetPermissions();
  const { refetch } = useGetRoles();

  const creatingPermission = user?.role?.permissions?.find(
    (p) => p.code === GlobalPermissionCode.CreateRole
  );
  const updatingPermission = user?.role?.permissions?.find(
    (p) => p.code === GlobalPermissionCode.UpdateRole
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const defaultValues: RoleQuickEditSchemaType = {
    name: role?.name || '',
    isDefault: role?.isDefault || false,
    permissions: role?.permissions || [],
  };

  const methods = useForm<RoleQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(RoleQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!isNew && role?.id) {
      try {
        await axios.patch(endpoints.role.update.replace(':id', role.id), {
          name: data.name,
          isDefault: data.isDefault,
          permissions: data.permissions?.map((p) => p?.id) || [],
        });
        refetch();
        reset();
        setErrorMessage('');
      } catch (error) {
        console.error(error);
        const feedbackMessage = getErrorMessage(error);
        setErrorMessage(feedbackMessage);
      }
    } else {
      try {
        await axios.post(endpoints.role.new, {
          name: data.name,
          isDefault: data.isDefault,
          permissions: data.permissions?.map((p) => p?.id) || [],
        });
        refetch();
        reset();
        setErrorMessage('');
      } catch (error) {
        console.error(error);
        const feedbackMessage = getErrorMessage(error);
        setErrorMessage(feedbackMessage);
      }
    }
    onClose();
  });

  if (isNew && !creatingPermission)
    return (
      <Dialog open={open} onClose={onClose}>
        <Alert severity="error">لا تملك الصلاحيات لاضافة وظيفة</Alert>
      </Dialog>
    );

  if (!isNew && !updatingPermission)
    return (
      <Dialog open={open} onClose={onClose}>
        <Alert severity="error">لا تملك صلاحية لتحديث وظيفة </Alert>
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
      <DialogTitle>{isNew ? 'اضافة وظيفة' : 'تحديث سريع'}</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack direction="column" pt={2} spacing={2}>
            <Field.Text name="name" label="اسم الوظيفة" />
            <Field.Autocomplete
              multiple
              name="permissions"
              label="المهام"
              options={permissions.map((p) => ({ id: p.id, name: p.name }))}
              getOptionLabel={(option) => option.name}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack flex={1} direction="row" spacing={2} justifyContent="space-between">
            <Box>
              <Field.Checkbox name="isDefault" label="الوظيفة الافتراضية لاي موظف جديد" />
            </Box>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={onClose}>
                الغاء
              </Button>

              <Button type="submit" variant="contained" loading={isSubmitting}>
                {isNew ? 'اضافة الوظيفة' : 'تحديث'}
              </Button>
            </Stack>
          </Stack>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
