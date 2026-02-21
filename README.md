# 🎬 Mini Netflix – Secure 3-Tier AWS Architecture (Modular Monolith)

A production-style video streaming application built using a modular monolithic backend and secure AWS 3-tier architecture.

---

# 🏗 Architecture Overview

User
↓
Application Load Balancer (Public Subnet)
↓
Frontend EC2 (Private Subnet – Nginx + React Build)
↓
Backend EC2 (Private Subnet – Node.js Modular Monolith)
↓
Amazon RDS (Primary + Read Replica – Private Subnets)
↓
Amazon S3 (Private Bucket – Video Storage)

---

# 🔐 Security Design

* Only ALB is public.
* All EC2 instances are private (no public IP).
* RDS is private.
* S3 bucket blocks public access.
* Backend SG allows traffic only from ALB SG.
* RDS SG allows traffic only from Backend SG.
* JWT-based authentication.
* Video streaming via S3 Pre-Signed URL.

---

# 🚀 Features

* User Registration & Login
* JWT Authentication
* Role-based access (Admin/User)
* Movie listing
* Secure streaming
* RDS Read Replica support
* Clean modular backend architecture

---

# 🛠 Tech Stack

Frontend:

* React
* Axios
* React Router
* Nginx

Backend:

* Node.js
* Express
* MySQL2
* JWT
* AWS SDK

Database:

* Amazon RDS (MySQL 8)
* Read Replica

Storage:

* Amazon S3

Infrastructure:

* VPC (Public + Private Subnets)
* NAT Gateway
* ALB
* Security Groups

---

# 📂 Backend Structure

```
mininetflix-backend/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── s3.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │
│   │   ├── movies/
│   │   │   ├── movie.controller.js
│   │   │   ├── movie.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │
│   ├── app.js
│   └── server.js
│
├── package.json
└── .env
```

---

# 📂 Frontend Structure

```
mininetflix-frontend/
│
├── src/
│   ├── api/axios.js
│   ├── pages/Login.jsx
│   ├── pages/Home.jsx
│   ├── pages/Player.jsx
│   ├── App.jsx
│
├── package.json
```

---

# 🗄 Database Schema

```
CREATE DATABASE mininetflix;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin','user') DEFAULT 'user'
);

CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  video_key VARCHAR(255)
);
```

---

# 🌐 ALB Routing Rules

| Path   | Target       |
| ------ | ------------ |
| /api/* | Backend EC2  |
| /*     | Frontend EC2 |

---

# 👨‍💻 Author

Anil Jadhav
AWS | DevOps | Full Stack Developer
