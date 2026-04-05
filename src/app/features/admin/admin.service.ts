import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { User } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AdminService extends ApiService<User> {
  constructor() {
    super('auth');
  }

  getUsers(): Observable<User[]> {
    return this.getFrom<User[]>('auth/users');
  }

  getPendingUsers(): Observable<User[]> {
    return this.getFrom<User[]>('auth/users/pending');
  }

  getUser(id: string): Observable<User> {
    return this.getFrom<User>(`auth/users/${id}`);
  }

  approveUser(id: string): Observable<User> {
    return this.patchTo<User>(`auth/users/${id}/approve`);
  }

  updateUser(id: string, body: Partial<User>): Observable<User> {
    return this.patchTo<User>(`auth/users/${id}`, body);
  }

  deleteUser(id: string): Observable<void> {
    return this.deleteTo<void>(`auth/users/${id}`);
  }
}
