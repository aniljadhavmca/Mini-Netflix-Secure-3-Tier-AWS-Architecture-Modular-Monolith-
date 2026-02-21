# 🎬 Mini Netflix – Production-Style Modular Monolith on AWS

A Netflix-inspired video streaming application built using a Modular Monolith backend
and secure AWS 3-Tier Architecture.

---

## 🏗 Architecture

User
 ↓
Application Load Balancer (Public Subnet)
 ↓
Frontend EC2 (Private - Nginx + React)
 ↓
Backend EC2 (Private - Node.js API)
 ↓
Amazon RDS (Primary + Read Replica)
 ↓
Amazon S3 (Private Bucket)

---

## 🔐 Security

- Only ALB is public
- EC2 instances are private
- RDS in private subnet
- S3 bucket blocks public access
- JWT authentication
- Signed URL streaming
- IAM role for S3 access

---

## 🚀 Features

- User Registration & Login
- JWT Authentication
- Netflix-style UI
- Movie grid with hover
- Secure streaming via S3 signed URL
- Health endpoint
- Modular backend structure

---

## 🛠 Tech Stack

Frontend:
- React
- Axios
- React Router
- Custom CSS

Backend:
- Node.js
- Express
- MySQL2
- JWT
- Bcrypt
- AWS SDK

Database:
- Amazon RDS MySQL
- Read Replica

Storage:
- Amazon S3

---

## 📂 Project Structure

mininetflix-complete-with-readme/
 ├── backend/
 └── frontend/

---

## 🗄 Database Schema

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

---

## ⚙️ Backend Setup

cd backend
npm install

Create .env:

DB_PRIMARY_HOST=
DB_REPLICA_HOST=
DB_USER=
DB_PASS=
DB_NAME=mininetflix
JWT_SECRET=supersecretkey
AWS_REGION=ap-south-1
S3_BUCKET=
PORT=4000

npm start

---

## 🎨 Frontend Setup

cd frontend
npm install
npm run build

Copy build to nginx:

sudo rm -rf /usr/share/nginx/html/*
sudo cp -r build/* /usr/share/nginx/html/
sudo systemctl restart nginx

---

## 🌐 ALB Routing

/api/*  → Backend
/*      → Frontend

---

## 🔒 Security Groups

Backend SG:
Allow 4000 from ALB SG

RDS SG:
Allow 3306 from Backend SG

---

## 👨‍💻 Author

Anil Jadhav
AWS | DevOps | Full Stack Developer