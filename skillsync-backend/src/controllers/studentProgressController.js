const Course = require('../models/Course');
const User = require('../models/User');

exports.getStudentProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user.coursesEnrolled.includes(courseId)) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }

    // Assuming we add a progress field to the User model for each course
    const progress = user.courseProgress.find(p => p.course.toString() === courseId);

    res.json(progress || { course: courseId, completedContent: [] });
  } catch (error) {
    next(error);
  }
};

exports.markContentAsCompleted = async (req, res, next) => {
  try {
    const { courseId, contentId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user.coursesEnrolled.includes(courseId)) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }

    const contentExists = course.content.some(c => c._id.toString() === contentId);
    if (!contentExists) {
      return res.status(404).json({ message: 'Content not found in this course' });
    }

    let progress = user.courseProgress.find(p => p.course.toString() === courseId);
    if (!progress) {
      progress = { course: courseId, completedContent: [] };
      user.courseProgress.push(progress);
    }

    if (!progress.completedContent.includes(contentId)) {
      progress.completedContent.push(contentId);
    }

    await user.save();

    res.json({ message: 'Content marked as completed', progress });
  } catch (error) {
    next(error);
  }
};

exports.submitQuiz = async (req, res, next) => {
  try {
    const { courseId, contentId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const content = course.content.id(contentId);
    if (!content || content.type !== 'quiz') {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const user = await User.findById(userId);
    if (!user.coursesEnrolled.includes(courseId)) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }

    let score = 0;
    const results = content.quizQuestions.map((question, index) => {
      const isCorrect = question.correctAnswer === answers[index];
      if (isCorrect) score++;
      return { questionIndex: index, isCorrect };
    });

    const percentage = (score / content.quizQuestions.length) * 100;

    // Update user's progress
    let progress = user.courseProgress.find(p => p.course.toString() === courseId);
    if (!progress) {
      progress = { course: courseId, completedContent: [], quizResults: [] };
      user.courseProgress.push(progress);
    }

    progress.quizResults.push({
      quiz: contentId,
      score,
      percentage,
      completedAt: new Date()
    });

    if (!progress.completedContent.includes(contentId)) {
      progress.completedContent.push(contentId);
    }

    await user.save();

    res.json({
      message: 'Quiz submitted successfully',
      score,
      percentage,
      results
    });
  } catch (error) {
    next(error);
  }
};

exports.submitAssignment = async (req, res, next) => {
  try {
    const { courseId, contentId } = req.params;
    const { submissionText } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const content = course.content.id(contentId);
    if (!content || content.type !== 'assignment') {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const user = await User.findById(userId);
    if (!user.coursesEnrolled.includes(courseId)) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }

    // Update user's progress
    let progress = user.courseProgress.find(p => p.course.toString() === courseId);
    if (!progress) {
      progress = { course: courseId, completedContent: [], assignmentSubmissions: [] };
      user.courseProgress.push(progress);
    }

    progress.assignmentSubmissions.push({
      assignment: contentId,
      submissionText,
      submittedAt: new Date()
    });

    if (!progress.completedContent.includes(contentId)) {
      progress.completedContent.push(contentId);
    }

    await user.save();

    res.json({
      message: 'Assignment submitted successfully',
      submittedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};