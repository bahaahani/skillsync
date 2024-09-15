export interface OverviewStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  activeUsers: number;
  // ... other fields ...
}

export interface UserGrowth {
  date: string;
  count: number;
}

export interface CourseEnrollment {
  courseId: string;
  courseName: string;
  enrollments: number;
}

export interface CompletionRate {
  courseId: string;
  courseName: string;
  completionRate: number;
}

export interface CourseEngagement {
  courseId: string;
  courseName: string;
  averageEngagementTime: number;
}

export interface RevenueStats {
  totalRevenue: number;
  revenueByMonth: { [month: string]: number };
  // Add other relevant fields
}