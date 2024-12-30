
const express = require('express');
const router = express.Router();
const { registerUser, validateRegistration, loginUser, getUserById, updateUser, deleteUser, changePassword, validatePasswordChange, resetPassword, confirmResetPassword, getAllUsers } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to register a new user
router.post('/register', validateRegistration, registerUser);

// Route to log in a user
router.post('/login', loginUser);

// Get user by ID
router.get('/users/:userId',authMiddleware, getUserById);

// Get all users
router.get('/users', authMiddleware, getAllUsers) 

// Update user by ID
router.put('/users/:userId', authMiddleware, updateUser);

// DELETE route to delete a user by ID
router.delete('/users/:userId', authMiddleware, deleteUser);

// Route to change user password
router.put('/users/:userId/change-password', validatePasswordChange, authMiddleware, changePassword);

// Route to request password reset (send email)
router.post('/reset-password', resetPassword);

// Route to confirm password reset (handle reset token)
router.post('/reset-password/:token', confirmResetPassword);

module.exports = router;
