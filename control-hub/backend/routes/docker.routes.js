const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const logger = require("../services/logger.service");

const router = express.Router();

const PROJECT_ROOT = path.resolve(__dirname, "../../..");
const DOCKERFILE = path.join(PROJECT_ROOT, "base-pipeline/docker/Dockerfile");
const BUILD_CONTEXT = path.join(PROJECT_ROOT, "base-pipeline");
const ANSIBLE_INVENTORY = path.join(PROJECT_ROOT, "base-pipeline/ansible/inventory");
const ANSIBLE_PLAYBOOK = path.join(PROJECT_ROOT, "base-pipeline/ansible/deploy.yml");

/* ---------- HELPER: RUN ANSIBLE DEPLOYMENT ---------- */
const runAnsibleDeployment = () => {
  return new Promise((resolve, reject) => {
    const cmd = `ansible-playbook -i ${ANSIBLE_INVENTORY} ${ANSIBLE_PLAYBOOK}`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        logger("ansible", "AUTO_DEPLOY", "FAILED", stderr);
        reject(stderr);
      } else {
        logger("ansible", "AUTO_DEPLOY", "SUCCESS", "Triggered after Docker operation");
        resolve(stdout);
      }
    });
  });
};

/* ---------- BUILD IMAGE (MINIKUBE DOCKER) ---------- */
router.post("/build", (req, res) => {
  const { imageName } = req.body;

  if (!imageName) {
    return res.status(400).json({ error: "Image name required" });
  }

  const cmd = `
eval $(minikube docker-env) &&
docker build -t ${imageName} -f ${DOCKERFILE} ${BUILD_CONTEXT}
`;

  exec(cmd, async (err, stdout, stderr) => {
    if (err) {
      logger("docker", "BUILD", "FAILED", stderr);
      return res.status(500).json({ error: stderr });
    }

    logger("docker", "BUILD", "SUCCESS", imageName);
    
    // Run Ansible deployment after successful build
    try {
      await runAnsibleDeployment();
      res.json({ message: "Image built successfully and Ansible deployment triggered", image: imageName, ansibleDeployed: true });
    } catch (ansibleErr) {
      res.json({ message: "Image built successfully but Ansible deployment failed", image: imageName, ansibleDeployed: false, ansibleError: ansibleErr });
    }
  });
});

/* ---------- LIST IMAGES ---------- */
router.get("/images", (req, res) => {
  // Use custom format to get exact timestamp
  const cmd = `eval $(minikube docker-env) && docker images --format "{{.Repository}}|{{.Tag}}|{{.ID}}|{{.CreatedAt}}|{{.Size}}"`;
  
  exec(cmd, (err, stdout) => {
    if (err) {
      logger("docker", "LIST_IMAGES", "FAILED", err.message);
      return res.status(500).json({ error: err.message });
    }

    const lines = stdout.trim().split("\n").filter(line => line);
    const images = lines.map(line => {
      const [Repository, Tag, ID, CreatedAt, Size] = line.split("|");
      return { Repository, Tag, ID, CreatedAt, Size };
    });

    logger("docker", "LIST_IMAGES", "SUCCESS", `Count: ${images.length}`);
    res.json({ images });
  });
});

/* ---------- PRUNE ---------- */
router.delete("/prune", (req, res) => {
  exec("docker image prune -f", err => {
    if (err) {
      logger("docker", "PRUNE", "FAILED", err.message);
      return res.status(500).json({ error: err.message });
    }

    logger("docker", "PRUNE", "SUCCESS", "Dangling images removed");
    res.json({ message: "Dangling images removed" });
  });
});

module.exports = router;
