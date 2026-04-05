import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import {
  Teaching,
  CreateTeachingRequest,
  AssignInstructorRequest,
  DefineGradingRequest,
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class TeachingsService extends ApiService<Teaching> {
  constructor() {
    super('teachings');
  }

  query(params: Record<string, any>): Observable<Teaching[]> {
    return this.getAll(params);
  }

  createTeaching(body: CreateTeachingRequest): Observable<Teaching> {
    return this.create(body);
  }

  assign(id: string, body: AssignInstructorRequest): Observable<Teaching> {
    return this.patchTo<Teaching>(`teachings/${id}/assign`, body);
  }

  defineGrading(id: string, body: DefineGradingRequest): Observable<Teaching> {
    return this.patchTo<Teaching>(`teachings/${id}/grading`, body);
  }

  finalize(id: string): Observable<Teaching> {
    return this.patchTo<Teaching>(`teachings/${id}/finalize`);
  }

  expire(id: string): Observable<Teaching> {
    return this.patchTo<Teaching>(`teachings/${id}/expire`);
  }

  deleteTeaching(id: string): Observable<void> {
    return this.remove(id);
  }
}
