const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', require: true },
    date: { type: Date, required: true },
    check_in: { type: Date }, // Check-in timestamp
    check_out: { type: Date }, // Check-out timestamp
    status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);