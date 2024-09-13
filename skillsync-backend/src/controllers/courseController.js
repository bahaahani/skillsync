import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";

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
    const courseId = req.params.id;

    // Check if the request is for course stats
    if (courseId === "stats") {
      // Handle the stats request here
      const totalCourses = await Course.countDocuments();
      const totalEnrollments = await User.aggregate([
        {
          $project: {
            enrolledCoursesCount: {
              $cond: {
                if: { $isArray: "$enrolledCourses" },
                then: { $size: "$enrolledCourses" },
                else: 0,
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$enrolledCoursesCount" },
          },
        },
      ]);
      return res.json({
        totalCourses,
        totalEnrollments: totalEnrollments[0]?.total || 0,
      });
    }

    // If it's not 'stats', proceed with finding the course by ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Error in getCourseById:", error);
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const courseData = req.body;

    // Validate instructor ID
    if (!mongoose.Types.ObjectId.isValid(courseData.instructor)) {
      return res.status(400).json({ message: "Invalid instructor ID" });
    }

    // Set a default price if not provided
    if (courseData.price === undefined || courseData.price === null) {
      courseData.price = 0; // or any other default value
    }

    const course = new Course(courseData);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation Error", errors });
    }
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: courseId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Course removed from wishlist" });
  } catch (error) {
    console.error("Error in removeFromWishlist:", error);
    next(error);
  }
};

export const getCourseProgress = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const courseProgress = user.courseProgress.find(
      (cp) => cp.course.toString() === courseId
    );

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
    let courseProgress = user.courseProgress.find(
      (cp) => cp.course.toString() === courseId
    );

    if (!courseProgress) {
      courseProgress = { course: courseId, completedLessons: [] };
      user.courseProgress.push(courseProgress);
    }

    if (completed && !courseProgress.completedLessons.includes(lessonId)) {
      courseProgress.completedLessons.push(lessonId);
    } else if (!completed) {
      courseProgress.completedLessons = courseProgress.completedLessons.filter(
        (id) => id.toString() !== lessonId
      );
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

export const getRecommendedCourses = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const enrolledCourseIds = user.enrolledCourses || [];
    const recommendedCourses = await Course.find({
      _id: { $nin: enrolledCourseIds },
    }).limit(5);
    res.json(recommendedCourses);
  } catch (error) {
    console.error("Error in getRecommendedCourses:", error);
    next(error);
  }
};

export const getEnrolledCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('enrolledCourses');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.enrolledCourses || []);
  } catch (error) {
    console.error("Error in getEnrolledCourses:", error);
    next(error);
  }
};
