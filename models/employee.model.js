const mongoose=require('mongoose');
const ROLES = require('../constant/role.constant');
const bcrypt = require('bcryptjs');
const Counter=require('../models/counter.model');

const employeeSchema=mongoose.Schema({
    employeeId:{
        type:String,
        unique:true,
        trim:true,
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    role:{
        type:String,
        enum:Object.values(ROLES),
        default:ROLES.EMPLOYEE,
    },
    department:{
       type:String,
       required:true,
       trim:true,
    },
    leaveBalance:{
        type:Number,
        default:12,
        min:0,
    },
    isActive:{
        type:Boolean,
        default:true,
    },

},{timestamps:true});

employeeSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

employeeSchema.methods.comparePassword=async function (candidatepassword){
    return await bcrypt.compare(candidatepassword,this.password);
}

employeeSchema.pre("save", async function () {
    if (!this.isNew) {
        return;
    }
    const counterName =this.role === ROLES.MANAGER?"managerId":"employeeId";

    const counter = await Counter.findOneAndUpdate(
        { name: counterName },
        { $inc: { sequenceValue: 1 } },
        {
            new: true,
            upsert: true,
        }
    );

    const prefix = this.role === ROLES.MANAGER?"M":"E";
    this.employeeId = `${prefix}${counter.sequenceValue.toString().padStart(3, "0")}`;

});
module.exports=mongoose.model("Employee",employeeSchema);