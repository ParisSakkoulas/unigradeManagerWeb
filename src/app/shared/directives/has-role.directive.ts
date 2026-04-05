import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
} from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/auth/role.enum';

/**
 * Structural directive that shows content only if the current user has one of the given roles.
 *
 * Usage:
 *   <div *hasRole="[Role.ADMIN]">Admin only</div>
 *   <div *hasRole="[Role.ADMIN, Role.INSTRUCTOR]">Admin or instructor</div>
 *
 * With else template:
 *   <div *hasRole="[Role.ADMIN]; else noAccess">Admin content</div>
 *   <ng-template #noAccess><p>No access</p></ng-template>
 */
@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly tpl = inject(TemplateRef<any>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly auth = inject(AuthService);

  private roles: Role[] = [];
  private elseTpl: TemplateRef<any> | null = null;
  private hasView = false;

  // effect() called in field initializer — valid injection context
  private readonly _effect = effect(() => {
    this.auth.role(); // track signal
    this.update();
  });

  @Input() set hasRole(roles: Role[]) {
    this.roles = roles ?? [];
    this.update();
  }

  @Input() set hasRoleElse(tpl: TemplateRef<any>) {
    this.elseTpl = tpl;
    this.update();
  }

  private update(): void {
    const allowed = this.auth.hasRole(...this.roles);

    if (allowed && !this.hasView) {
      this.vcr.clear();
      this.vcr.createEmbeddedView(this.tpl);
      this.hasView = true;
    } else if (!allowed && this.hasView) {
      this.vcr.clear();
      if (this.elseTpl) {
        this.vcr.createEmbeddedView(this.elseTpl);
      }
      this.hasView = false;
    }
  }
}
