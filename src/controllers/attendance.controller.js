import Attendance from "../models/attendance.model.js";

const getStartOfDay = (date = new Date()) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
};

const getEndOfDay = (date = new Date()) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
};

export const checkIn = async (req, res) => {
    try {
        const staffId = req.user.id;
        const now = new Date();
        const startOfDay = getStartOfDay(now);
        const endOfDay = getEndOfDay(now);

        const existingAttendance = await Attendance.findOne({
            staffId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: "Check-in already recorded for today" });
        }

        const attendance = await Attendance.create({
            staffId,
            date: startOfDay,
            checkInTime: now,
            status: "Present"
        });

        return res.status(201).json({
            message: "Check-in recorded successfully",
            attendance
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const checkOut = async (req, res) => {
    try {
        const staffId = req.user.id;
        const now = new Date();
        const startOfDay = getStartOfDay(now);
        const endOfDay = getEndOfDay(now);

        const attendance = await Attendance.findOne({
            staffId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (!attendance) {
            return res.status(404).json({ message: "No check-in record found for today" });
        }

        if (attendance.checkOutTime) {
            return res.status(400).json({ message: "Check-out already recorded for today" });
        }

        attendance.checkOutTime = now;

        const workedMs = attendance.checkOutTime.getTime() - attendance.checkInTime.getTime();
        const workedHours = workedMs / (1000 * 60 * 60);
        attendance.status = workedHours < 4 ? "Half-Day" : "Present";

        await attendance.save();

        return res.status(200).json({
            message: "Check-out recorded successfully",
            attendance
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllStaffAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find()
            .populate("staffId", "name email")
            .sort({ date: -1, createdAt: -1 });

        return res.status(200).json({
            count: attendanceRecords.length,
            attendanceRecords
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
