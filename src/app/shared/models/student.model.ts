export interface Student {
  _id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  enrollmentYear: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentRequest {
  registrationNumber: string;
  firstName: string;
  lastName: string;
  enrollmentYear: number;
  userId: string;
}

export interface UpdateStudentRequest {
  firstName?: string;
  lastName?: string;
  enrollmentYear?: number;
}

/** Lightweight ref used when student is populated inside another doc */
export interface StudentRef {
  _id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
}
