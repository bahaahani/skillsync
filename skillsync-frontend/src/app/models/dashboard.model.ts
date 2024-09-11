export interface User {
  name: string;
  skillsAcquired: string[];
}

export interface CourseStats {
  completed: number;
}

export interface AssessmentStats {
  averageScore: number;
}

export interface Activity {
  title: string;
  description: string;
  date: Date;
}