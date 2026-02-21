# 🎬 Mini Netflix – S3 Video Upload Guide

This guide explains how to download sample videos and upload them to your private S3 bucket for secure streaming using Pre-Signed URLs.

---

# 📌 Bucket Information

Bucket Name:

mininetflix-videos

Folder Structure Used:

movies/

---

# ✅ Step 1 – SSH Into Backend EC2

From Bastion:

```bash
ssh ec2-user@<backend-private-ip>
```

---

# ✅ Step 2 – Create Videos Folder

```bash
mkdir videos
cd videos
```

---

# ✅ Step 3 – Download Sample Videos

```bash
wget https://samplelib.com/lib/preview/mp4/sample-5s.mp4
wget https://samplelib.com/lib/preview/mp4/sample-10s.mp4
wget https://samplelib.com/lib/preview/mp4/sample-15s.mp4
wget https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4
```

Verify:

```bash
ls -lh
```

---

# ✅ Step 4 – Upload Videos to S3

```bash
aws s3 cp sample-5s.mp4 s3://mininetflix-videos/movies/sample-5s.mp4
aws s3 cp sample-10s.mp4 s3://mininetflix-videos/movies/sample-10s.mp4
aws s3 cp sample-15s.mp4 s3://mininetflix-videos/movies/sample-15s.mp4
aws s3 cp BigBuckBunny_320x180.mp4 s3://mininetflix-videos/movies/bigbuckbunny.mp4
```

---

# ✅ Step 5 – Verify Upload

```bash
aws s3 ls s3://mininetflix-videos/movies/
```

You should see all uploaded files listed.

---

# 🔐 IAM Requirement

Backend EC2 must have an IAM role attached with:

Minimum permissions:

- s3:PutObject
- s3:GetObject

For development:

AmazonS3FullAccess

---

# ✅ Step 6 – Insert Records Into Database

Connect to MySQL:

```bash
mysql -h mininetflix-db.cm56g60cumd5.us-east-1.rds.amazonaws.com -u admin -p
```

Then run:

```sql
USE mininetflix;

INSERT INTO movies (title, description, video_key) VALUES
('Sample 5s', 'Short test clip', 'movies/sample-5s.mp4'),
('Sample 10s', 'Medium test clip', 'movies/sample-10s.mp4'),
('Sample 15s', 'Longer test clip', 'movies/sample-15s.mp4'),
('Big Buck Bunny', 'Open source animation clip', 'movies/bigbuckbunny.mp4');
```

Exit MySQL:

```bash
exit
```

---

# ✅ Step 7 – Test Backend API

On Backend EC2:

```bash
curl http://localhost:4000/api/movies
```

---

# ✅ Step 8 – Test Streaming Via ALB

Open in browser:

```
http://<ALB-DNS>/api/movies
```

Then test streaming endpoint:

```
http://<ALB-DNS>/api/movies/stream/1
```

If configured correctly:

- Backend generates Pre-Signed URL
- S3 remains private
- Video plays securely

---

# 🏗 Streaming Flow

User → ALB → Backend → Generate Pre-Signed URL → S3 → Video Playback

---

# 🚀 Best Practices

- Keep S3 bucket private
- Never expose public read access
- Store only S3 object key in database
- Use environment variables for AWS configuration
- Rotate credentials if exposed

---

# 🎉 Done!

Your Mini Netflix secure streaming setup is now ready.