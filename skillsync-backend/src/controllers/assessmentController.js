const Assessment = require('../models/Assessment');
const Course = require('../models/Course');
const User = require('../models/User');

exports.getAllAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find().populate('course', 'title');
    res.json(assessments);
  } catch (error) {
    next(error);
  }
};

exports.getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('course', 'title');
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    next(error);
  }
};

exports.createAssessment = async (req, res, next) => {
  try {
    const { title, description, courseId, questions } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const assessment = new Assessment({
      title,
      description,
      course: courseId,
      questions,
    });
    await assessment.save();
    res.status(201).json({ message: 'Assessment created successfully', assessment });
  } catch (error) {
    next(error);
  }
};

exports.updateAssessment = async (req, res, next) => {
  try {
    const { title, description, questions } = req.body;
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      { title, description, questions },
      { new: true }
    );
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json({ message: 'Assessment updated successfully', assessment });
  } catch (error) {
    next(error);
  }
};

exports.deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.takeAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    const { answers } = req.body;
    if (answers.length !== assessment.questions.length) {
      return res.status(400).json({ message: 'Invalid number of answers' });
    }
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === assessment.questions[i].correctAnswer) {
        score++;
      }
    }
    const percentage = (score / assessment.questions.length) * 100;
    
    // Update user's score
    const user = await User.findById(req.user.id);
    user.score += score;
    await user.save();

    res.json({
      message: 'Assessment completed',
      score,
      totalQuestions: assessment.questions.length,
      percentage,
      newTotalScore: user.score,
    });
  } catch (error) {
    next(error);
  }
};