import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Assessment from '../models/Assessment.js';

const router = express.Router();

// Get user progress across all courses
router.get('/user-progress/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('coursesEnrolled')
      .populate('coursesCompleted')
      .populate('assessmentsTaken');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const progress = {
      coursesEnrolled: user.coursesEnrolled.length,
      coursesCompleted: user.coursesCompleted.length,
      assessmentsTaken: user.assessmentsTaken.length,
      // Add more detailed progress information as needed
    };

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user progress', error: error.message });
  }
});

// Get course statistics including enrolled users and average assessment scores
router.get('/course-stats/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrolledUsers = await User.countDocuments({ coursesEnrolled: req.params.courseId });
    const assessments = await Assessment.find({ course: req.params.courseId });
    
    const avgScores = assessments.map(assessment => {
      const scores = assessment.submissions.map(sub => sub.score);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;
      return { assessmentId: assessment._id, avgScore };
    });

    res.json({
      courseId: course._id,
      title: course.title,
      enrolledUsers,
      assessments: avgScores,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course statistics', error: error.message });
  }
});

// Add more integrated routes as needed

export const integratedController = router;