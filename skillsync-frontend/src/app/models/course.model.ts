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
  rating?: number;
  isEnrolled?: boolean;
  progress?: number;
}