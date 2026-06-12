const mongoose=require('mongoose');


const validateObjectId=(ParamName='id')=>{
    return (req,res,next)=>{
        const id=req.params[ParamName];
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:`Invalid ${ParamName}`
            })
        }
        next();
    }
}

module.exports=validateObjectId;