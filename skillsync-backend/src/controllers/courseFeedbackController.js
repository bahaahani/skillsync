const CourseFeedback = require('../models/CourseFeedback');
const Course = require('../models/Course');
const User = require('../models/User');
const createNotification = require('../utils/createNotification');
const { emitNotification } = require('../utils/socketEvents');

exports.submitFeedback = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    const course = await Course.findById(courseId).populate('instructor');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.enrolledUsers.includes(req.user.id)) {
      return res.status(403).json({ message: 'You must be enrolled in the course to submit feedback' });
    }

    const existingFeedback = await CourseFeedback.findOne({ course: courseId, user: req.user.id });
    if (existingFeedback) {
      return res.status(400).json({ message: 'You have already submitted feedback for this course' });
    }

    const feedback = new CourseFeedback({
      course: courseId,
      user: req.user.id,
      rating,
      comment,
    });

    await feedback.save();

    // Create a notification for the instructor
    const notification = await createNotification(
      course.instructor._id,
      'new_feedback',
      `New feedback received for your course: ${course.title}`,
      courseId,
      'Course'
    );

    // Emit real-time notification to the instructor
    emitNotification(course.instructor._id, notification);

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    next(error);
  }
};

exports.getCourseFeedback = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const feedback = await CourseFeedback.find({ course: courseId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    const averageRating = feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length;

    res.json({ feedback, averageRating });
  } catch (error) {
    next(error);
  }
};

exports.respondToFeedback = async (req, res, next) => {
  try {
    const { feedbackId } = req.params;
    const { response } = req.body;

    const feedback = await CourseFeedback.findById(feedbackId).populate('course');
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to respond to this feedback' });
    }

    feedback.instructorResponse = {
      content: response,
      createdAt: new Date(),
    };

    await feedback.save();

    // Notify the student that the instructor has responded to their feedback
    await createNotification(
      feedback.user,
      'feedback_response',
      `The instructor has responded to your feedback for the course: ${feedback.course.title}`,
      feedback.course._id,
      'Course'
    );

    res.json({ message: 'Response submitted successfully', feedback });
  } catch (error) {
    next(error);
  }
};

exports.getCourseFeedbackForInstructor = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, instructor: req.user.id });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or you are not the instructor' });
    }

    const feedback = await CourseFeedback.find({ course: courseId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    const averageRating = feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length;

    res.json({ feedback, averageRating });
  } catch (error) {
    next(error);
  }
};

exports.rateInstructorResponse = async (req, res, next) => {
  try {
    const { feedbackId } = req.params;
    const { rating } = req.body;

    const feedback = await CourseFeedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to rate this response' });
    }

    if (!feedback.instructorResponse) {
      return res.status(400).json({ message: 'No instructor response to rate' });
    }

    feedback.instructorResponse.rating = rating;
    await feedback.save();

    res.json({ message: 'Instructor response rated successfully', feedback });
  } catch (error) {
    next(error);
  }
};

exports.getInstructorResponseRatings = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, instructor: req.user.id });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or you are not the instructor' });
    }

    const feedback = await CourseFeedback.find({ 
      course: courseId, 
      'instructorResponse.rating': { $exists: true } 
    });

    const totalRatings = feedback.length;
    const averageRating = feedback.reduce((acc, curr) => acc + curr.instructorResponse.rating, 0) / totalRatings;

    res.json({ totalRatings, averageRating });
  } catch (error) {
    next(error);
  }
};