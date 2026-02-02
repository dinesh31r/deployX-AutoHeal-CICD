# 🚀 deployX AutoHeal CI/CD - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Folder Structure](#3-folder-structure)
4. [Prerequisites](#4-prerequisites)
5. [Setup Instructions](#5-setup-instructions)
6. [Module Explanations](#6-module-explanations)
7. [How Each Feature Works](#7-how-each-feature-works)
8. [API Endpoints](#8-api-endpoints)
9. [Configuration Files](#9-configuration-files)
10. [Troubleshooting](#10-troubleshooting)
11. [Demo Script](#11-demo-script)

---

## 1. Project Overview

### What is deployX AutoHeal CI/CD?

**deployX** is a DevOps Control Hub - a web-based dashboard that lets you manage:
- 🐳 **Docker** - Build and manage container images
- ☸️ **Kubernetes** - Deploy and manage pods
- 📦 **Ansible** - Automate deployments
- 🔄 **CI/CD** - Trigger GitHub Actions pipelines

### Why "AutoHeal"?

The **Auto-Heal** feature automatically detects and removes failed Kubernetes pods (like those with `ErrImagePull` or `ImagePullBackOff` status), keeping your cluster healthy.

### Key Features

| Feature | Description |
|---------|-------------|
| Docker Image Builder | Build images with one click |
| Kubernetes Deployment | Deploy images to K8s cluster |
| Auto-Heal | Automatically clean failed pods |
| CI/CD Integration | Trigger GitHub Actions from dashboard |
| Audit Logs | Track all operations |
| Admin Panel | View and manage system logs |

---

## 2. Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER'S BROWSER                                  │
│                         http://localhost:3000                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP Requests
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND SERVER (Node.js)                            │
│                         http://localhost:5000                                │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Docker    │  │ Kubernetes  │  │   Ansible   │  │   GitHub    │        │
│  │   Routes    │  │   Routes    │  │   Routes    │  │   Routes    │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │                │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐
│    Minikube     │ │   Minikube  │ │   Local     │ │     GitHub Actions      │
│     Docker      │ │  Kubernetes │ │  Ansible    │ │        (Cloud)          │
└─────────────────┘ └─────────────┘ └─────────────┘ └─────────────────────────┘
                                                              │
                                                              ▼
                                                    ┌─────────────────────┐
                                                    │     Docker Hub      │
                                                    │  (Public Registry)  │
                                                    └─────────────────────┘
```

### What Runs Where?

| Component | Location | Description |
|-----------|----------|-------------|
| Frontend | Local (Browser) | User interface at port 3000 |
| Backend | Local (Node.js) | API server at port 5000 |
| Docker | Local (Minikube) | Container runtime |
| Kubernetes | Local (Minikube) | Container orchestration |
| Ansible | Local | Configuration management |
| GitHub Actions | Cloud | CI/CD pipeline execution |
| Docker Hub | Cloud | Image registry |

---

## 3. Folder Structure

```
deployX-AutoHeal-CICD/
│
├── .github/
│   └── workflows/
│       └── deployx-cicd.yml      # GitHub Actions workflow
│
├── base-pipeline/
│   ├── ansible/
│   │   ├── deploy.yml            # Ansible playbook
│   │   └── inventory             # Target hosts
│   ├── docker/
│   │   └── Dockerfile            # Docker image definition
│   ├── k8s/
│   │   ├── deployment.yaml       # Kubernetes deployment
│   │   └── service.yaml          # Kubernetes service
│   └── website/
│       ├── index.html            # Website content
│       └── style.css             # Website styles
│
├── control-hub/
│   ├── backend/
│   │   ├── server.js             # Main server file
│   │   ├── package.json          # Node.js dependencies
│   │   ├── .env                  # Environment variables (secrets)
│   │   ├── .env.example          # Environment template
│   │   ├── db/
│   │   │   └── database.js       # SQLite database setup
│   │   ├── middleware/
│   │   │   └── adminAuth.js      # Admin authentication
│   │   ├── routes/
│   │   │   ├── docker.routes.js  # Docker API endpoints
│   │   │   ├── k8s.routes.js     # Kubernetes API endpoints
│   │   │   ├── ansible.routes.js # Ansible API endpoints
│   │   │   ├── github.routes.js  # GitHub API endpoints
│   │   │   └── admin/
│   │   │       └── admin.routes.js # Admin API endpoints
│   │   └── services/
│   │       └── logger.service.js # Logging service
│   │
│   └── frontend/
│       ├── index.html            # Main dashboard HTML
│       ├── css/
│       │   └── style.css         # Dashboard styles
│       └── js/
│           └── app.js            # Dashboard JavaScript
│
├── README.md                     # Project readme
└── WORKING.md                    # This file
```

---

## 4. Prerequisites

### Required Software

| Software | Version | Purpose | Install Command |
|----------|---------|---------|-----------------|
| Node.js | 18+ | Backend server | `sudo apt install nodejs` |
| npm | 9+ | Package manager | Comes with Node.js |
| Docker | 20+ | Container runtime | `sudo apt install docker.io` |
| Minikube | Latest | Local Kubernetes | `sudo snap install minikube` |
| kubectl | Latest | K8s CLI | Comes with Minikube |
| Ansible | 2.9+ | Automation | `sudo apt install ansible` |
| Git | Latest | Version control | `sudo apt install git` |

### Required Accounts

| Account | Purpose | URL |
|---------|---------|-----|
| GitHub | Repository & Actions | https://github.com |
| Docker Hub | Image registry | https://hub.docker.com |

---

## 5. Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/dinesh31r/deployX-AutoHeal-CICD.git
cd deployX-AutoHeal-CICD
```

### Step 2: Start Minikube

```bash
minikube start
```

### Step 3: Install Backend Dependencies

```bash
cd control-hub/backend
npm install
```

### Step 4: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit with your values
nano .env
```

**Required .env values:**
```
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPO=deployX-AutoHeal-CICD
GITHUB_WORKFLOW=deployx-cicd.yml
ADMIN_KEY=your_admin_password
```

### Step 5: Add GitHub Secrets (for CI/CD)

Go to: `https://github.com/YOUR_USERNAME/deployX-AutoHeal-CICD/settings/secrets/actions`

Add:
- `DOCKER_PASSWORD` - Your Docker Hub access token

### Step 6: Start the Backend Server

```bash
cd control-hub/backend
node server.js
```

### Step 7: Open the Dashboard

Open in browser: `http://localhost:3000`

---

## 6. Module Explanations

### 🐳 Docker Module

**Purpose:** Build and manage Docker images

**How it works:**
1. Uses a pre-defined Dockerfile at `base-pipeline/docker/Dockerfile`
2. Builds images inside Minikube's Docker (so K8s can access them)
3. Lists all images available in Minikube

**Dockerfile explained:**
```dockerfile
# Use nginx as base image
FROM nginx:alpine

# Copy website files to nginx's web directory
COPY website /usr/share/nginx/html

# Health check - ensures container is healthy
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost || exit 1

# Expose port 80 for web traffic
EXPOSE 80
```

**Commands executed:**
```bash
# Build Image
eval $(minikube docker-env) && docker build -t imagename:tag -f Dockerfile .

# List Images
eval $(minikube docker-env) && docker images --format "{{json .}}"

# Prune Images
docker image prune -f
```

---

### ☸️ Kubernetes Module

**Purpose:** Deploy and manage containers in Kubernetes

**How it works:**
1. Takes a Docker image and creates a Kubernetes Deployment
2. Deployment ensures the container runs and restarts if it crashes
3. Lists all pods and their status

**Deployment created:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-name
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-name
  template:
    metadata:
      labels:
        app: app-name
    spec:
      containers:
      - name: app-name
        image: your-image:tag
        imagePullPolicy: Never  # Use local image
```

**Commands executed:**
```bash
# List Pods
minikube kubectl -- get pods --no-headers

# Delete Pod/Deployment
minikube kubectl -- delete deployment deployment-name

# Deploy Image
minikube kubectl -- apply -f deployment.yaml
```

**Pod Statuses Explained:**
| Status | Meaning |
|--------|---------|
| Running | Container is working ✅ |
| Pending | Waiting to start |
| ContainerCreating | Starting up |
| ErrImagePull | Can't download image ❌ |
| ImagePullBackOff | Retrying image download ❌ |
| ErrImageNeverPull | Local image not found ❌ |
| CrashLoopBackOff | Container keeps crashing ❌ |

---

### 🧠 Auto-Heal Feature

**Purpose:** Automatically clean up failed pods

**How it works:**
1. Scans all pods for failure statuses
2. Identifies pods with: `ImagePullBackOff`, `ErrImagePull`, `ErrImageNeverPull`
3. Extracts the parent Deployment name
4. Deletes the Deployment (which removes the pod permanently)

**Why delete Deployment, not Pod?**
- If you only delete the Pod, the Deployment recreates it
- Deleting the Deployment stops the respawn cycle

**Code flow:**
```
Click "Auto-Clean Failed Pods"
         │
         ▼
Find pods with failed status
         │
         ▼
Extract deployment names (remove -xxxxx-xxxxx suffix)
         │
         ▼
kubectl delete deployment <names>
         │
         ▼
Pods gone permanently ✅
```

---

### 📦 Ansible Module

**Purpose:** Automate full deployment process

**How it works:**
1. Reads playbook from `base-pipeline/ansible/deploy.yml`
2. Executes tasks in order:
   - Check Docker installation
   - Start Minikube
   - Build Docker image
   - Apply Kubernetes manifests
   - Restart deployment
   - Show running pods

**Playbook tasks:**
```yaml
tasks:
  - name: Check Docker installation
    command: docker --version

  - name: Start Minikube
    command: minikube start

  - name: Build Docker image
    command: docker build -t deployx:autoheal -f docker/Dockerfile .

  - name: Apply Kubernetes manifests
    command: kubectl apply -f k8s/

  - name: Restart deployment
    command: kubectl rollout restart deployment deployx-deployment

  - name: Show running pods
    command: kubectl get pods
```

**Inventory file:**
```ini
[local]
localhost ansible_connection=local
```

---

### 🔄 CI/CD Module

**Purpose:** Trigger GitHub Actions pipelines

**Two modes:**
| Mode | What it does |
|------|--------------|
| CI Only | Build & validate Docker image |
| CI + CD | Build, validate, and push to Docker Hub |

**How it works:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Click "CI + CD" in Dashboard                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Backend sends POST request to GitHub API               │
│                                                                  │
│  POST https://api.github.com/repos/OWNER/REPO/actions/          │
│       workflows/deployx-cicd.yml/dispatches                     │
│                                                                  │
│  Body: { ref: "main", inputs: { pipelineType: "CI_CD" } }       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: GitHub receives request and starts workflow            │
│                                                                  │
│  - Spins up fresh Ubuntu VM                                     │
│  - Clones your repository                                       │
│  - Runs CI job (build image)                                    │
│  - If CI_CD: runs CD job (push to Docker Hub)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Image pushed to Docker Hub                             │
│                                                                  │
│  docker.io/dinesh31r/deployx:latest                             │
│  Available worldwide! 🌍                                        │
└─────────────────────────────────────────────────────────────────┘
```

**GitHub Actions Workflow:**
```yaml
name: deployX CI/CD Pipeline

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      pipelineType:
        type: choice
        options:
          - CI_ONLY
          - CI_CD

jobs:
  ci:
    name: Continuous Integration
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: |
          cd base-pipeline
          docker build -t deployx:autoheal -f docker/Dockerfile .

  cd:
    name: Continuous Deployment
    needs: ci
    if: github.event.inputs.pipelineType == 'CI_CD'
    steps:
      - uses: actions/checkout@v4
      - name: Login to Docker Hub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "dinesh31r" --password-stdin
      - name: Build and Push
        run: |
          cd base-pipeline
          docker build -t dinesh31r/deployx:latest -f docker/Dockerfile .
          docker push dinesh31r/deployx:latest
```

---

### 🔐 Admin Panel

**Purpose:** View audit logs and system activity

**Features:**
- View all logs
- Filter by: Docker, Kubernetes, Ansible, GitHub
- View summary statistics
- Clear logs

**How authentication works:**
```javascript
// Admin must provide ADMIN_KEY from .env
if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

**Log format:**
```json
{
  "id": 1,
  "timestamp": "2026-02-02T20:00:00Z",
  "service": "docker",
  "action": "BUILD",
  "status": "SUCCESS",
  "details": "webapp:v1"
}
```

---

## 7. How Each Feature Works

### Build Image (Step by Step)

```
1. User clicks "Build Image"
2. Prompt appears: "Enter image name"
3. User enters: "webapp:v1"
4. Frontend sends POST /api/docker/build { imageName: "webapp:v1" }
5. Backend runs: eval $(minikube docker-env) && docker build -t webapp:v1 ...
6. Docker builds image using Dockerfile
7. Image stored in Minikube's Docker
8. Backend responds: { message: "Image built successfully" }
9. Frontend shows success message
10. Log entry created in database
```

### Deploy to Kubernetes (Step by Step)

```
1. User selects image from dropdown
2. User clicks "Deploy to Kubernetes"
3. Frontend sends POST /api/k8s/deploy { image: "webapp:v1" }
4. Backend creates Deployment YAML dynamically
5. Backend runs: kubectl apply -f -
6. Kubernetes creates Deployment and Pod
7. Pod starts running the container
8. Backend responds: { message: "Deployed successfully" }
9. Frontend shows success message
```

### Auto-Clean Failed Pods (Step by Step)

```
1. User clicks "Auto-Clean Failed Pods"
2. Frontend sends DELETE /api/k8s/cleanup-failed
3. Backend runs: kubectl get pods | grep "ErrImagePull|..."
4. Backend extracts pod names with failed status
5. Backend extracts deployment names from pod names
6. Backend runs: kubectl delete deployment <names>
7. Kubernetes removes deployments and pods
8. Backend responds: { message: "Failed pods deleted" }
```

### Trigger CI/CD (Step by Step)

```
1. User clicks "CI + CD"
2. Frontend sends POST /api/github/trigger { pipelineType: "CI_CD" }
3. Backend reads GITHUB_TOKEN from .env
4. Backend sends POST to GitHub API with workflow_dispatch event
5. GitHub receives event and starts workflow
6. GitHub spins up Ubuntu VM
7. VM clones repository
8. VM builds Docker image (CI)
9. VM pushes to Docker Hub (CD)
10. Workflow completes
11. Image available at: docker.io/dinesh31r/deployx:latest
```

---

## 8. API Endpoints

### Docker Routes (`/api/docker`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | /images | List all Docker images | - |
| POST | /build | Build new image | `{ imageName: "name:tag" }` |
| DELETE | /prune | Remove dangling images | - |

### Kubernetes Routes (`/api/k8s`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | /pods | List all pods | - |
| POST | /deploy | Deploy image to K8s | `{ image: "name:tag" }` |
| DELETE | /pods/:name | Delete pod/deployment | - |
| DELETE | /cleanup-failed | Auto-clean failed pods | - |

### Ansible Routes (`/api/ansible`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | /deploy | Run Ansible playbook | - |

### GitHub Routes (`/api/github`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | /trigger | Trigger GitHub Actions | `{ pipelineType: "CI_ONLY" \| "CI_CD" }` |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| GET | /logs | Get all logs | `x-admin-key: <key>` |
| GET | /logs/:service | Filter logs by service | `x-admin-key: <key>` |
| GET | /summary | Get log statistics | `x-admin-key: <key>` |
| DELETE | /logs | Clear all logs | `x-admin-key: <key>` |

---

## 9. Configuration Files

### .env (Backend Configuration)

```bash
# GitHub Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxx    # Personal access token
GITHUB_OWNER=dinesh31r           # GitHub username
GITHUB_REPO=deployX-AutoHeal-CICD
GITHUB_WORKFLOW=deployx-cicd.yml

# Admin Configuration
ADMIN_KEY=deployx-admin-123      # Admin panel password
```

### GitHub Secrets (Repository Settings)

| Secret Name | Value | Purpose |
|-------------|-------|---------|
| DOCKER_PASSWORD | dckr_pat_xxx... | Docker Hub access token |

### How to Get Tokens

**GitHub Token:**
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `workflow`
4. Copy token

**Docker Hub Token:**
1. Go to: https://hub.docker.com/settings/security
2. New Access Token
3. Permissions: Read, Write, Delete
4. Copy token

---

## 10. Troubleshooting

### Common Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| "Failed to load Docker images" | Backend not running | Start: `node server.js` |
| "No images found" | Wrong Docker context | Uses Minikube Docker, not host |
| Pod keeps respawning | Deleted pod, not deployment | Delete deployment instead |
| "ErrImageNeverPull" | Image not in Minikube | Build with `eval $(minikube docker-env)` |
| CI/CD fails "Username required" | Secret not set | Add DOCKER_PASSWORD to GitHub secrets |
| "Unauthorized" in Admin | Wrong admin key | Check ADMIN_KEY in .env |

### Useful Commands

```bash
# Check Minikube status
minikube status

# View Minikube Docker images
eval $(minikube docker-env) && docker images

# View all pods
minikube kubectl -- get pods

# View all deployments
minikube kubectl -- get deployments

# View pod logs
minikube kubectl -- logs <pod-name>

# Restart backend
cd control-hub/backend && node server.js

# Check backend logs
# (Logs appear in terminal where server.js runs)
```

---

## 11. Demo Script

### Quick Demo (5 minutes)

```
1. DOCKER
   - Click "List Images" → Show existing images
   - Click "Build Image" → Enter "demo:v1"
   - Click "List Images" → Show new image

2. KUBERNETES
   - Select "demo:v1" from dropdown
   - Click "Deploy to Kubernetes"
   - Click "List Pods" → Show running pod

3. AUTO-HEAL
   - Click "Deploy Custom Image" → Enter "fake:broken"
   - Click "List Pods" → Show failed pod (ErrImageNeverPull)
   - Click "Auto-Clean Failed Pods"
   - Click "List Pods" → Failed pod is gone!

4. CI/CD
   - Click "CI + CD"
   - Open GitHub Actions → Watch workflow run
   - Show Docker Hub → Image is pushed!

5. ADMIN
   - Click "Admin Panel"
   - Enter admin key
   - Click "All Logs" → Show audit history
```

---

## Summary

**deployX AutoHeal CI/CD** is a complete DevOps learning project that demonstrates:

✅ **Docker** - Containerization  
✅ **Kubernetes** - Container orchestration  
✅ **Ansible** - Configuration management  
✅ **GitHub Actions** - CI/CD pipelines  
✅ **Node.js** - Backend API development  
✅ **REST APIs** - Frontend-backend communication  
✅ **SQLite** - Database for audit logs  

All controlled from a single web dashboard! 🚀

---

**Created by:** Dinesh  
**Last Updated:** February 2, 2026  
**Repository:** https://github.com/dinesh31r/deployX-AutoHeal-CICD
