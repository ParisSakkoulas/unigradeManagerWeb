import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

/**
 * Generic base service.
 * Feature services extend this and pass their resource path:
 *
 *   @Injectable({ providedIn: 'root' })
 *   export class CoursesService extends ApiService<Course> {
 *     constructor() { super('courses'); }
 *   }
 */
export abstract class ApiService<T> {
  protected readonly http = inject(HttpClient);
  protected readonly base: string;

  constructor(resource: string) {
    this.base = `${environment.apiUrl}/${resource}`;
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  getAll(params?: Record<string, any>): Observable<T[]> {
    return this.http.get<T[]>(this.base, { params: this.toParams(params) });
  }

  getOne(id: string): Observable<T> {
    return this.http.get<T>(`${this.base}/${id}`);
  }

  create<B = Partial<T>>(body: B): Observable<T> {
    console.log('base', this.base, 'body', body);
    return this.http.post<T>(this.base, body);
  }

  update<B = Partial<T>>(id: string, body: B): Observable<T> {
    return this.http.patch<T>(`${this.base}/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /**
   * POST to a sub-resource action.
   * e.g. post('teachings/123/finalize') → PATCH /api/teachings/123/finalize
   */
  protected postTo<R = any>(path: string, body: any = {}): Observable<R> {
    return this.http.post<R>(`${environment.apiUrl}/${path}`, body);
  }

  protected patchTo<R = any>(path: string, body: any = {}): Observable<R> {
    return this.http.patch<R>(`${environment.apiUrl}/${path}`, body);
  }

  protected getFrom<R = any>(
    path: string,
    params?: Record<string, any>,
  ): Observable<R> {
    return this.http.get<R>(`${environment.apiUrl}/${path}`, {
      params: this.toParams(params),
    });
  }

  protected deleteTo<R = any>(path: string): Observable<R> {
    return this.http.delete<R>(`${environment.apiUrl}/${path}`);
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private toParams(obj?: Record<string, any>): HttpParams {
    let params = new HttpParams();
    if (!obj) return params;
    Object.entries(obj).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return params;
  }
}
