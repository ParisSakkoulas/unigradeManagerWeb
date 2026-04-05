import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import {
  Instructor,
  CreateInstructorRequest,
  UpdateInstructorRequest,
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class InstructorsService extends ApiService<Instructor> {
  constructor() { super('instructors'); }

  getMyProfile(): Observable<Instructor> {
    return this.getFrom<Instructor>('instructors/me');
  }

  createInstructor(body: CreateInstructorRequest): Observable<Instructor> {
    return this.create(body);
  }

  updateInstructor(id: string, body: UpdateInstructorRequest): Observable<Instructor> {
    return this.update(id, body);
  }

  deleteInstructor(id: string): Observable<void> {
    return this.remove(id);
  }
}