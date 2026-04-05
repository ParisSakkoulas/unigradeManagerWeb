import { Role } from '../../core/auth/role.enum';

export interface User {
  _id: string;
  login: string;
  role: Role;
  profileId: string | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  login: string;
  password: string;
  role: Role;
}

export interface UpdateUserRequest {
  login?: string;
  password?: string;
}

export interface AdminUpdateUserRequest extends UpdateUserRequest {
  role?: Role;
  isApproved?: boolean;
}
