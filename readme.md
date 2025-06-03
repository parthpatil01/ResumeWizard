# ResumeWizard

ResumeWizard is an AI-powered platform that analyzes job descriptions (JD) and resumes to help job seekers and recruiters optimize their application process. It provides similarity scores, highlights missing keywords, and offers actionable AI-driven suggestions to improve resume-job fit.

![Web view](https://i.imgur.com/Dn5fTzd.jpeg)
![Web view](https://i.imgur.com/U6v1Hfz.jpeg)
---

### Key Features

- **AI Resume Analysis:** Compares resumes and job descriptions, calculates similarity scores, and identifies missing keywords.
- **AI Suggestions:** Provides tailored recommendations to improve resume alignment with job requirements.
- **Local LLM (Large Language Model) in Cloud:**  
  The backend runs a local LLM instance on cloud-hosted EC2 instances, ensuring data privacy and fast, secure AI-powered analysis without relying on third-party APIs.
- **Web Interface:** User-friendly frontend for uploading resumes and JDs, and viewing results.
- **Scalable Cloud Infrastructure:** Built on AWS using Terraform for automated provisioning, high availability, and monitoring.

---

## Architecture Diagram
![ResumeWizard Architecture](https://i.imgur.com/04LpN1Y.png)
---

## Infrastructure Overview

- **VPC** with public and private subnets across two Availability Zones
- **Internet Gateway** and **NAT Gateways** for secure internet access
- **Security Groups** for frontend and backend, with least-privilege rules
- **Application Load Balancers (ALB)** for frontend (public) and backend (internal)
- **Launch Templates** for EC2 instances (frontend and backend)
- **Auto Scaling Groups** for both frontend and backend, with scaling policies
- **CloudWatch Alarms** for CPU utilization (auto scale up/down)
- **CloudWatch Dashboard** for monitoring EC2 and ALB metrics
- **Outputs** for key resources (VPC, ALBs, subnets, dashboard URL)

---

## Directory Structure

```
ResumeWizard/
├── Terraform/
│   ├── terraform.tf
│   ├── user_data.sh
│   ├── user_data_frontend.sh
│   └── ...
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── ...
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   └── ...
└── ...
```

---

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) >= 1.0
- AWS CLI configured with appropriate credentials
- An existing AWS EC2 Key Pair (default: `resumewiz`, configurable via `key_pair_resume_wizard` variable)
- Docker images for frontend/backend (see `user_data_frontend.sh` and backend setup)

---

## Usage

1. **Initialize Terraform:**
   ```sh
   cd Terraform
   terraform init
   ```

2. **Review and apply the plan:**
   ```sh
   terraform plan
   terraform apply
   ```

3. **Outputs:**
   - **Frontend ALB DNS:** Public endpoint for the web app
   - **Backend ALB DNS:** Internal endpoint for backend services
   - **CloudWatch Dashboard URL:** Monitoring dashboard

---

## Customization

- **Region:** Change `aws_region` variable (default: `us-west-2`)
- **Instance Types:** Edit `instance_type` in launch templates
- **Scaling:** Adjust `min_size`, `max_size`, and `desired_capacity` in ASGs
- **Key Pair:** Set `key_pair_resume_wizard` variable to your EC2 key pair name

---

## Security

- **Frontend EC2:** Accessible via ALB (HTTP/HTTPS) and SSH (port 22)
- **Backend EC2:** Accessible only from backend ALB and SSH from within VPC
- **NAT Gateway:** Private subnets access the internet securely

---

## Monitoring

- **CloudWatch Alarms:** Auto scaling based on CPU utilization
- **CloudWatch Dashboard:** Visualizes EC2 and ALB metrics

---

## Clean Up

To destroy all resources:

```sh
terraform destroy
```

---

## Notes

- Ensure your AWS account has sufficient quotas for EC2, ALB, EIP, and NAT Gateway resources.
- Backend and frontend user data scripts should be present in the `Terraform/` directory.
- The backend EC2 instances are provisioned with the contents of `../backend/app.py` and `../backend/requirements.txt`.

---

## License

MIT 

---

**Author:** Parth Patil  
**Project:** ResumeWizard  
**Cloud:** AWS  
**IaC:** Terraform
**AI:** Python, Local LLM