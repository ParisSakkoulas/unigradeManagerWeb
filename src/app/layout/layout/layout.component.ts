import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/auth/role.enum';

import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';


interface NavItem {
  label: string;
  path: string;
  roles: Role[] | null;
  icon: string;
}

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MenuModule, ButtonModule, ToolbarModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  sidebarOpen = signal(true);
  dropdownOpen = signal(false);

  private readonly allNav: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', roles: null, icon: 'pi-home' },
    { label: 'Courses', path: '/courses', roles: null, icon: 'pi-book' },
    { label: 'Teachings', path: '/teachings', roles: null, icon: 'pi-graduation-cap' },
    { label: 'Declarations', path: '/declarations', roles: null, icon: 'pi-file-edit' },
    { label: 'Students', path: '/students', roles: [Role.ADMIN, Role.INSTRUCTOR], icon: 'pi-users' },
    { label: 'Instructors', path: '/instructors', roles: [Role.ADMIN], icon: 'pi-id-card' },
    { label: 'Admin', path: '/admin', roles: [Role.ADMIN], icon: 'pi-cog' },
  ];

  private readonly profileMenu: MenuItem[] = [
    { label: 'My profile', icon: 'pi pi-user', command: () => this.navigate('/profile') },
    { label: 'My statistics', icon: 'pi pi-chart-bar', command: () => this.navigate(this.statsRoute) },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.auth.logout() },
  ];

  get visibleNav(): NavItem[] {
    const role = this.auth.role();
    return this.allNav.filter((item) =>
      item.roles === null || item.roles.includes(role)
    );
  }

  get visibleProfileMenu(): MenuItem[] {
    return this.profileMenu;
  }

  get initials(): string {
    return (this.auth.user()?.login ?? '?').slice(0, 2).toUpperCase();
  }

  get roleLabel(): string {
    const map: Record<Role, string> = {
      [Role.ADMIN]: 'Administrator',
      [Role.INSTRUCTOR]: 'Instructor',
      [Role.STUDENT]: 'Student',
      [Role.GUEST]: 'Guest',
    };
    return map[this.auth.role()] ?? '';
  }

  get statsRoute(): string {
    const role = this.auth.role();
    if (role === Role.INSTRUCTOR || role === Role.ADMIN) return '/statistics/instructor';
    return '/statistics/student';
  }

  navigate(path: string): void {
    this.dropdownOpen.set(false);
    this.router.navigate([path]);
  }
}
