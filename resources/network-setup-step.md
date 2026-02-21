# 🚀 Mini Netflix – Complete AWS Deployment Guide  
## (Production-Style 3-Tier Architecture Setup)

This document explains how to build and deploy the Mini Netflix application on AWS from scratch.

Architecture Overview:

Internet  
↓  
Application Load Balancer (Public Subnets)  
↓  
Frontend EC2 (Private Subnet)  
↓  
Backend EC2 (Private Subnet)  
↓  
RDS (Primary + Read Replica – Private DB Subnets)  
↓  
S3 (Private Bucket)  

---

# 🟢 PHASE 1 — VPC SETUP

## 1️⃣ Create VPC

Go to:  
AWS Console → VPC → Create VPC

- Name: `mininetflix-vpc`
- IPv4 CIDR: `10.0.0.0/16`
- Tenancy: Default

Click Create.

---

## 2️⃣ Create Subnets

Create 4 subnets:

### Public Subnet A
- Name: `public-subnet-a`
- AZ: ap-south-1a
- CIDR: `10.0.1.0/24`
- Enable Auto-assign Public IP

### Public Subnet B
- Name: `public-subnet-b`
- AZ: ap-south-1b
- CIDR: `10.0.2.0/24`
- Enable Auto-assign Public IP

### Private Subnet A
- Name: `private-subnet-a`
- AZ: ap-south-1a
- CIDR: `10.0.3.0/24`
- Disable Public IP

### Private Subnet B
- Name: `private-subnet-b`
- AZ: ap-south-1b
- CIDR: `10.0.4.0/24`
- Disable Public IP

---

## 3️⃣ Create Internet Gateway

VPC → Internet Gateway → Create

- Name: `mininetflix-igw`

Attach it to `mininetflix-vpc`.

---

## 4️⃣ Configure Route Tables

### Public Route Table

- Add route:
  - Destination: `0.0.0.0/0`
  - Target: Internet Gateway

Associate with:
- Public Subnet A
- Public Subnet B

### Private Route Table

No internet route required.

Associate with:
- Private Subnet A
- Private Subnet B

---

# 🟢 PHASE 2 — RDS SETUP

## 1️⃣ Create DB Subnet Group

RDS → Subnet Groups → Create

- Name: `mininetflix-db-subnet`
- VPC: `mininetflix-vpc`
- Select:
  - Private Subnet A
  - Private Subnet B

---

## 2️⃣ Create RDS Primary

RDS → Create Database

- Engine: MySQL 8
- Template: Production
- DB Identifier: `mininetflix-db`
- Username: admin
- Password: strong password
- VPC: mininetflix-vpc
- Subnet group: mininetflix-db-subnet
- Public access: NO
- Multi-AZ: Optional
- Storage: 20GB (minimum)

Create database.

---

## 3️⃣ Create Read Replica

After primary is available:

- Select primary DB
- Click Create Read Replica
- Same VPC
- Same subnet group

---

# 🟢 PHASE 3 — S3 SETUP

Create bucket:

- Name: `mininetflix-videos`
- Region: Same as VPC
- Block all public access: ENABLED

Upload dummy videos.

---

# 🟢 PHASE 4 — SECURITY GROUPS

## 1️⃣ ALB Security Group

Inbound:
- HTTP (80) from `0.0.0.0/0`

---

## 2️⃣ Frontend EC2 SG

Inbound:
- HTTP (80) from ALB Security Group

---

## 3️⃣ Backend EC2 SG

Inbound:
- Custom TCP 4000 from ALB Security Group

---

## 4️⃣ RDS Security Group

Inbound:
- MySQL 3306 from Backend Security Group

---

# 🟢 PHASE 5 — EC2 INSTANCES

## 1️⃣ Bastion Host (Optional but Recommended)

- Public Subnet
- Allow SSH from your IP

---

## 2️⃣ Frontend EC2

- Private Subnet A
- No public IP
- Attach Frontend SG

Install:

```bash
sudo yum update -y
sudo yum install nginx -y
sudo systemctl start nginx
```

---

## 3️⃣ Backend EC2

- Private Subnet B
- No public IP
- Attach Backend SG
- Attach IAM Role with S3 access

Install Node:

```bash
sudo yum install nodejs -y
```

---

# 🟢 PHASE 6 — DEPLOY BACKEND

Upload backend folder to EC2.

Inside backend folder:

```bash
npm install
nano .env
```

Add:

```
DB_PRIMARY_HOST=<primary-endpoint>
DB_REPLICA_HOST=<replica-endpoint>
DB_USER=admin
DB_PASS=password
DB_NAME=mininetflix

JWT_SECRET=supersecretkey
AWS_REGION=ap-south-1
S3_BUCKET=mininetflix-videos
PORT=4000
```

Start server:

```bash
npm start
```

Test:

```bash
curl localhost:4000/health
```

---

# 🟢 PHASE 7 — DEPLOY FRONTEND

On frontend EC2:

```bash
npm install
npm run build
sudo cp -r build/* /usr/share/nginx/html/
sudo systemctl restart nginx
```

---

# 🟢 PHASE 8 — APPLICATION LOAD BALANCER

Create ALB:

- Type: Application
- Scheme: Internet-facing
- Subnets: Public A + B
- Security Group: ALB SG

---

## Create Target Groups

### Frontend TG
- Instance
- Port: 80

### Backend TG
- Instance
- Port: 4000

---

## Configure Listener Rules

Listener: HTTP 80

Rule 1:
- Path: `/api/*`
- Forward to Backend TG

Default:
- Forward to Frontend TG

---

# 🟢 PHASE 9 — FINAL TEST

Open:

```
http://ALB-DNS
```

Test:

- Login
- Movie list
- Video streaming

---

# 🔁 Complete Request Flow

User → ALB → Frontend  
Frontend → ALB `/api/*` → Backend  
Backend → RDS (Read/Write)  
Backend → S3 (Signed URL)  
Video Plays Securely  

---

# 🏆 Production Improvements

- Auto Scaling Group
- HTTPS (ACM)
- CloudFront CDN
- Redis (ElastiCache)
- Secrets Manager
- NAT Gateway
- PM2
- CloudWatch Monitoring
- Docker & ECS Migration

---

# 👨‍💻 Author

Anil Jadhav  
AWS | DevOps | Full Stack Developer  