const express = require('express');
const app = express();
const dbConnect = require('./config/db');
const cors=require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const employeeRouter=require("./router/employee.router");
const managerRouter=require('./router/manager.router');

app.use(cors());
app.use(express.json());

//Connect Database
dbConnect();


app.get("/", (req, res) => {
    res.send("Server Running");
})

app.use("/api",employeeRouter);
app.use("/api/manager",managerRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})