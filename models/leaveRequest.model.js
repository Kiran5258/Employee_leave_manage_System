const mongoose = require('mongoose');
const STATUS = require('../constant/status.constant');

const leaveRequestSchema = mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    leaveType: {
        type: String,
        required: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        validate:{
            validator:function(value){
                return value>=this.startDate;
            },
            message:"Invalidate end date",
        }
    },
    numberOfDays: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(STATUS),
        default: STATUS.PENDING,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default:null,
    },
    managerRemarks: {
        type: String,
        trim: true,
        default: null,
    },
    approvedAt: {
        type: Date,
        default: null,
    },

}, { timestamps: true });

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);