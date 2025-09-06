import type { IRoleItem, IBranchItem } from 'src/types/admin';

export type UserType = {
  id: number;
  name: string;
  email: string;
  username: string;
  role: IRoleItem;
  branch: IBranchItem;
} | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
