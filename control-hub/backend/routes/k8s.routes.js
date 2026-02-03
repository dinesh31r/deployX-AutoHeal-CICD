const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const logger = require("../services/logger.service");

const router = express.Router();

// Use minikube kubectl as snap kubectl doesn't work from Node.js
const KUBECTL = "minikube kubectl --";

const PROJECT_ROOT = path.resolve(__dirname, "../../..");
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
        logger("ansible", "AUTO_DEPLOY", "SUCCESS", "Triggered after K8s operation");
        resolve(stdout);
      }
    });
  });
};

/* ---------- LIST PODS ---------- */
router.get("/pods", (req, res) => {
  // Use custom columns with exact start time
  exec(`${KUBECTL} get pods -o custom-columns="NAME:.metadata.name,READY:.status.containerStatuses[0].ready,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,CREATED:.metadata.creationTimestamp" --no-headers`, async (err, stdout, stderr) => {
    if (err) {
      // Fallback to simple format if custom columns fail
      exec(`${KUBECTL} get pods --no-headers`, async (err2, stdout2, stderr2) => {
        if (err2) {
          logger("kubernetes", "LIST_PODS", "FAILED", stderr2);
          return res.status(500).json({ error: stderr2 });
        }
        const pods = stdout2.split("\n").map(l => l.trim()).filter(Boolean);
        logger("kubernetes", "LIST_PODS", "SUCCESS", `Count: ${pods.length}`);
        
        // Run Ansible deployment after listing pods
        try {
          await runAnsibleDeployment();
          res.json({ pods, ansibleDeployed: true });
        } catch (ansibleErr) {
          res.json({ pods, ansibleDeployed: false, ansibleError: ansibleErr });
        }
      });
      return;
    }

    const pods = stdout
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    logger("kubernetes", "LIST_PODS", "SUCCESS", `Count: ${pods.length}`);
    
    // Run Ansible deployment after listing pods
    try {
      await runAnsibleDeployment();
      res.json({ pods, ansibleDeployed: true });
    } catch (ansibleErr) {
      res.json({ pods, ansibleDeployed: false, ansibleError: ansibleErr });
    }
  });
});

/* ---------- DELETE POD ---------- */
router.delete("/pods/:name", (req, res) => {
  const pod = req.params.name;

  // Extract deployment name from pod (remove random suffix like -xxxxx-xxxxx)
  const deploymentName = pod.replace(/-[a-z0-9]+-[a-z0-9]+$/, "");

  // Delete the deployment instead of just the pod
  exec(`${KUBECTL} delete deployment ${deploymentName} --ignore-not-found`, async (err, stdout, stderr) => {
    if (err) {
      // Fallback: try deleting just the pod if no deployment found
      exec(`${KUBECTL} delete pod ${pod}`, async (err2, stdout2, stderr2) => {
        if (err2) {
          logger("kubernetes", "DELETE_POD", "FAILED", stderr2);
          return res.status(500).json({ error: stderr2 });
        }
        logger("kubernetes", "DELETE_POD", "SUCCESS", pod);
        
        // Run Ansible deployment after deleting pod
        try {
          await runAnsibleDeployment();
          res.json({ message: `Pod ${pod} deleted`, ansibleDeployed: true });
        } catch (ansibleErr) {
          res.json({ message: `Pod ${pod} deleted`, ansibleDeployed: false, ansibleError: ansibleErr });
        }
      });
      return;
    }

    logger("kubernetes", "DELETE_DEPLOYMENT", "SUCCESS", deploymentName);
    
    // Run Ansible deployment after deleting deployment
    try {
      await runAnsibleDeployment();
      res.json({ message: `Deployment ${deploymentName} and its pods deleted`, ansibleDeployed: true });
    } catch (ansibleErr) {
      res.json({ message: `Deployment ${deploymentName} and its pods deleted`, ansibleDeployed: false, ansibleError: ansibleErr });
    }
  });
});

/* ---------- DEPLOY IMAGE (LOCAL MINIKUBE IMAGE) ---------- */
router.post("/deploy", (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Image required" });
  }

  const appName = image.replace(/[^a-z0-9]/gi, "-").toLowerCase();

  const cmd = `
cat <<EOF | ${KUBECTL} apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:
      containers:
      - name: ${appName}
        image: ${image}
        imagePullPolicy: Never
EOF
`;

  exec(cmd, async (err, stdout, stderr) => {
    if (err) {
      logger("kubernetes", "DEPLOY", "FAILED", stderr);
      return res.status(500).json({ error: stderr });
    }

    logger("kubernetes", "DEPLOY", "SUCCESS", image);
    
    // Run Ansible deployment after deploying image
    try {
      await runAnsibleDeployment();
      res.json({ message: `Image ${image} deployed successfully`, ansibleDeployed: true });
    } catch (ansibleErr) {
      res.json({ message: `Image ${image} deployed successfully`, ansibleDeployed: false, ansibleError: ansibleErr });
    }
  });
});

/* ---------- AUTO-DELETE FAILED IMAGE PODS ---------- */
router.delete("/cleanup-failed", (req, res) => {
  exec(
    `${KUBECTL} get pods --no-headers | grep -E "ImagePullBackOff|ErrImagePull|ErrImageNeverPull|InvalidImageName" | awk '{print $1}'`,
    (err, stdout) => {
      if (err) {
        logger("kubernetes", "AUTO_CLEAN", "FAILED", err.message);
        return res.status(500).json({ error: err.message });
      }

      const pods = stdout
        .split("\n")
        .map(p => p.trim())
        .filter(Boolean);

      if (pods.length === 0) {
        // Still run Ansible deployment even if no failed pods
        runAnsibleDeployment()
          .then(() => res.json({ message: "No failed pods found", ansibleDeployed: true }))
          .catch(ansibleErr => res.json({ message: "No failed pods found", ansibleDeployed: false, ansibleError: ansibleErr }));
        return;
      }

      // Extract deployment names from pod names (remove -xxxxx-xxxxx suffix)
      const deployments = [...new Set(pods.map(pod => 
        pod.replace(/-[a-z0-9]+-[a-z0-9]+$/, "")
      ))];

      // Delete deployments (which will also delete the pods)
      exec(`${KUBECTL} delete deployment ${deployments.join(" ")} --ignore-not-found`, async (err2) => {
        if (err2) {
          // Fallback: try deleting just the pods
          exec(`${KUBECTL} delete pod ${pods.join(" ")} --force --grace-period=0`, () => {});
        }
        
        logger(
          "kubernetes",
          "AUTO_CLEAN",
          "SUCCESS",
          `Deleted deployments: ${deployments.join(", ")}`
        );

        // Run Ansible deployment after cleanup
        try {
          await runAnsibleDeployment();
          res.json({
            message: "Failed deployments and pods deleted",
            deployments,
            pods,
            ansibleDeployed: true
          });
        } catch (ansibleErr) {
          res.json({
            message: "Failed deployments and pods deleted",
            deployments,
            pods,
            ansibleDeployed: false,
            ansibleError: ansibleErr
          });
        }
      });
    }
  );
});


module.exports = router;
