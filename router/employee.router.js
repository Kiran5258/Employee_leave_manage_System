const express=require('express');
const { register, login, createLeaveRequest, getLeaveRequest } = require('../controller/employee.controller');
const { protect } = require('../middleware/employee.middleware');
const router=express.Router();

router.post('/register',register);
router.post("/login",login);
router.post("/leaves",protect,createLeaveRequest);
router.get("/leaves/my",protect,getLeaveRequest);

module.exports=router;