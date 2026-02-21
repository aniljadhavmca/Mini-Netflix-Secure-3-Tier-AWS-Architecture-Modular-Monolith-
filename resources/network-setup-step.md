# 🚀 Mini Netflix – Complete AWS Deployment Guide
## Production-Grade 3-Tier Architecture (us-east-1)

This guide explains how to deploy the Mini Netflix application in AWS using a secure, production-style 3-tier architecture in:

Region: us-east-1 (N. Virginia)

---

# 🏗 Final Architecture Overview

Internet
↓
Application Load Balancer (Public Subnets)
↓
Frontend EC2 (Private Subnet – Uses NAT for internet access)
↓
Backend EC2 (Private Subnet – Uses NAT for internet access)
↓
RDS (Primary + Read Replica – Private DB Subnets)
↓
S3 (Private Bucket)

Public Subnet contains:
- Application Load Balancer
- NAT Gateway
- Bastion Host

---

# 🟢 PHASE 1 — VPC SETUP (us-east-1)

## 1️⃣ Create VPC

VPC → Create VPC

- Name: mininetflix-vpc
- IPv4 CIDR: 10.0.0.0/16
- Tenancy: Default
- Region: us-east-1

---

## 2️⃣ Create Subnets

Create 4 subnets:

### Public Subnet A
- Name: public-subnet-a
- AZ: us-east-1a
- CIDR: 10.0.1.0/24
- Auto-assign Public IP: Enabled

### Public Subnet B
- Name: public-subnet-b
- AZ: us-east-1b
- CIDR: 10.0.2.0/24
- Auto-assign Public IP: Enabled

### Private Subnet A
- Name: private-subnet-a
- AZ: us-east-1a
- CIDR: 10.0.3.0/24
- No public IP

### Private Subnet B
- Name: private-subnet-b
- AZ: us-east-1b
- CIDR: 10.0.4.0/24
- No public IP

---

## 3️⃣ Create Internet Gateway

VPC → Internet Gateway → Create

- Name: mininetflix-igw
- Attach to mininetflix-vpc

---

## 4️⃣ Route Tables

### Public Route Table

Add route:
Destination: 0.0.0.0/0
Target: Internet Gateway

Associate:
- Public Subnet A
- Public Subnet B

---

### Private Route Table

Associate:
- Private Subnet A
- Private Subnet B

(Internet route will be added via NAT Gateway in next phase.)

---

# 🟢 PHASE 2 — NAT GATEWAY (Required for BOTH Frontend & Backend)

Since Frontend and Backend EC2 are private, they need internet access to:

- Run npm install
- Run git clone
- Install packages
- Access external APIs
- Download updates

Without NAT → these commands will fail.

---

## 1️⃣ Allocate Elastic IP

EC2 → Elastic IP → Allocate new Elastic IP

---

## 2️⃣ Create NAT Gateway

VPC → NAT Gateway → Create

- Subnet: Public Subnet A
- Elastic IP: Select allocated IP
- Name: mininetflix-nat

Wait until status = Available.

---

## 3️⃣ Update Private Route Table

Add route:

Destination: 0.0.0.0/0
Target: NAT Gateway

Now BOTH:

- Frontend EC2
- Backend EC2

can access the internet securely via NAT.

---

# 🟢 PHASE 3 — RDS SETUP

## 1️⃣ Create DB Subnet Group

RDS → Subnet Groups → Create

- Name: mininetflix-db-subnet
- VPC: mininetflix-vpc
- Select:
  - private-subnet-a
  - private-subnet-b

---

## 2️⃣ Create RDS Primary

RDS → Create Database

- Engine: MySQL 8
- Template: Production
- DB identifier: mininetflix-db
- Master username: admin
- Public access: NO
- VPC: mininetflix-vpc
- Subnet group: mininetflix-db-subnet
- Multi-AZ: Optional

---

## 3️⃣ Create Read Replica

After primary is available:

- Select primary DB
- Click Create Read Replica
- Same VPC and subnet group

---

# 🟢 PHASE 4 — S3 SETUP

Create S3 bucket:

- Name: mininetflix-videos
- Region: us-east-1
- Block all public access: Enabled

Upload your dummy videos.

---

# 🟢 PHASE 5 — SECURITY GROUPS

## ALB Security Group

Inbound:
- HTTP (80) from 0.0.0.0/0

Outbound:
- Allow All

---

## Bastion Host Security Group

Inbound:
- SSH (22) from YOUR public IP only

Outbound:
- Allow All

---

## Frontend EC2 Security Group

Inbound:
- HTTP (80) from ALB SG
- SSH (22) from Bastion SG

Outbound:
- Allow All (required for NAT internet access)

---

## Backend EC2 Security Group

Inbound:
- Custom TCP 4000 from ALB SG
- SSH (22) from Bastion SG

Outbound:
- Allow All (required for NAT internet access)

---

## RDS Security Group

Inbound:
- MySQL 3306 from Backend SG

Outbound:
- Default

---

# 🟢 PHASE 6 — BASTION HOST

Bastion is used to SSH into private EC2 instances.

---

## Launch Bastion EC2

- Subnet: Public Subnet A
- Auto-assign Public IP: YES
- Security Group: Bastion SG
- Key pair: Create or select existing

---

## SSH into Bastion

```
ssh -i key.pem ec2-user@Bastion-Public-IP
```

---

## SSH into Backend from Bastion

```
ssh -i key.pem ec2-user@Private-Backend-IP
```

Same for frontend EC2.

---

# 🟢 PHASE 7 — EC2 INSTANCES

## Backend EC2

- Private Subnet B
- No public IP
- Attach Backend SG
- Attach IAM Role with S3 access

Install:

```
sudo yum update -y
sudo yum install nodejs -y
```

---

## Frontend EC2

- Private Subnet A
- No public IP
- Attach Frontend SG

Install:

```
sudo yum update -y
sudo yum install nginx -y
sudo systemctl start nginx
```

---

# 🟢 PHASE 8 — DEPLOY BACKEND

Inside backend folder:

```
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
AWS_REGION=us-east-1
S3_BUCKET=mininetflix-videos
PORT=4000
```

Start:

```
npm start
```

Test:

```
curl localhost:4000/health
```

---

# 🟢 PHASE 9 — DEPLOY FRONTEND

```
npm install
npm run build
sudo cp -r build/* /usr/share/nginx/html/
sudo systemctl restart nginx
```

---

# 🟢 PHASE 10 — APPLICATION LOAD BALANCER

Create ALB:

- Type: Application
- Scheme: Internet-facing
- Subnets: Public A & B
- Security Group: ALB SG

---

## Create Target Groups

Frontend TG:
- Instance
- Port: 80

Backend TG:
- Instance
- Port: 4000

---

## Configure Listener Rules

HTTP 80:

Rule 1:
Path: /api/*
Forward to Backend TG

Default:
Forward to Frontend TG

---

# 🔄 Complete Request Flow

User
↓
ALB
↓
Frontend EC2
↓
ALB rule (/api/*)
↓
Backend EC2
↓
RDS
↓
S3 Signed URL
↓
Video Streaming

---

# 💰 Cost Note

NAT Gateway costs around $30/month minimum.

For temporary learning, you may assign public IP to EC2 instead of NAT.
For production, NAT is the correct architecture.

---

# 👨‍💻 Author

Anil Jadhav  
AWS | DevOps | Full Stack Developer  