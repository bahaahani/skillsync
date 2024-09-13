import mongoose from "mongoose";
import Course from "../models/Course.js";


// Add more instructor-specific functions here, such as:
export const getInstructorCourses = async (req, res, next) => {
  try {
    const instructorId = req.params.instructorId;
    const courses = await Course.find({ instructor: instructorId });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

export const getInstructorStats = async (req, res, next) => {
  try {
    const instructorId = req.params.instructorId;
    const coursesCount = await Course.countDocuments({ instructor: instructorId });
    
    // Add more stats
    const totalStudents = await Course.aggregate([
      { $match: { instructor: mongoose.Types.ObjectId(instructorId) } },
      { $group: { _id: null, totalEnrollments: { $sum: "$enrollments" } } }
    ]);

    const averageRating = await Course.aggregate([
      { $match: { instructor: mongoose.Types.ObjectId(instructorId) } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    res.json({
      coursesCount,
      totalStudents: totalStudents[0]?.totalEnrollments || 0,
      averageRating: averageRating[0]?.avgRating || 0
    });
  } catch (error) {
    next(error);
  }
};