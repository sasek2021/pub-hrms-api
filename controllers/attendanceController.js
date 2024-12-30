const Attendance = require('../models/Attendance'); // Import the Attendance model

// Clock In
exports.clockIn = async (req, res) => {
    try {
        const { employee_id } = req.body;

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Check if the employee already clocked in today
        let attendance = await Attendance.findOne({
            employee_id,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        if (attendance && attendance.check_in) {
            return res.status(400).json({ message: "Already clocked in today." });
        }

        if (!attendance) {
            // Create a new attendance record if none exists
            attendance = new Attendance({
                employee_id,
                date: new Date(),
                status: 'Present',
                check_in: new Date(), // Set clock-in time
            });
        } else {
            // Update the existing attendance record with clock-in time
            attendance.check_in = new Date();
        }

        const savedAttendance = await attendance.save();
        return res.status(200).json({ message: "Clock-in successful.", data: savedAttendance });
    } catch (error) {
        return res.status(500).json({ message: "Error during clock-in.", error: error.message });
    }
};

// Clock Out
exports.clockOut = async (req, res) => {
    try {
        const { employee_id } = req.body;

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Find the attendance record for today
        const attendance = await Attendance.findOne({
            employee_id,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        if (!attendance) {
            return res.status(404).json({ message: "No attendance record found for today." });
        }

        if (attendance.check_out) {
            return res.status(400).json({ message: "Already clocked out today." });
        }

        // Update the attendance record with clock-out time
        attendance.check_out = new Date();
        const updatedAttendance = await attendance.save();

        return res.status(200).json({ message: "Clock-out successful.", data: updatedAttendance });
    } catch (error) {
        return res.status(500).json({ message: "Error during clock-out.", error: error.message });
    }
};

// Get All Attendance Records
// exports.getAllAttendance = async (req, res) => {
//     try {
//         const attendanceRecords = await Attendance.find().sort({ date: -1 });
//         return res.status(200).json({ data: attendanceRecords });
//     } catch (error) {
//         return res.status(500).json({ message: "Error fetching all attendance records.", error: error.message });
//     }
// };

// Get All Attendance Records with Department and Employee Details
exports.getAllAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find()
            .populate('employee_id', 'name position department_id') // Populate Employee details
            .populate({
                path: 'employee_id', // Access nested department data
                populate: {
                    path: 'department_id',
                    select: 'name location', // Include Department details
                },
            })
            .sort({ date: -1 }); // Sort by date descending

        return res.status(200).json({ data: attendanceRecords });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching all attendance records.", error: error.message });
    }
};


// Get Attendance by Employee ID
exports.getAttendanceByEmployee = async (req, res) => {
    try {
        const { employee_id } = req.params;

        const attendanceRecords = await Attendance.find({ employee_id }).sort({ date: -1 });
        return res.status(200).json({ data: attendanceRecords });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching attendance records.", error: error.message });
    }
};

// Add or Update Attendance Record
exports.addOrUpdateAttendance = async (req, res) => {
    try {
        const { employee_id, date, status } = req.body;

        const attendance = await Attendance.findOneAndUpdate(
            { employee_id, date: new Date(date) },
            { $set: { status } },
            { new: true, upsert: true }
        );

        return res.status(200).json({ message: "Attendance record saved successfully.", data: attendance });
    } catch (error) {
        return res.status(500).json({ message: "Error saving attendance record.", error: error.message });
    }
};

// Delete Attendance Record
exports.deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRecord = await Attendance.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ message: "Attendance record not found." });
        }

        return res.status(200).json({ message: "Attendance record deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting attendance record.", error: error.message });
    }
};
