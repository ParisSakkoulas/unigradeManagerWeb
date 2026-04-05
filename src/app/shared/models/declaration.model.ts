import { StudentRef } from './student.model';
import { TeachingRef } from './teaching.model';

export enum DeclarationState {
  PARTIAL = 'partial',
  FINALIZED = 'finalized',
}

export interface Declaration {
  _id: string;
  teaching: TeachingRef;
  student: StudentRef;
  state: DeclarationState;
  theoryGrade: number | null;
  labGrade: number | null;
  finalGrade: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeclarationRequest {
  teachingId: string;
}

export interface SetGradeRequest {
  theoryGrade?: number;
  labGrade?: number;
}

export interface BulkGradeEntry {
  registrationNumber: string;
  theoryGrade?: number;
  labGrade?: number;
}

export interface BulkGradesRequest {
  grades: BulkGradeEntry[];
}

export interface TeachingStats {
  total: number;
  passed: number;
  failed: number;
  pending: number;
  passRate: number;
}

export interface StudentStats {
  totalPassed: number;
  totalFailed: number;
  declarations: Declaration[];
}
