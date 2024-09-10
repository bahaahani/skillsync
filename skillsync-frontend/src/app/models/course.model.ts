import { Lesson } from '../services/course.service';

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: number;
  level: string;
  tags: string[];
  isEnrolled: boolean;
  rating?: number;
  progress?: number;
  lessons?: Lesson[]; // Add this line
}