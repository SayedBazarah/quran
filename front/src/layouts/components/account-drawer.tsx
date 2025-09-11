'use client';

import type { IconButtonProps } from '@mui/material/IconButton';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';

import { Scrollbar } from 'src/components/scrollbar';
import { AnimateBorder } from 'src/components/animate';

import { signOut } from 'src/auth/context/jwt';
import { useAuthContext } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export type AccountDrawerProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  // const pathname = usePathname();

  const { user } = useAuthContext();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: '6px', width: 96, height: 96, borderRadius: '50%' }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: 'primary.main' } },
      }}
    >
      <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 1, height: 1 }}>
        {user?.name?.charAt(0).toUpperCase()}
      </Avatar>
    </AnimateBorder>
  );

  // const renderList = () => (
  //   <MenuList
  //     disablePadding
  //     sx={[
  //       (theme) => ({
  //         py: 3,
  //         px: 2.5,
  //         borderTop: `dashed 1px ${theme.vars.palette.divider}`,
  //         borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
  //         '& li': { p: 0 },
  //       }),
  //     ]}
  //   >
  //     {data.map((option) => {
  //       const rootLabel = pathname.includes('/dashboard') ? 'Home' : 'Dashboard';
  //       const rootHref = pathname.includes('/dashboard') ? '/' : paths.dashboard.root;

  //       return (
  //         <MenuItem key={option.label}>
  //           <Link
  //             component={RouterLink}
  //             href={option.label === 'Home' ? rootHref : option.href}
  //             color="inherit"
  //             underline="none"
  //             onClick={onClose}
  //             sx={{
  //               p: 1,
  //               width: 1,
  //               display: 'flex',
  //               typography: 'body2',
  //               alignItems: 'center',
  //               color: 'text.secondary',
  //               '& svg': { width: 24, height: 24 },
  //               '&:hover': { color: 'text.primary' },
  //             }}
  //           >
  //             {option.icon}

  //             <Box component="span" sx={{ ml: 2 }}>
  //               {option.label === 'Home' ? rootLabel : option.label}
  //             </Box>

  //             {option.info && (
  //               <Label color="error" sx={{ ml: 1 }}>
  //                 {option.info}
  //               </Label>
  //             )}
  //           </Link>
  //         </MenuItem>
  //       );
  //     })}
  //   </MenuList>
  // );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL={`${user?.avatar}?width=24&height=24`}
        displayName={`${user?.name}`}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 320 } },
        }}
      >
        <Scrollbar>
          <Box
            sx={{
              pt: 8,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {renderAvatar()}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {user?.name}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton
            onClose={() => {
              signOut();
              onClose();
            }}
          />
        </Box>
      </Drawer>
    </>
  );
}
