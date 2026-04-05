import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class StudentsService extends ApiService<Student> {
  constructor() {
    super('students');
  }

  getMyProfile(): Observable<Student> {
    return this.getFrom<Student>('students/me');
  }

  createStudent(body: CreateStudentRequest): Observable<Student> {
    return this.create(body);
  }

  updateStudent(id: string, body: UpdateStudentRequest): Observable<Student> {
    return this.update(id, body);
  }

  deleteStudent(id: string): Observable<void> {
    return this.remove(id);
  }
}
