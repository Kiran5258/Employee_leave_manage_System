const LeaveRequest = require('../models/leaveRequest.model');
const Employee = require('../models/employee.model');
const AppError = require('../utils/AppError');
const STATUS = require('../constant/status.constant');
const leaveRequestModel = require('../models/leaveRequest.model');
exports.getAllLeaves = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.leaveType) {
            filter.leaveType = req.query.leaveType;
        }
        const leaves = await LeaveRequest.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    }
    catch (err) {
        next(err);
    }
}

exports.approveLeave = async (req, res, next) => {
    try {
        const leavePermission = await LeaveRequest.findById(req.params.id);
        if (!leavePermission) {
            return next(new AppError("Leave request not found", 404));
        }
        if (leavePermission.status !== STATUS.PENDING) {
            return next(new AppError("Already processed", 400));
        }
        const employee = await Employee.findById(leavePermission.employee);
        if (!employee) {
            return next(new AppError("Employee not found", 404));
        }
        if (employee.leaveBalance < leavePermission.numberOfDays) {
            return next(new AppError("Insufficient leave balance", 400));
        }

        employee.leaveBalance -= leavePermission.numberOfDays;
        leavePermission.status = STATUS.APPROVED;
        leavePermission.approvedBy = req.employee._id;
        leavePermission.approvedAt = new Date();

        await employee.save();
        await leavePermission.save();

        return res.status(200).json({
            success: true,
            message: "Leave approved successfully",
        });

    } catch (err) {
        next(err);
    }
};
exports.rejectLeave = async (req, res, next) => {
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id);
        if (!leaveRequest) {
            return next(
                new AppError("Leave request not found", 404)
            );
        }
        if (leaveRequest.status !== STATUS.PENDING) {
            return next(
                new AppError("Already processed", 400)
            );
        }
        leaveRequest.status = STATUS.REJECTED;
        leaveRequest.managerRemarks = req.body.managerRemarks || null;
        leaveRequest.approvedBy = req.employee._id;
        leaveRequest.approvedAt = new Date();

        await leaveRequest.save();

        return res.status(200).json({
            success: true,
            message: "Leave rejected successfully",
            data: leaveRequest,
        });

    } catch (err) {
        next(err);
    }
};