import Assessment from '../models/Assessment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import createNotification from '../utils/createNotification.js';
import { achievementTypes, checkAndAwardAchievement } from '../utils/achievements.js';
import mongoose from 'mongoose';

export const getAllAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find().populate('course', 'title');
    res.json(assessments);
  } catch (error) {
    next(error);
  }
};

export const getAssessmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if the id is 'stats' and handle it separately
    if (id === 'stats') {
      // Handle the stats route here
      // For example:
      return res.json({ message: 'Assessment stats endpoint' });
    }

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid assessment ID' });
    }

    // For normal assessment IDs, proceed with finding the assessment
    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    next(error);
  }
};

export const createAssessment = async (req, res, next) => {
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

export const updateAssessment = async (req, res, next) => {
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

export const deleteAssessment = async (req, res, next) => {
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

export const submitAssessment = async (req, res, next) => {
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
    
    // Update user's score and assessments taken
    const user = await User.findById(req.user.id);
    user.score += score;
    user.assessmentsTaken.push(assessment._id);
    await user.save();

    // Check for assessment ace achievement
    if (percentage === 100) {
      await checkAndAwardAchievement(user._id, achievementTypes.ASSESSMENT_ACE);
    }

    // Create a notification for assessment completion
    await createNotification(
      req.user.id,
      'assessment_completed',
      `You have completed the assessment: ${assessment.title}`,
      assessment._id,
      'Assessment'
    );

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