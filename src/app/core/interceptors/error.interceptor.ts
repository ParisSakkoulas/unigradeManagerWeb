import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 401 is handled by authInterceptor — skip here
      if (err.status === 401) return throwError(() => err);

      const message = extractMessage(err);

      if (err.status === 0) {
        toast.error('Cannot reach the server. Check your connection.');
      } else if (err.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (err.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (err.status === 404) {
        toast.error('Resource not found.');
      } else if (err.status === 409) {
        toast.error(
          message ?? 'A conflict occurred. The resource may already exist.',
        );
      } else if (err.status === 400) {
        toast.error(message ?? 'Invalid request. Check the form fields.');
      }

      return throwError(() => err);
    }),
  );
};

function extractMessage(err: HttpErrorResponse): string | null {
  const body = err.error;
  if (!body) return null;
  if (typeof body.message === 'string') return body.message;
  if (Array.isArray(body.message)) return body.message[0];
  return null;
}
