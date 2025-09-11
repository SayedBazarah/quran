import type { IconButtonProps } from '@mui/material/IconButton';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { CustomPopover } from 'src/components/custom-popover';

import { useAuthContext } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
  // const pathname = usePathname();

  const { open, anchorEl, onClose, onOpen } = usePopover();

  const { user } = useAuthContext();

  const renderMenuActions = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{ paper: { sx: { p: 0, width: 200 } }, arrow: { offset: 20 } }}
    >
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Typography variant="subtitle2" noWrap>
          {user?.name}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {user?.email}
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 1 }}>
        <SignOutButton
          size="medium"
          variant="text"
          onClose={onClose}
          sx={{ display: 'block', textAlign: 'left' }}
        />
      </Box>
    </CustomPopover>
  );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL={`${user?.avatar}?width=24&height=24`}
        displayName={`${user?.name}`}
        sx={sx}
        {...other}
      />

      {renderMenuActions()}
    </>
  );
}
