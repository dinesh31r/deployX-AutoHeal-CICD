# deployX AutoHeal CI/CD - Viva Questions & Answers

## 📚 50 Comprehensive Viva Questions

---

## **Section 1: Project Overview (Q1-Q10)**

### Q1: What is the main purpose of your deployX AutoHeal project?
**Answer:** deployX AutoHeal is a DevOps automation platform that provides a web-based Control Hub to manage Docker images, Kubernetes deployments, Ansible automation, and CI/CD pipelines through GitHub Actions. It simplifies container orchestration and implements auto-healing capabilities for failed pods.

---

### Q2: What technologies are used in this project?
**Answer:**
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js with Express.js
- **Database:** SQLite (for logging)
- **Containerization:** Docker
- **Orchestration:** Kubernetes (Minikube)
- **Automation:** Ansible
- **CI/CD:** GitHub Actions
- **Registry:** Docker Hub

---

### Q3: Explain the architecture of your application.
**Answer:** The architecture consists of:
1. **Control Hub UI** - Web interface for users
2. **Backend API Server** - Express.js handling REST API requests
3. **Minikube** - Local Kubernetes cluster
4. **Docker** - Container runtime inside Minikube
5. **Ansible** - Configuration management and automation
6. **GitHub Actions** - Cloud-based CI/CD pipeline
7. **Docker Hub** - Cloud image registry

---

### Q4: What is the Control Hub?
**Answer:** The Control Hub is a web-based dashboard that provides a unified interface to manage all DevOps operations. It allows users to build Docker images, deploy to Kubernetes, run Ansible playbooks, trigger CI/CD pipelines, and view logs - all from a single UI.

---

### Q5: Why did you choose Minikube for this project?
**Answer:** Minikube provides a local Kubernetes cluster that's perfect for development and learning. It simulates a production K8s environment without needing cloud resources, making it ideal for demonstrating DevOps concepts in a controlled environment.

---

### Q6: What is the role of the backend server?
**Answer:** The backend server (server.js) is an Express.js application that:
- Serves the frontend static files
- Provides REST API endpoints for Docker, K8s, Ansible, and GitHub operations
- Executes shell commands to interact with Docker and Kubernetes
- Logs all operations to SQLite database
- Handles authentication for admin routes

---

### Q7: How is logging implemented in your project?
**Answer:** Logging is implemented using a custom logger service that stores logs in SQLite database. Each log entry contains:
- Timestamp
- Tool name (docker, kubernetes, ansible, github)
- Action performed
- Status (SUCCESS/FAILED)
- Details/message

---

### Q8: What is the difference between CI and CD in your project?
**Answer:**
- **CI (Continuous Integration):** Automatically builds and validates Docker images when code is pushed to GitHub
- **CD (Continuous Deployment):** Extends CI by also pushing the built image to Docker Hub registry

---

### Q9: How do users interact with your system?
**Answer:** Users interact through:
1. **Web UI** - Click buttons to perform operations
2. **API endpoints** - Direct HTTP requests to backend
3. **Terminal** - Run commands directly (images still appear in UI)

---

### Q10: What problem does this project solve?
**Answer:** It solves the complexity of managing multiple DevOps tools by providing a unified interface. Instead of running separate commands for Docker, Kubernetes, and Ansible, users can perform all operations from a single dashboard with proper logging and error handling.

---

## **Section 2: Docker (Q11-Q20)**

### Q11: What is Docker and why is it used?
**Answer:** Docker is a containerization platform that packages applications and their dependencies into containers. It's used to ensure consistency across development, testing, and production environments, making applications portable and isolated.

---

### Q12: Explain the Dockerfile in your project.
**Answer:** 
```dockerfile
FROM nginx:alpine
COPY website/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
- Uses nginx:alpine as base image (lightweight)
- Copies website files to nginx's html directory
- Exposes port 80
- Runs nginx in foreground mode

---

### Q13: What does `eval $(minikube docker-env)` do?
**Answer:** This command configures the current terminal to use Minikube's Docker daemon instead of the host's Docker. This ensures images are built directly inside Minikube, making them immediately available to Kubernetes without needing to push to a registry.

---

### Q14: How does the "Build Image" feature work?
**Answer:** When you click "Build Image":
1. Frontend sends POST request to `/api/docker/build` with image name
2. Backend runs `eval $(minikube docker-env) && docker build -t <imageName> -f <Dockerfile> <context>`
3. Image is built inside Minikube's Docker daemon
4. Result is logged and returned to UI

---

### Q15: What is `imagePullPolicy: Never` in Kubernetes?
**Answer:** It tells Kubernetes to never try to pull the image from a remote registry. Instead, it uses the local image already present in the node's Docker daemon. This is essential for Minikube when using locally built images.

---

### Q16: What is docker image pruning?
**Answer:** Pruning removes dangling images (images without tags, usually old build layers). The command `docker image prune -f` cleans up unused images to free disk space.

---

### Q17: How are Docker images listed in your application?
**Answer:** The backend runs:
```bash
docker images --format "{{.Repository}}|{{.Tag}}|{{.ID}}|{{.CreatedAt}}|{{.Size}}"
```
This returns formatted image data which is parsed and displayed in the UI table.

---

### Q18: What is the difference between Docker image and container?
**Answer:**
- **Image:** A read-only template containing application code, libraries, and dependencies
- **Container:** A running instance of an image; it's the actual process executing the application

---

### Q19: Why use nginx:alpine as base image?
**Answer:** 
- **Alpine** is a minimal Linux distribution (~5MB)
- **nginx** is a fast, lightweight web server
- Combined, they create a very small image (~20MB) compared to full Ubuntu-based images (~100MB+)

---

### Q20: What happens if you build an image with the same name?
**Answer:** The new image takes the tag, and the old image becomes "dangling" (untagged). The old image still exists but without a name. You can clean these with `docker image prune`.

---

## **Section 3: Kubernetes (Q21-Q30)**

### Q21: What is Kubernetes?
**Answer:** Kubernetes (K8s) is a container orchestration platform that automates deployment, scaling, and management of containerized applications. It handles load balancing, self-healing, rolling updates, and resource management.

---

### Q22: What is a Pod in Kubernetes?
**Answer:** A Pod is the smallest deployable unit in Kubernetes. It represents one or more containers that share storage, network, and a specification for how to run. In most cases, a pod runs a single container.

---

### Q23: What is a Deployment in Kubernetes?
**Answer:** A Deployment is a higher-level resource that manages Pods. It provides:
- Declarative updates for Pods
- Rolling updates and rollbacks
- Scaling capabilities
- Self-healing (recreates failed pods)

---

### Q24: Explain the deployment.yaml in your project.
**Answer:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deployx-autoheal
spec:
  replicas: 2
  selector:
    matchLabels:
      app: deployx
  template:
    spec:
      containers:
      - name: deployx
        image: deployx:autoheal
        livenessProbe: ...
        readinessProbe: ...
```
- Creates 2 replicas of the pod
- Uses local image `deployx:autoheal`
- Includes health probes for auto-healing

---

### Q25: What is a livenessProbe?
**Answer:** A livenessProbe checks if a container is still running. If it fails, Kubernetes kills the container and restarts it. Example:
```yaml
livenessProbe:
  httpGet:
    path: /
    port: 80
  periodSeconds: 10
```

---

### Q26: What is a readinessProbe?
**Answer:** A readinessProbe checks if a container is ready to receive traffic. If it fails, the pod is removed from service endpoints (no traffic is sent to it), but the container is NOT restarted.

---

### Q27: What is the auto-heal feature in your project?
**Answer:** Auto-heal has two aspects:
1. **Kubernetes native:** livenessProbe automatically restarts unhealthy containers
2. **Custom cleanup:** The "Auto Clean Failed Pods" button deletes pods stuck in ImagePullBackOff or ErrImagePull states

---

### Q28: What does ImagePullBackOff error mean?
**Answer:** It means Kubernetes cannot pull the specified Docker image. Common causes:
- Image doesn't exist in the registry
- Wrong image name/tag
- Authentication issues
- Network problems

---

### Q29: How does "Add to Deployment" work in your UI?
**Answer:** It dynamically creates a Kubernetes Deployment YAML and applies it:
1. Takes image name from UI
2. Generates deployment manifest with that image
3. Runs `kubectl apply -f -` to create the deployment
4. Sets `imagePullPolicy: Never` for local images

---

### Q30: What is the difference between `kubectl delete pod` and `kubectl delete deployment`?
**Answer:**
- `delete pod`: Only deletes the pod; if managed by a deployment, it will be recreated
- `delete deployment`: Deletes the deployment AND all its pods permanently

---

## **Section 4: Ansible (Q31-Q37)**

### Q31: What is Ansible?
**Answer:** Ansible is an open-source automation tool for configuration management, application deployment, and task automation. It uses YAML-based playbooks and is agentless (connects via SSH).

---

### Q32: What is an Ansible Playbook?
**Answer:** A playbook is a YAML file containing a set of tasks to be executed on target hosts. It defines the desired state of systems and the steps to achieve it.

---

### Q33: Explain the deploy.yml playbook in your project.
**Answer:** The playbook:
1. Checks Docker installation
2. Starts Minikube
3. Sets Docker environment to Minikube
4. Builds Docker image (`deployx:autoheal`)
5. Applies Kubernetes manifests
6. Restarts the deployment
7. Shows running pods

---

### Q34: What is an Ansible inventory file?
**Answer:** The inventory file lists the hosts where Ansible will run tasks. In your project:
```ini
[local]
localhost ansible_connection=local
```
This configures Ansible to run commands locally without SSH.

---

### Q35: Why use `become: false` in your playbook?
**Answer:** `become: false` means Ansible won't use sudo/root privileges. Since Docker and Minikube commands work with the current user (who has appropriate permissions), elevated privileges aren't needed.

---

### Q36: What does `ignore_errors: yes` do?
**Answer:** It tells Ansible to continue executing subsequent tasks even if that task fails. Used for non-critical tasks like restarting a deployment that might not exist yet.

---

### Q37: How is Ansible integrated in the Control Hub?
**Answer:** The `/api/ansible/deploy` endpoint runs:
```bash
ansible-playbook -i inventory deploy.yml
```
This executes the full playbook and returns success/failure status to the UI.

---

## **Section 5: CI/CD & GitHub Actions (Q38-Q44)**

### Q38: What is GitHub Actions?
**Answer:** GitHub Actions is a CI/CD platform integrated into GitHub. It automates workflows like building, testing, and deploying code when events occur (push, pull request, manual trigger).

---

### Q39: Explain the workflow file structure.
**Answer:**
```yaml
name: deployX CI/CD Pipeline
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      pipelineType: [CI_ONLY, CI_CD]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps: [checkout, build image]
  
  cd:
    needs: ci
    if: pipelineType == 'CI_CD'
    steps: [login, build, push to Docker Hub]
```

---

### Q40: What is `workflow_dispatch`?
**Answer:** It's a trigger that allows manual execution of a workflow from the GitHub UI or API. In your project, it lets users choose between CI_ONLY or CI_CD pipeline types.

---

### Q41: How does the Control Hub trigger GitHub Actions?
**Answer:** It uses the GitHub REST API:
```javascript
axios.post(
  'https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow}/dispatches',
  { ref: 'main', inputs: { pipelineType: 'CI_CD' } },
  { headers: { Authorization: 'Bearer TOKEN' } }
)
```

---

### Q42: What is a GitHub Personal Access Token (PAT)?
**Answer:** A PAT is an authentication token that grants API access to GitHub repositories. It's used instead of passwords and can have specific scopes (permissions) like `repo` and `workflow`.

---

### Q43: What are GitHub Secrets?
**Answer:** Secrets are encrypted environment variables stored in GitHub. They're used for sensitive data like passwords and tokens. In your project:
- `DOCKER_PASSWORD`: Docker Hub access token
- `GITHUB_TOKEN`: Personal access token

---

### Q44: What is the difference between CI_ONLY and CI_CD in your project?
**Answer:**
- **CI_ONLY:** Only builds and validates the Docker image (no push)
- **CI_CD:** Builds the image AND pushes it to Docker Hub (`dinesh31r/deployx:latest`)

---

## **Section 6: Security & Authentication (Q45-Q47)**

### Q45: How is the admin panel protected?
**Answer:** The admin routes use middleware authentication:
```javascript
const adminAuth = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

---

### Q46: What is stored in the .env file?
**Answer:**
```
PORT=5050
ADMIN_PASSWORD=your_password
GITHUB_TOKEN=ghp_xxx
GITHUB_OWNER=dinesh31r
GITHUB_REPO=deployX-AutoHeal-CICD
GITHUB_WORKFLOW=deployx-cicd.yml
```

---

### Q47: Why shouldn't .env files be committed to Git?
**Answer:** .env files contain sensitive credentials (passwords, tokens). If committed:
- Anyone with repo access can see them
- They remain in git history even if deleted
- Can lead to security breaches

Use `.gitignore` to exclude them.

---

## **Section 7: General DevOps Concepts (Q48-Q50)**

### Q48: What is Infrastructure as Code (IaC)?
**Answer:** IaC is managing infrastructure through code/configuration files instead of manual processes. In your project:
- **Dockerfile** - Defines container build
- **deployment.yaml** - Defines K8s resources
- **deploy.yml** - Defines Ansible automation

---

### Q49: What is the difference between containers and virtual machines?
**Answer:**
| Containers | Virtual Machines |
|------------|------------------|
| Share host OS kernel | Have own OS |
| Lightweight (MBs) | Heavy (GBs) |
| Start in seconds | Start in minutes |
| Less isolated | Fully isolated |
| Docker, containerd | VMware, VirtualBox |

---

### Q50: How would you improve this project for production?
**Answer:**
1. **Use managed Kubernetes** (EKS, GKE, AKS) instead of Minikube
2. **Add HTTPS/TLS** for secure communication
3. **Implement proper authentication** (OAuth, JWT)
4. **Use Helm charts** for complex deployments
5. **Add monitoring** (Prometheus, Grafana)
6. **Implement GitOps** (ArgoCD, Flux)
7. **Add automated testing** in CI pipeline
8. **Use secrets management** (Vault, Sealed Secrets)
9. **Implement RBAC** for Kubernetes
10. **Add container vulnerability scanning**

---

## 🎯 Quick Reference Commands

```bash
# Docker
eval $(minikube docker-env)
docker build -t myapp:v1 .
docker images
docker image prune -f

# Kubernetes
minikube kubectl -- get pods
minikube kubectl -- get deployments
minikube kubectl -- apply -f deployment.yaml
minikube kubectl -- delete deployment myapp

# Ansible
ansible-playbook -i inventory deploy.yml

# Git
git add . && git commit -m "message" && git push
```

---

## 📝 Good Luck with your Viva! 🚀
