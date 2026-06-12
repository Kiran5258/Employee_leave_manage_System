const AppError = require("../utils/AppError");
const Employee = require('../models/employee.model');
const LeaveRequest = require('../models/leaveRequest.model');
const jwt = require('jsonwebtoken');
const ROLES = require("../constant/role.constant");
const STATUS = require("../constant/status.constant");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

exports.register = async (req, res, next) => {
    const { name, email, password, department } = req.body;
    if (!name || !email || !password || !department) {
        return next(new AppError("All fields are required", 400));
    }
    try {
        const exisitingemployee = await Employee.findOne({ email });
        if (exisitingemployee) {
            return next(new AppError("Already registered", 409));
        }
        const employee = await Employee.create({
            name,
            email,
            password,
            role: ROLES.EMPLOYEE,
            department
        });

        res.status(201).json({
            employee,
            token: generateToken(employee._id)
        })

    }
    catch (err) {
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new AppError("Email and password are required", 400)
        );
    }

    try {
        const employee = await Employee.findOne({ email }).select("+password");
        if (!employee) {
            return next(new AppError("Invalid credentials", 401));
        }
        if (!employee.isActive) {
            return next(new AppError("Employee account is inactive", 401));
        }
        const isMatch = await employee.comparePassword(password);

        if (!isMatch) {
            return next(new AppError("Invalid credentials", 401));
        }
        employee.password = undefined;
        res.status(200).json({
            success: true,
            message: "Login successful",
            token: generateToken(employee._id),
            employee,
        })
    }
    catch (err) {
        next(err);
    }
}

exports.createLeaveRequest = async (req, res, next) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        if (!leaveType || !startDate || !endDate || !reason) {
            return next(new AppError("All fields required", 400));
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
            return next(new AppError("Invalidate date", 400));
        }
        const existingLeave = await LeaveRequest.findOne({
            employee: req.employee._id,
            status: { $in: [STATUS.PENDING, STATUS.APPROVED] },
            startDate: { $lte: end },
            endDate: { $gte: start },
        });
        if(existingLeave){
            return next(new AppError("You already have a leave request for the selected dates",400));
        }
        const diff = end - start;
        const numberOfDays = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

        if (numberOfDays > req.employee.leaveBalance) {
            return next(new AppError("Insufficient leave balance", 400));
        }

        const leaverequest = await LeaveRequest.create({
            employee: req.employee._id,
            leaveType,
            numberOfDays,
            startDate,
            endDate,
            reason,
        })
        return res.status(201).json({ message: "leave request created", leaverequest });

    } catch (err) {
        next(err);
    }
}

exports.getLeaveRequest = async (req, res, next) => {
    try {
        const id = req.employee._id;
        const leaves = await LeaveRequest.find({
            employee: id,
        }).sort({ createdAt: -1 });
        if (leaves.length <= 0) {
            return res.json({ message: "No leave data" });
        }
        return res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    }
    catch (err) {
        next(err);
    }
}