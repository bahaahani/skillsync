const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', auth, userController.getProfile);

// PUT /api/users/profile
router.put('/profile', auth, userController.updateProfile);

// DELETE /api/users/profile
router.delete('/profile', auth, userController.deleteProfile);

module.exports = router;