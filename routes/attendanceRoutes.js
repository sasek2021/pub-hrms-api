const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Clock-in route
router.post('/clock-in', authMiddleware, attendanceController.clockIn);

// Clock-out route
router.post('/clock-out', authMiddleware, attendanceController.clockOut);

// Get attendance records by employee
router.get('/', authMiddleware, attendanceController.getAllAttendance);

// Get attendance records by employee
router.get('/:employee_id', authMiddleware, attendanceController.getAttendanceByEmployee);

// Add or update attendance record
router.post('/add', authMiddleware, attendanceController.addOrUpdateAttendance);

// Delete attendance record
router.delete('/:id', authMiddleware, attendanceController.deleteAttendance);

module.exports = router;