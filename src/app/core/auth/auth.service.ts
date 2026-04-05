import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Role } from './role.enum';
import { AuthState, AuthUser } from './auth-state.interface';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'gm_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // ─── State ────────────────────────────────────────────────────────────────
  private readonly _state = signal<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  readonly user = computed(() => this._state().user);
  readonly token = computed(() => this._state().token);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly role = computed(() => this._state().user?.role ?? Role.GUEST);
  readonly profileId = computed(() => this._state().user?.profileId ?? null);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {
    this.restoreSession();
  }

  // ─── Login ────────────────────────────────────────────────────────────────
  login(login: string, password: string): Observable<{ accessToken: string }> {
    return this.http
      .post<{
        accessToken: string;
      }>(`${this.apiUrl}/login`, { login, password })
      .pipe(tap(({ accessToken }) => this.setSession(accessToken)));
  }

  // ─── Register ─────────────────────────────────────────────────────────────
  register(
    login: string,
    password: string,
    role: Role.STUDENT | Role.INSTRUCTOR,
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, {
      login,
      password,
      role,
    });
  }

  // ─── Logout ───────────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._state.set({ user: null, token: null, isAuthenticated: false });
    this.router.navigate(['/auth/login']);
  }

  // ─── Role helpers ─────────────────────────────────────────────────────────
  hasRole(...roles: Role[]): boolean {
    return roles.includes(this.role());
  }

  isAdmin(): boolean {
    return this.role() === Role.ADMIN;
  }

  isInstructor(): boolean {
    return this.role() === Role.INSTRUCTOR;
  }

  isStudent(): boolean {
    return this.role() === Role.STUDENT;
  }

  // ─── Session ──────────────────────────────────────────────────────────────
  private setSession(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    const user = this.decodeToken(token);
    this._state.set({ user, token, isAuthenticated: true });
  }

  private restoreSession(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    const user = this.decodeToken(token);
    if (!user) {
      localStorage.removeItem(TOKEN_KEY);
      return;
    }

    // Check expiry
    const payload = this.parseJwt(token);
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return;
    }

    this._state.set({ user, token, isAuthenticated: true });
  }

  private decodeToken(token: string): AuthUser | null {
    try {
      const payload = this.parseJwt(token);
      if (!payload) return null;
      return {
        sub: payload.sub,
        login: payload.login,
        role: payload.role,
        profileId: payload.profileId ?? null,
      };
    } catch {
      return null;
    }
  }

  private parseJwt(token: string): any {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}
