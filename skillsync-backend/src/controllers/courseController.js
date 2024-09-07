const Course = require('../models/Course');
const User = require('../models/User');
const createNotification = require('../utils/createNotification');
const cloudinary = require('../utils/cloudinary');
const { achievementTypes, checkAndAwardAchievement } = require('../utils/achievements');
const { updateRealTimeAnalytics } = require('./analyticsController');
const { emitCourseEnrollment } = require('../utils/socketEvents');
const cache = require('../utils/cache');

exports.getAllCourses = async (req, res, next) => {
  try {
    const cachedCourses = cache.get('allCourses');
    if (cachedCourses) {
      return res.json(cachedCourses);
    }

    const courses = await Course.find().populate('instructor', 'username');
    cache.set('allCourses', courses);
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
    // Trigger real-time analytics update
    await updateRealTimeAnalytics();
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

    // Update user's enrolled courses
    const user = await User.findById(req.user.id);
    user.coursesEnrolled.push(course._id);
    await user.save();

    // Create a notification for course enrollment
    const notification = await createNotification(
      req.user.id,
      'course_enrollment',
      `You have successfully enrolled in the course: ${course.title}`,
      course._id,
      'Course'
    );

    // Emit real-time notification to the user
    emitNotification(req.user.id, notification);

    // Emit course enrollment update
    emitCourseEnrollment(course._id, {
      courseId: course._id,
      userId: req.user.id,
      username: user.username,
    });

    // Trigger real-time analytics update
    await updateRealTimeAnalytics();

    res.json({ message: 'Enrolled in course successfully' });
  } catch (error) {
    next(error);
  }
};

exports.completeCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (!course.enrolledUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are not enrolled in this course' });
    }

    const user = await User.findById(req.user.id);
    if (user.coursesCompleted.includes(course._id)) {
      return res.status(400).json({ message: 'You have already completed this course' });
    }

    user.coursesCompleted.push(course._id);
    user.score += 100; // Add points for completing a course
    await user.save();

    // Check for course completion achievement
    await checkAndAwardAchievement(user._id, achievementTypes.COURSE_COMPLETION);

    // Check for quick learner achievement
    await checkAndAwardAchievement(user._id, achievementTypes.QUICK_LEARNER);

    // Create a notification for course completion
    await createNotification(
      req.user.id,
      'course_completed',
      `Congratulations! You have completed the course: ${course.title}`,
      course._id,
      'Course'
    );

    res.json({ message: 'Course completed successfully', newScore: user.score });
  } catch (error) {
    next(error);
  }
};

exports.uploadMaterial = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to upload materials to this course' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    course.materials.push({
      title: req.body.title,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype
    });
    await course.save();

    res.json({ message: 'Material uploaded successfully', course });
  } catch (error) {
    next(error);
  }
};

exports.addContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, title, description, quizQuestions, assignmentInstructions, dueDate } = req.body;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to add content to this course' });
    }

    const newContent = {
      type,
      title,
      description,
    };

    if (type === 'video' || type === 'document') {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
      newContent.fileUrl = result.secure_url;
    } else if (type === 'quiz') {
      newContent.quizQuestions = quizQuestions;
    } else if (type === 'assignment') {
      newContent.assignmentInstructions = assignmentInstructions;
      newContent.dueDate = dueDate;
    }

    course.content.push(newContent);
    await course.save();

    res.status(201).json({ message: 'Content added successfully', content: newContent });
  } catch (error) {
    next(error);
  }
};

exports.updateContent = async (req, res, next) => {
  try {
    const { courseId, contentId } = req.params;
    const { title, description, quizQuestions, assignmentInstructions, dueDate } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update content in this course' });
    }

    const contentIndex = course.content.findIndex(c => c._id.toString() === contentId);
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const content = course.content[contentIndex];
    content.title = title || content.title;
    content.description = description || content.description;

    if (content.type === 'quiz') {
      content.quizQuestions = quizQuestions || content.quizQuestions;
    } else if (content.type === 'assignment') {
      content.assignmentInstructions = assignmentInstructions || content.assignmentInstructions;
      content.dueDate = dueDate || content.dueDate;
    }

    await course.save();

    res.json({ message: 'Content updated successfully', content });
  } catch (error) {
    next(error);
  }
};

exports.deleteContent = async (req, res, next) => {
  try {
    const { courseId, contentId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete content from this course' });
    }

    const contentIndex = course.content.findIndex(c => c._id.toString() === contentId);
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Content not found' });
    }

    course.content.splice(contentIndex, 1);
    await course.save();

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    next(error);
  }
};