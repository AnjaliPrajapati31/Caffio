import mongoose from "mongoose";

const formatDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatTime = (value) => {
    if (!value) return null;
    return new Date(value).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
};

const attendanceSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: true
    },
    date: {
        type: Date, 
        required: true
    },
    checkInTime: {
        type: Date,
        required: true
    },
    checkOutTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Half-Day"],
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            ret.date = formatDate(ret.date);
            ret.checkInTime = formatTime(ret.checkInTime);
            ret.checkOutTime = formatTime(ret.checkOutTime);
            ret.createdAt = formatDate(ret.createdAt);
            ret.updatedAt = formatDate(ret.updatedAt);
            return ret;
        }
    },
    toObject: {
        transform: (_doc, ret) => {
            ret.date = formatDate(ret.date);
            ret.checkInTime = formatTime(ret.checkInTime);
            ret.checkOutTime = formatTime(ret.checkOutTime);
            ret.createdAt = formatDate(ret.createdAt);
            ret.updatedAt = formatDate(ret.updatedAt);
            return ret;
        }
    }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;