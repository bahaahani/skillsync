import Course from '../models/Course.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

export const getAllCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const courses = await Course.find().skip(skip).limit(limit);
    const totalCount = await Course.countDocuments();

    res.json({ courses, totalCount });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const rateCourse = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existingRating = course.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      course.ratings.push({ user: req.user._id, rating });
    }

    course.rating = course.ratings.reduce((sum, r) => sum + r.rating, 0) / course.ratings.length;
    await course.save();

    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const getUserRating = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const userRating = course.ratings.find(r => r.user.toString() === req.user._id.toString());
    res.json({ rating: userRating ? userRating.rating : null });
  } catch (error) {
    next(error);
  }
};

export const getCourseReviews = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sortBy = req.query.sortBy || 'date';

    const sortOptions = sortBy === 'rating' ? { rating: -1 } : { createdAt: -1 };

    const reviews = await Review.find({ courseId })
      .sort(sortOptions)
      .skip(page * pageSize)
      .limit(pageSize)
      .populate('userId', 'username');

    const totalCount = await Review.countDocuments({ courseId });

    res.json({ reviews, totalCount });
  } catch (error) {
    next(error);
  }
};

export const addCourseReview = async (req, res, next) => {
  try {
    const { content, rating } = req.body;
    const courseId = req.params.id;
    const userId = req.user._id;

    const newReview = new Review({
      courseId,
      userId,
      content,
      rating
    });

    await newReview.save();

    const populatedReview = await Review.findById(newReview._id).populate('userId', 'username');

    res.status(201).json(populatedReview);
  } catch (error) {
    next(error);
  }
};

export const updateCourseReview = async (req, res, next) => {
  try {
    const { content, rating } = req.body;
    const reviewId = req.params.reviewId;

    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, userId: req.user._id },
      { content, rating },
      { new: true }
    ).populate('userId', 'username');

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found or you are not authorized to update it' });
    }

    res.json(updatedReview);
  } catch (error) {
    next(error);
  }
};

export const deleteCourseReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;

    const deletedReview = await Review.findOneAndDelete({ _id: reviewId, userId: req.user._id });

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found or you are not authorized to delete it' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user.wishlist.includes(courseId)) {
      user.wishlist.push(courseId);
      await user.save();
    }

    res.json({ message: 'Course added to wishlist' });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== courseId);
    await user.save();

    res.json({ message: 'Course removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

export const getWishlistedCourses = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    next(error);
  }
};

export const getCourseProgress = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const courseProgress = user.courseProgress.find(cp => cp.course.toString() === courseId);

    if (!courseProgress) {
      return res.json({ progress: 0 });
    }

    const course = await Course.findById(courseId);
    const totalLessons = course.lessons.length;
    const completedLessons = courseProgress.completedLessons.length;

    const progress = (completedLessons / totalLessons) * 100;

    res.json({ progress });
  } catch (error) {
    next(error);
  }
};

export const updateLessonProgress = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const lessonId = req.params.lessonId;
    const userId = req.user._id;
    const { completed } = req.body;

    const user = await User.findById(userId);
    let courseProgress = user.courseProgress.find(cp => cp.course.toString() === courseId);

    if (!courseProgress) {
      courseProgress = { course: courseId, completedLessons: [] };
      user.courseProgress.push(courseProgress);
    }

    if (completed && !courseProgress.completedLessons.includes(lessonId)) {
      courseProgress.completedLessons.push(lessonId);
    } else if (!completed) {
      courseProgress.completedLessons = courseProgress.completedLessons.filter(id => id.toString() !== lessonId);
    }

    await user.save();

    const course = await Course.findById(courseId);
    const totalLessons = course.lessons.length;
    const completedLessonsCount = courseProgress.completedLessons.length;
    const progress = (completedLessonsCount / totalLessons) * 100;

    res.json({ progress });
  } catch (error) {
    next(error);
  }
};