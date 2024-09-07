const Course = require('../models/Course');
const createNotification = require('../utils/createNotification');

exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate('instructor', 'username');
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'username');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const course = new Course({
      title,
      description,
      instructor: req.user.id,
    });
    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user.id },
      { title, description },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found or you are not the instructor' });
    }
    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, instructor: req.user.id });
    if (!course) {
      return res.status(404).json({ message: 'Course not found or you are not the instructor' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.enrolledUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }
    course.enrolledUsers.push(req.user.id);
    await course.save();

    // Create a notification for course enrollment
    await createNotification(
      req.user.id,
      'course_enrollment',
      `You have successfully enrolled in the course: ${course.title}`,
      course._id,
      'Course'
    );

    res.json({ message: 'Enrolled in course successfully' });
  } catch (error) {
    next(error);
  }
};