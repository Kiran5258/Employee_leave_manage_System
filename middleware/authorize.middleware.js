const AppError = require("../utils/AppError");

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.employee) {
            return next(new AppError("Authentication required", 401));
        }
        if (!roles.includes(req.employee.role)) {
            return next(new AppError("Access denied", 403));
        }
        next();
    };
};

module.exports = authorize;