import { Lesson } from '../services/course.service';

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  duration: number;
  content: string;
  // Add any other properties that a Lesson should have
}

export interface CourseReview {
  _id: string;
  courseId: string;
  userId: string;
  username: string;
  rating: number;
  content: string;
  createdAt: Date;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: string;
  tags: string[];
  isEnrolled: boolean;
  rating: number;
  userRating?: number;
  category: string;
  progress?: number; // Add this line
  isWishlisted?: boolean;
  reviews?: CourseReview[];
  newReviewContent?: string;
  newReviewRating?: number;
  lessons?: Lesson[]; // Add this line if courses can have lessons
}