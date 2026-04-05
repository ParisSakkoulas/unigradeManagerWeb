import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../../core/auth/role.enum';
import {
  InstructorRank,
  InstructorRankLabel,
} from '../models/instructor.model';
import {
  Semester,
  SemesterLabel,
  TeachingState,
  TeachingStateLabel,
} from '../models/teaching.model';

type LabelInput =
  | Role
  | InstructorRank
  | TeachingState
  | Semester
  | string
  | null
  | undefined;

const RoleLabel: Record<Role, string> = {
  [Role.ADMIN]: 'Administrator',
  [Role.INSTRUCTOR]: 'Instructor',
  [Role.STUDENT]: 'Student',
  [Role.GUEST]: 'Guest',
};

/**
 * Converts any domain enum value to a human-readable label.
 *
 * Usage:
 *   {{ user.role | roleLabel }}               → "Administrator"
 *   {{ instructor.rank | roleLabel }}         → "Associate Professor"
 *   {{ teaching.state | roleLabel }}          → "Grading defined"
 *   {{ teaching.semester | roleLabel }}       → "Spring"
 */
@Pipe({
  name: 'roleLabel',
  standalone: true,
})
export class RoleLabelPipe implements PipeTransform {
  transform(value: LabelInput): string {
    if (!value) return '—';

    if (value in RoleLabel) return RoleLabel[value as Role];
    if (value in InstructorRankLabel)
      return InstructorRankLabel[value as InstructorRank];
    if (value in TeachingStateLabel)
      return TeachingStateLabel[value as TeachingState];
    if (value in SemesterLabel) return SemesterLabel[value as Semester];

    return value;
  }
}
