const mongoose=require('mongoose');

const dbConnect=async()=>{
    try{
        //DATABASE CONNECTION
        const db=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${db.connection.host}/${db.connection.name}`);
        return db;
    }
    catch(err){
        console.error("Database connection Failed:",err.message);
        process.exit(1);
    }
}

module.exports=dbConnect;