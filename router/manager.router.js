const express=require('express');
const authorize = require('../middleware/authorize.middleware');
const { getAllLeaves, approveLeave, rejectLeave } = require('../controller/manager.controller');
const { protect } = require('../middleware/employee.middleware');
const ROLES = require('../constant/role.constant');
const validateObjectId = require('../middleware/ValidateObjectId');
const router=express.Router();

router.get("/leaves",protect,authorize(ROLES.MANAGER),getAllLeaves);
router.put("/leaves/:id/approve",protect,authorize(ROLES.MANAGER),validateObjectId(),approveLeave);
router.put("/leaves/:id/reject",protect,authorize(ROLES.MANAGER),validateObjectId(),rejectLeave);

module.exports=router;