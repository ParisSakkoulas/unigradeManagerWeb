export interface Course {
  _id: string;
  code: string;
  name: string;
  description: string | null;
  prerequisites: CourseRef[];
  createdAt: string;
  updatedAt: string;
}

/** Lightweight ref used when course is populated inside another doc */
export interface CourseRef {
  _id: string;
  code: string;
  name: string;
}

export interface CreateCourseRequest {
  code: string;
  name: string;
  description?: string;
  prerequisites?: string[];
}

export interface UpdateCourseRequest {
  name?: string;
  description?: string;
  prerequisites?: string[];
}
