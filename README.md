# Employee Leave Management System

## Overview

The Employee Leave Management System is a RESTful backend application that allows employees to apply for leave and managers to review, approve, or reject leave requests.

The system implements role-based access control using JWT authentication and maintains employee leave balances.

---

## Features

### Employee Features

* Employee Registration
* Employee Login
* Apply for Leave
* View Personal Leave Requests

### Manager Features

* View All Leave Requests
* Approve Leave Requests
* Reject Leave Requests with Remarks

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv


## Environment Variables

Create a `.env` file in the project root.

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee_leave_system
JWT_SECRET=your_secret_key
```

---

## Installation

Clone the repository and install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

The server will run at:

```
http://localhost:5000
```

# Author

Kiran Kumar

Employee Leave Management System developed using Node.js, Express.js, and MongoDB.
