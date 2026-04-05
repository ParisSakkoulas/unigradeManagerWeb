import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Instructor } from '../../shared/models';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class InstructorsService extends ApiService<Instructor> {
  constructor() {
    super('instructors');
  }

  getMyProfile(): Observable<Instructor> {
    return this.getFrom<Instructor>('instructors/me');
  }
}
