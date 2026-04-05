import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import {
  Declaration,
  CreateDeclarationRequest,
  SetGradeRequest,
  BulkGradesRequest,
  TeachingStats,
  StudentStats,
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class DeclarationsService extends ApiService<Declaration> {
  constructor() {
    super('declarations');
  }

  query(params: Record<string, any>): Observable<Declaration[]> {
    return this.getAll(params);
  }

  declare(body: CreateDeclarationRequest): Observable<Declaration> {
    return this.create(body);
  }

  undeclare(id: string): Observable<void> {
    return this.remove(id);
  }

  finalizeDeclaration(id: string): Observable<Declaration> {
    return this.patchTo<Declaration>(`declarations/${id}/finalize`);
  }

  setGrade(id: string, body: SetGradeRequest): Observable<Declaration> {
    return this.patchTo<Declaration>(`declarations/${id}/grade`, body);
  }

  bulkGrade(
    teachingId: string,
    body: BulkGradesRequest,
  ): Observable<{ updated: number; notFound: string[] }> {
    return this.postTo(`declarations/teaching/${teachingId}/bulk-grade`, body);
  }

  getTeachingStats(teachingId: string): Observable<TeachingStats> {
    return this.getFrom<TeachingStats>(
      `declarations/teaching/${teachingId}/stats`,
    );
  }

  getStudentStats(studentId: string): Observable<StudentStats> {
    return this.getFrom<StudentStats>(
      `declarations/student/${studentId}/stats`,
    );
  }

  getInstructorStats(instructorId: string): Observable<any> {
    return this.getFrom(`declarations/instructor/${instructorId}/stats`);
  }
}
