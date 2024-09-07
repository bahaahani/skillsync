import User from '../models/User.js';
import Course from '../models/Course.js';

export const getStudentProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate('coursesEnrolled', 'title')
      .populate('coursesCompleted', 'title')
      .populate('assessmentsTaken', 'title score');

    const progress = {
      coursesEnrolled: user.coursesEnrolled,
      coursesCompleted: user.coursesCompleted,
      assessmentsTaken: user.assessmentsTaken,
      overallScore: user.score,
    };

    res.json(progress);
  } catch (error) {
    next(error);
  }
};

export const getCourseProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const courseProgress = user.courseProgress.find(
      (progress) => progress.course.toString() === courseId
    );

    if (!courseProgress) {
      return res.status(404).json({ message: 'Course progress not found' });
    }

    const progress = {
      course: course.title,
      completedContent: courseProgress.completedContent.length,
      totalContent: course.content.length,
      quizResults: courseProgress.quizResults,
      assignmentSubmissions: courseProgress.assignmentSubmissions,
    };

    res.json(progress);
  } catch (error) {
    next(error);
  }
};

export const updateCourseProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;
    const { contentId, completed } = req.body;

    const user = await User.findById(userId);
    const courseProgress = user.courseProgress.find(
      (progress) => progress.course.toString() === courseId
    );

    if (!courseProgress) {
      return res.status(404).json({ message: 'Course progress not found' });
    }

    if (completed) {
      if (!courseProgress.completedContent.includes(contentId)) {
        courseProgress.completedContent.push(contentId);
      }
    } else {
      courseProgress.completedContent = courseProgress.completedContent.filter(
        (id) => id.toString() !== contentId
      );
    }

    await user.save();

    res.json({ message: 'Course progress updated successfully' });
  } catch (error) {
    next(error);
  }
};