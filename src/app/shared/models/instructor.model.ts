export enum InstructorRank {
  ASSISTANT = 'assistant',
  ASSOCIATE = 'associate',
  PROFESSOR = 'professor',
}

export const InstructorRankLabel: Record<InstructorRank, string> = {
  [InstructorRank.ASSISTANT]: 'Assistant Professor',
  [InstructorRank.ASSOCIATE]: 'Associate Professor',
  [InstructorRank.PROFESSOR]: 'Professor',
};

export interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  rank: InstructorRank;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstructorRequest {
  firstName: string;
  lastName: string;
  rank: InstructorRank;
  userId: string;
}

export interface UpdateInstructorRequest {
  firstName?: string;
  lastName?: string;
  rank?: InstructorRank;
}

/** Lightweight ref used when instructor is populated inside another doc */
export interface InstructorRef {
  _id: string;
  firstName: string;
  lastName: string;
  rank: InstructorRank;
}
