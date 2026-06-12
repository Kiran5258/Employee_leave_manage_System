const jwt = require('jsonwebtoken');
const Employee = require('../models/employee.model');
const AppError = require('../utils/AppError');

exports.protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new AppError("Not authorized", 401)
        )
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.employee = await Employee.findById(decoded.id).select("-password");
        if (!req.employee) {
            return next(new AppError("Employee Not found", 404));
        }
        if (!req.employee.isActive) {
            return next(new AppError("Employee account is inActive",401))
        }
        next();
    }
    catch (err) {
        next(err);
    }
}