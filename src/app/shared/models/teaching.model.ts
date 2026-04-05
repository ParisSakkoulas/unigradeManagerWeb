import { CourseRef } from './course.model';
import { InstructorRef } from './instructor.model';

export enum TeachingState {
  ENTERED = 'entered',
  ASSIGNED = 'assigned',
  GRADING_DEFINED = 'grading_defined',
  PARTIALLY_GRADED = 'partially_graded',
  FULLY_GRADED = 'fully_graded',
}

export const TeachingStateLabel: Record<TeachingState, string> = {
  [TeachingState.ENTERED]: 'Entered',
  [TeachingState.ASSIGNED]: 'Assigned',
  [TeachingState.GRADING_DEFINED]: 'Grading defined',
  [TeachingState.PARTIALLY_GRADED]: 'Partially graded',
  [TeachingState.FULLY_GRADED]: 'Fully graded',
};

export enum Semester {
  FALL = 'fall',
  SPRING = 'spring',
}

export const SemesterLabel: Record<Semester, string> = {
  [Semester.FALL]: 'Fall',
  [Semester.SPRING]: 'Spring',
};

export interface Teaching {
  _id: string;
  course: CourseRef;
  year: number;
  semester: Semester;
  instructor: InstructorRef | null;
  state: TeachingState;
  theoryWeight: number | null;
  labWeight: number | null;
  theoryRetentionYear: number | null;
  labRetentionYear: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeachingRequest {
  courseId: string;
  year: number;
  semester: Semester;
}

export interface AssignInstructorRequest {
  instructorId: string;
}

export interface DefineGradingRequest {
  theoryWeight: number;
  labWeight: number;
  theoryRetentionYear?: number;
  labRetentionYear?: number;
}

/** Lightweight ref used when teaching is populated inside another doc */
export interface TeachingRef {
  _id: string;
  course: CourseRef;
  year: number;
  semester: Semester;
}
