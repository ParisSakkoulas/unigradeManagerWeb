import { Role } from './role.enum';

export interface AuthUser {
  sub: string;
  login: string;
  role: Role;
  profileId: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}
