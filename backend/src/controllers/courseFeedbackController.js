import Course from '../models/Course.js';
import User from '../models/User.js';
import { emitCourseFeedbackUpdate } from '../utils/socketEvents.js';

export const submitFeedback = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const feedback = {
      user: userId,
      rating,
      comment,
    };

    course.feedback.push(feedback);
    await course.save();

    // Emit real-time update to instructor
    emitCourseFeedbackUpdate(course.instructor, { courseId, feedback });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    next(error);
  }
};

export const getCourseFeedback = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate('feedback.user', 'username');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course.feedback);
  } catch (error) {
    next(error);
  }
};

export const updateFeedback = async (req, res, next) => {
  try {
    const { courseId, feedbackId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const feedback = course.feedback.id(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.user.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this feedback' });
    }

    feedback.rating = rating;
    feedback.comment = comment;
    await course.save();

    res.json({ message: 'Feedback updated successfully', feedback });
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    const { courseId, feedbackId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const feedback = course.feedback.id(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.user.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this feedback' });
    }

    feedback.remove();
    await course.save();

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    next(error);
  }
};