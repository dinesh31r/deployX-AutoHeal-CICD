# 🚀 deployX – AutoHeal CI/CD Control Hub

deployX is a **full-stack DevOps Control Hub** that provides a **single dashboard** to manage:

- 🐳 Docker image builds
- ☸ Kubernetes deployments (Minikube)
- 🧠 Auto-healing for failed pods
- 📦 Ansible CD execution
- 🔁 GitHub CI / CI+CD triggers
- 📜 Centralized system logs
- 🟢 Pod health visualization

This project is designed for **learning, demos, and academic DevOps projects**.

---

## 📌 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | HTML, CSS, Vanilla JavaScript |
| **Backend** | Node.js + Express |
| **Database** | SQLite (for logs) |
| **Containerization** | Docker |
| **Orchestration** | Kubernetes (Minikube) |
| **CI/CD** | GitHub Actions |
| **Configuration Management** | Ansible |

---

## 📂 Project Structure

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
│   │   └── inventory             # Ansible inventory
│   ├── docker/
│   │   └── Dockerfile            # Docker build file
│   ├── k8s/
│   │   ├── deployment.yaml       # K8s deployment manifest
│   │   └── service.yaml          # K8s service manifest
│   └── website/
│       ├── index.html            # Sample website
│       └── style.css
│
├── control-hub/
│   ├── backend/
│   │   ├── db/
│   │   │   └── database.js       # SQLite database
│   │   ├── routes/
│   │   │   ├── docker.routes.js  # Docker API endpoints
│   │   │   ├── k8s.routes.js     # Kubernetes API endpoints
│   │   │   ├── github.routes.js  # GitHub Actions API
│   │   │   ├── ansible.routes.js # Ansible API endpoints
│   │   │   └── admin/
│   │   │       └── admin.routes.js
│   │   ├── services/
│   │   │   └── logger.service.js # Centralized logging
│   │   ├── middleware/
│   │   │   └── adminAuth.js      # Admin authentication
│   │   ├── server.js             # Express server
│   │   ├── package.json
│   │   └── .env                  # Environment variables
│   │
│   └── frontend/
│       ├── index.html            # Dashboard UI
│       ├── css/
│       │   └── style.css         # Styles
│       └── js/
│           └── app.js            # Frontend logic
│
└── README.md
```

---

## ⚙️ Prerequisites

Make sure the following are installed:

```bash
# Check versions
node -v          # v18+ recommended
docker -v        # Docker 20+
kubectl version --client
minikube version # v1.30+
ansible --version
```

### Installation (Ubuntu/Debian)

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Docker
sudo apt install -y docker.io
sudo usermod -aG docker $USER

# Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# kubectl
sudo snap install kubectl --classic

# Ansible
sudo apt install -y ansible
```

---

## 🚀 Quick Start Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/deployX-AutoHeal-CICD.git
cd deployX-AutoHeal-CICD
```

### 2️⃣ Start Minikube

```bash
minikube start --driver=docker
eval $(minikube docker-env)
```

Verify:
```bash
kubectl get nodes
docker info | grep Name  # Should show: minikube
```

### 3️⃣ Configure Environment Variables

```bash
cd control-hub/backend
cp .env.example .env
# Edit .env with your GitHub credentials
```

### 4️⃣ Install Dependencies & Start Backend

```bash
cd control-hub/backend
npm install
node server.js
```

Backend runs on: `http://localhost:5000`

### 5️⃣ Start Frontend

```bash
cd control-hub/frontend
python3 -m http.server 3000
```

Open: `http://localhost:3000`

---

## 🎯 Features & Usage

### 🐳 Docker Operations

| Button | Function |
|--------|----------|
| **List Images** | Shows all Docker images with size & creation time |
| **Build Image** | Builds Docker image inside Minikube |
| **Prune Images** | Removes dangling/unused images |

### ☸ Kubernetes Operations

| Button | Function |
|--------|----------|
| **List Pods** | Shows all pods with color-coded status |
| **Deploy Image** | Deploys selected Docker image to K8s |
| **Delete Pod** | Manually delete a pod (for auto-heal demo) |
| **🧠 Auto-Clean** | Removes failed ImagePullBackOff pods |

**Pod Status Colors:**
- 🟢 **Green** – Running
- 🟡 **Yellow** – Pending
- 🔴 **Red** – Failed / ImagePullBackOff

### 📦 Ansible (CD)

| Button | Function |
|--------|----------|
| **Run Deployment** | Executes Ansible playbook for configuration management |

### 🔁 GitHub Actions (CI/CD)

| Button | Function |
|--------|----------|
| **CI Only** | Triggers build & test pipeline |
| **CI + CD** | Triggers full CI/CD pipeline with deployment |

### 📜 System Logs

- Centralized logging for all operations
- Timestamped entries
- Filter by tool (Docker, K8s, Ansible, GitHub)

### 🛡️ Admin Panel

- View all audit logs
- Filter logs by category
- Summary statistics
- Clear logs (with admin key)

---

## 🔧 Environment Configuration

Create `.env` file in `control-hub/backend/`:

```env
# GitHub Actions Configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=deployX-AutoHeal-CICD
GITHUB_WORKFLOW=deployx-cicd.yml

# Admin Configuration
ADMIN_KEY=your_secure_admin_key
```

### Getting GitHub Token:
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo` + `workflow`
4. Copy and paste in `.env`

---

## 🧠 Auto-Heal Feature Explained

### What is Auto-Healing?

When a pod fails or enters `ImagePullBackOff` state:
1. Kubernetes automatically tries to restart it
2. deployX can detect and clean stuck pods
3. New deployments use `imagePullPolicy: Never` to prevent pull errors

### Demo Flow:

1. Deploy an image → Pod runs ✅
2. Delete the pod manually → K8s auto-recreates it ✅
3. If stuck in ImagePullBackOff → Click "Auto-Clean" ✅

---

## 🛠 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `kubectl` returns empty | Use `minikube kubectl --` instead |
| ImagePullBackOff | Build image inside Minikube with `eval $(minikube docker-env)` |
| Backend not connecting | Check if port 5000 is free: `lsof -i :5000` |
| Pods not showing | Restart backend after Minikube starts |

### Debug Commands

```bash
# Check pod details
kubectl describe pod <pod-name>

# View pod logs
kubectl logs <pod-name>

# Delete stuck pod
kubectl delete pod <pod-name>

# Check Docker images in Minikube
eval $(minikube docker-env) && docker images

# Test backend API
curl http://localhost:5000/api/k8s/pods
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                 Frontend (Port 3000)                     │
│            HTML + CSS + JavaScript Dashboard             │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend (Port 5000)                     │
│               Node.js + Express + SQLite                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐    │
│  │ Docker  │ │   K8s   │ │ Ansible │ │   GitHub    │    │
│  │ Routes  │ │ Routes  │ │ Routes  │ │   Routes    │    │
│  └────┬────┘ └────┬────┘ └────┬────┘ └──────┬──────┘    │
└───────┼───────────┼───────────┼─────────────┼───────────┘
        ▼           ▼           ▼             ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────┐
   │ Docker  │ │Minikube │ │ Ansible │ │  GitHub   │
   │ Engine  │ │   K8s   │ │Playbook │ │  Actions  │
   └─────────┘ └─────────┘ └─────────┘ └───────────┘
```

---

## 🏆 Key Highlights

✅ No external Docker registry required  
✅ Local Kubernetes-ready images  
✅ Auto-healing demonstration  
✅ Real GitHub Actions integration  
✅ Centralized audit logging  
✅ Admin panel with authentication  
✅ Beginner-friendly DevOps project  
✅ Clean separation of frontend & backend  

---

## 🔮 Future Enhancements

- [ ] Pod logs viewer in dashboard
- [ ] Deployment rollback feature
- [ ] Resource monitoring (CPU/RAM)
- [ ] Namespace support
- [ ] Helm chart integration
- [ ] Prometheus metrics
- [ ] Slack/Discord notifications

---

## 👤 Author

**Dinesh**  
DevOps Project  

---

## 📄 License

This project is for **educational and learning purposes**.

---

## 🙏 Acknowledgments

- Kubernetes Documentation
- Docker Documentation
- GitHub Actions Documentation
- Ansible Documentation
