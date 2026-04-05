import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class CoursesService extends ApiService<Course> {
  constructor() {
    super('courses');
  }

  search(q: string): Observable<Course[]> {
    return this.getAll({ q });
  }

  createCourse(body: CreateCourseRequest): Observable<Course> {
    console.log('Creating course with body:', body);
    return this.create(body);
  }

  updateCourse(id: string, body: UpdateCourseRequest): Observable<Course> {
    return this.update(id, body);
  }

  deleteCourse(id: string): Observable<void> {
    return this.remove(id);
  }
}
