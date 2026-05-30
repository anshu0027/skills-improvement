import type { Module } from "@/data/learn/types";
import { getModuleMeta } from "@/data/learn/meta";

const meta = getModuleMeta("cloud-devops")!;

export const learnModule: Module = {
  ...meta,
  simple:
    "The cloud is just someone else's computer — except it scales from zero to millions of users without you buying hardware. DevOps is the practice of shipping code to those computers reliably: containers package your app so it runs identically everywhere, CI/CD pipelines test and deploy it automatically, and Kubernetes makes sure the right number of copies are always running. Together they turn 'it works on my machine' into 'it works in production, every time'.",
  concepts: [
    {
      title: "The cloud & shared-responsibility model",
      explain:
        "Cloud computing means renting compute, storage, and networking from a provider (AWS, GCP, Azure) instead of owning physical servers. You pay per second, scale with a config change, and get a global network of data centres for free. The shared-responsibility model splits security duties: the provider secures the physical data centre, hypervisor, and managed service software; you secure everything you deploy — your code, OS patches (if you manage the OS), IAM policies, network rules, and data encryption. 'Security of the cloud' vs 'security in the cloud'.",
      note: "Misunderstanding this boundary is the source of most cloud breaches. An S3 bucket left public, an overly permissive IAM role, or an unpatched EC2 instance — all your responsibility, not AWS's.",
    },
    {
      title: "AWS core services",
      explain:
        "EC2 is a virtual machine you rent by the hour — full control, you manage the OS. S3 is infinitely scalable object storage (files, images, backups, static sites). RDS is a managed relational database (Postgres, MySQL); AWS handles patching and failover. Lambda is serverless compute — your function runs in response to an event, you pay only for execution milliseconds. IAM controls who/what can access which AWS resource. VPC is a private virtual network inside AWS where you place resources and control traffic with subnets, security groups, and route tables.",
      code: `# Upload a file to S3
aws s3 cp ./build.tar.gz s3://my-bucket/releases/build.tar.gz

# Invoke a Lambda function
aws lambda invoke \\
  --function-name process-upload \\
  --payload '{"key":"releases/build.tar.gz"}' \\
  out.json`,
      lang: "bash",
      note: "In a typical production app: static assets live in S3 behind CloudFront CDN; the API runs on ECS (container) or Lambda; state lives in RDS + ElastiCache; every resource talks through IAM roles, not hardcoded keys.",
    },
    {
      title: "IAM & least-privilege",
      explain:
        "IAM (Identity and Access Management) is the access control layer of AWS. Every action — reading S3, invoking Lambda, querying RDS — is an API call that IAM either allows or denies. Least-privilege means granting the minimum permissions needed and nothing more. Use IAM roles (not access keys) for services; attach policies that name the exact actions and resources. Rotate credentials, enable MFA, and never embed keys in source code.",
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-bucket/uploads/*"
    }
  ]
}`,
      lang: "json",
      note: "A Lambda function that only needs to write to one S3 prefix should have exactly that policy — nothing else. If it's compromised, the blast radius is that prefix. A wildcard s3:* policy turns a small bug into a data breach.",
    },
    {
      title: "Containers vs VMs",
      explain:
        "A VM virtualises the entire hardware stack — each VM runs its own OS kernel, taking minutes to boot and gigabytes of RAM. A container shares the host OS kernel; it isolates only the process, filesystem, and network namespace. Containers start in seconds, are megabytes in size, and pack dozens per host. The trade-off: VMs give stronger isolation (separate kernels), containers give density and speed. Docker is the standard container runtime; it packages your app + its dependencies into a portable image.",
      note: "Containers are the unit of deployment in 2026 cloud-native stacks. The same image runs on a developer laptop, a CI server, and a Kubernetes cluster — eliminating the 'works on my machine' problem.",
    },
    {
      title: "Docker images, layers & a good Dockerfile",
      explain:
        "A Docker image is a stack of read-only layers. Each `RUN`/`COPY`/`ADD` instruction adds a layer. Layers are cached — if nothing above changed, Docker reuses the cache, making rebuilds fast. A container is an image with a thin writable layer on top. Best practices: use a minimal base image (alpine, distroless); copy dependency manifests first so the dependency layer caches; multi-stage builds compile in a fat image and copy only the binary into a tiny final image.",
      code: `# ── Multi-stage Node.js Dockerfile ──
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
      lang: "dockerfile",
      note: "The multi-stage pattern keeps the final image small (no build tools, no dev deps, no source). A smaller image means faster pulls in CI, smaller attack surface, and lower ECR storage costs. Always pin base image tags to a digest in production.",
    },
    {
      title: "Container registries & pushing images",
      explain:
        "A registry stores and distributes Docker images. Docker Hub is public; AWS ECR (Elastic Container Registry), GCP Artifact Registry, and GitHub Container Registry (ghcr.io) are private. You build, tag, and push an image from CI, then your deployment pulls that exact digest. Tags like `latest` are mutable — in production, pin the image digest or a commit-SHA tag so every deploy is reproducible.",
      code: `# Authenticate to AWS ECR
aws ecr get-login-password --region ap-south-1 \\
  | docker login --username AWS --password-stdin \\
    123456789.dkr.ecr.ap-south-1.amazonaws.com

# Build, tag, push
docker build -t my-api:$COMMIT_SHA .
docker tag my-api:$COMMIT_SHA \\
  123456789.dkr.ecr.ap-south-1.amazonaws.com/my-api:$COMMIT_SHA
docker push 123456789.dkr.ecr.ap-south-1.amazonaws.com/my-api:$COMMIT_SHA`,
      lang: "bash",
      note: "Using the git commit SHA as the image tag creates an immutable, auditable link between a deploy and the exact code that built it. Combined with a rollback command that re-deploys the previous SHA, you have a one-command incident response.",
    },
    {
      title: "Kubernetes basics — pods, deployments, services, ingress",
      explain:
        "Kubernetes (k8s) is a container orchestrator: it decides which node to run containers on, restarts crashed containers, scales up/down, and rolls out new versions. A Pod is the smallest unit — one or more containers sharing a network namespace. A Deployment declares the desired state (e.g. 'run 3 replicas of this image') and reconciles reality to match. A Service gives pods a stable internal DNS name and load-balances traffic between them. An Ingress routes external HTTP/S traffic to Services based on host/path rules, using a controller like nginx-ingress or AWS ALB Ingress.",
      code: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: 123456789.dkr.ecr.ap-south-1.amazonaws.com/my-api:abc123
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 3000`,
      lang: "yaml",
      note: "Setting resource requests and limits is mandatory in production. Without them, one noisy pod can starve others on the same node. The Kubernetes scheduler uses requests to decide placement; limits cap actual consumption.",
    },
    {
      title: "12-factor app principles",
      explain:
        "The 12-factor methodology (heroku.com/12factor) is a set of practices for building services that deploy reliably to the cloud. The most important factors: store config in environment variables (not code); treat backing services (DB, Redis, queues) as attached resources swapped by config; keep dev/prod as similar as possible; write logs to stdout (let the platform collect them); design stateless processes (state lives in the backing store, not in-memory) — this is what makes horizontal scaling work.",
      note: "Stateless processes are the heart of auto-scaling. If a request to replica A sets in-memory state that replica B needs, you've broken horizontal scaling. Store sessions in Redis, uploads in S3, and any persistent state in the database.",
    },
    {
      title: "CI/CD — concepts and a GitHub Actions pipeline",
      explain:
        "CI (Continuous Integration) means every push triggers automated tests and a build — catching regressions immediately. CD (Continuous Delivery) means the artifact is automatically built and ready to deploy at any time; a human clicks deploy. Continuous Deployment removes the human click — every green build ships to production. A good pipeline: lint → unit tests → build image → push to registry → deploy to staging → smoke tests → deploy to prod (with approval gate or automated if fully trusted).",
      code: `# .github/workflows/deploy.yml
name: CI / Deploy
on:
  push:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - name: Build & push Docker image
        env:
          AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws ecr get-login-password --region ap-south-1 \\
            | docker login --username AWS --password-stdin \\
              \${{ secrets.ECR_REGISTRY }}
          IMAGE=\${{ secrets.ECR_REGISTRY }}/my-api:\${{ github.sha }}
          docker build -t \$IMAGE .
          docker push \$IMAGE

  deploy-staging:
    needs: test-and-build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: |
          kubectl set image deployment/api \\
            api=\${{ secrets.ECR_REGISTRY }}/my-api:\${{ github.sha }} \\
            --namespace staging`,
      lang: "yaml",
      note: "Never put credentials directly in workflow files. Use GitHub Actions secrets. In a real setup you'd use OIDC (OpenID Connect) to give GitHub Actions a short-lived AWS role — no long-lived keys at all.",
    },
    {
      title: "Infrastructure as Code — Terraform",
      explain:
        "IaC means your cloud infrastructure is defined in code, version-controlled, and applied idempotently. Terraform (by HashiCorp) is the dominant open-source tool: you write declarative HCL files describing the desired state, `terraform plan` shows what will change, `terraform apply` makes it so. Every VPC, EC2, RDS, IAM role, and ECS service can be a Terraform resource. Benefits: reproducible environments (dev, staging, prod from the same code), code review for infra changes, no manual 'click-ops' drift.",
      code: `# main.tf — create an S3 bucket with versioning
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" { region = "ap-south-1" }

resource "aws_s3_bucket" "uploads" {
  bucket = "my-app-uploads-prod"
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration { status = "Enabled" }
}`,
      lang: "hcl",
      note: "Store Terraform state in a remote backend (S3 + DynamoDB lock, or Terraform Cloud) so the team shares state and concurrent applies are safe. Committing state files to git is a common mistake — they contain sensitive data.",
    },
    {
      title: "Secrets management",
      explain:
        "Secrets (DB passwords, API keys, JWT secrets) must never live in source code, Docker images, or plain environment variable files committed to git. Use a dedicated secrets manager: AWS Secrets Manager or SSM Parameter Store (with SecureString), HashiCorp Vault, or 1Password Secrets Automation. At runtime, your app fetches the secret by name/ARN over an authenticated API call. In Kubernetes, use External Secrets Operator to sync from a secrets manager into k8s Secrets and mount them as env vars.",
      note: "A single leaked key in git history can live there forever unless history is rewritten. Treat secret rotation as an automated process, not a manual one — Secrets Manager can rotate RDS passwords automatically and tell your app to fetch the new value.",
    },
    {
      title: "Zero-downtime deploys — blue-green, canary, rolling",
      explain:
        "Rolling updates replace pods one at a time, keeping the service up throughout — Kubernetes does this by default. Blue-green keeps two identical environments; traffic switches from blue to green instantly; rollback is instant too (flip back). Canary sends a small percentage of traffic (e.g. 5%) to the new version, watches error rates and latency, then either promotes or rolls back — this limits the blast radius of a bad deploy. All three require health checks and readiness probes so traffic only goes to healthy pods.",
      code: `# Kubernetes rolling update strategy
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0    # never kill old pod before new one is ready
      maxSurge: 1          # allow one extra pod during the rollout

  template:
    spec:
      containers:
        - name: api
          readinessProbe:
            httpGet:
              path: /healthz
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5`,
      lang: "yaml",
      note: "maxUnavailable: 0 with a readinessProbe is the minimum safe rolling update config. Without a readiness probe, Kubernetes sends traffic to the new pod immediately after it starts, before it's actually ready to serve.",
    },
    {
      title: "Observability — logs, metrics, traces",
      explain:
        "Observability is how you understand what your system is doing in production. Three pillars: Logs are timestamped structured records of events (use JSON, ship to CloudWatch Logs or Elasticsearch). Metrics are numeric time-series (request rate, error rate, latency p99, CPU) — collected by Prometheus, visualised in Grafana. Traces follow a single request across microservices with span timing, identifying exactly which service or query is slow (OpenTelemetry is the open standard). CloudWatch covers all three on AWS in a managed way. Alerts (PagerDuty, SNS) fire when a metric crosses a threshold.",
      code: `# prometheus/alerting rule
groups:
  - name: api
    rules:
      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{status=~"5.."}[5m])
          / rate(http_requests_total[5m]) > 0.01
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Error rate above 1% for 2 minutes"`,
      lang: "yaml",
      note: "Without observability you're flying blind. The goal is to detect an incident before users report it and to reduce MTTR (mean time to recover) from hours to minutes. Structured JSON logs with a correlation ID (propagated through services) let you jump from a trace to the exact log lines.",
    },
    {
      title: "Serverless tradeoffs & cost awareness",
      explain:
        "Serverless (Lambda, Cloud Functions, Vercel Edge) removes server management: you deploy code, the platform scales to zero and back up automatically. Pros: no idle cost, zero ops overhead, infinite scale in bursts. Cons: cold starts (first invocation spins up a container, adding latency), execution time limits (15 min on Lambda), hard to run stateful or long-lived workloads, vendor lock-in. Cost awareness: Lambda charges per invocation + duration; RDS costs even when idle; NAT Gateways have per-GB data charges that surprise teams. Always set billing alarms and understand the cost model of each service before shipping.",
      note: "Lambda is excellent for event-driven workloads (S3 triggers, queue consumers, cron jobs) and bursty APIs with unpredictable traffic. For a steady-traffic API, a container on ECS Fargate often costs less and has no cold-start problem. Right-tool thinking matters more than 'serverless first' dogma.",
    },
  ],
  interviewQs: [
    {
      q: "What is the difference between a container and a VM?",
      a: "A VM virtualises the full hardware stack and runs its own OS kernel — heavy, takes minutes to boot, GBs of RAM per instance. A container shares the host OS kernel and only isolates the process, filesystem, and network namespace — lightweight, starts in seconds, MBs each. VMs give stronger security isolation; containers give density and speed. Docker containers are the standard unit of cloud-native deployment.",
    },
    {
      q: "What does Kubernetes actually do — why not just run Docker directly?",
      a: "Docker runs a single container on one host. Kubernetes orchestrates containers across a cluster of hosts: it schedules pods to nodes with available resources, restarts crashed containers, scales replicas up/down based on load, rolls out new versions without downtime, and provides service discovery. Without an orchestrator you need to manually manage which host each container runs on, handle failures, and coordinate deploys — Kubernetes automates all of that.",
    },
    {
      q: "What is the difference between CI and CD?",
      a: "CI (Continuous Integration) automatically runs tests and builds on every push, catching integration bugs early. CD has two meanings: Continuous Delivery means the build is always deployable and staging is always up to date, but a human triggers the prod deploy. Continuous Deployment goes further — every green build is automatically deployed to production with no human gate. Most mature teams use Continuous Delivery with an approval step or automated canary for production.",
    },
    {
      q: "Why must services be stateless to scale horizontally?",
      a: "Horizontal scaling means running multiple identical replicas behind a load balancer. If one replica stores session data in memory, the next request may hit a different replica that doesn't have that state — the user sees a broken experience. Stateless services store all persistent state in an external store (Redis for sessions, a database for records, S3 for files) so every replica can handle any request identically. Then you can add or remove replicas freely.",
    },
    {
      q: "How do you deploy with zero downtime?",
      a: "Three main strategies: Rolling update — replace pods one at a time; Kubernetes does this with maxUnavailable: 0 and a readiness probe. Blue-green — run the new version in parallel, switch load balancer traffic atomically; rollback is an instant flip. Canary — route a small percentage of traffic to the new version, monitor error rates, then gradually increase. All require health checks. The readiness probe is critical: it tells the platform 'I am ready to receive traffic' before the old pod is removed.",
    },
    {
      q: "What is IAM least-privilege and why does it matter?",
      a: "Least-privilege means every identity (user, role, service) gets only the permissions it needs for its specific job — nothing more. If a Lambda that reads from one S3 bucket is compromised, it should not be able to read every bucket or call RDS. You scope IAM policies to exact actions and resource ARNs. This limits blast radius: a credential leak or code vulnerability exploits only the permissions that role has, not your entire AWS account.",
    },
    {
      q: "What is Infrastructure as Code and why use it over the AWS console?",
      a: "IaC (e.g. Terraform, CloudFormation) defines cloud resources in version-controlled code. Benefits: reproducibility (spin up an identical staging environment from the same code), auditability (infra changes go through code review), consistency (no manual click-ops drift between environments), and disaster recovery (re-apply the code to rebuild after an incident). 'Click-ops' changes are invisible and irreproducible — IaC is the production standard.",
    },
    {
      q: "What are the three pillars of observability?",
      a: "Logs: structured records of events (what happened and when). Metrics: numeric time-series aggregated over time — request rate, error rate, latency percentiles, CPU (collected by Prometheus, visualised in Grafana or CloudWatch). Traces: distributed timing that follows one request across multiple services, showing exactly which service or query is slow (OpenTelemetry). You need all three: metrics tell you something is wrong, traces tell you where, and logs tell you why.",
    },
    {
      q: "What are the tradeoffs of serverless (Lambda) vs containers (ECS/K8s)?",
      a: "Lambda: no infrastructure to manage, scales to zero (no idle cost), auto-scales on bursts, pay per invocation. Downsides: cold starts add latency on first invocation, 15-minute execution limit, harder to run stateful or long-running workloads, vendor lock-in. Containers: predictable latency, full control over runtime, easier to run long-lived processes. Downsides: you manage scaling and pay for idle capacity. Best practice: Lambda for event-driven or bursty workloads; containers for steady-traffic APIs or long-running services.",
    },
    {
      q: "How do you handle secrets in a cloud-native app?",
      a: "Never hardcode secrets or commit them to git. Use a secrets manager — AWS Secrets Manager, SSM Parameter Store (SecureString), or HashiCorp Vault. Applications fetch secrets at startup via an authenticated API call (using an IAM role, not a hardcoded key). In Kubernetes, use External Secrets Operator to sync secrets from the manager into k8s Secret objects. Enable automatic rotation where possible (RDS password rotation is built into Secrets Manager). Set up git-secrets or a pre-commit hook to block accidental key commits.",
    },
    {
      q: "Explain the 12-factor app principle around config and why it matters.",
      a: "Config is anything that changes between environments (dev/staging/prod): database URLs, API keys, feature flags. 12-factor says store config in environment variables, not in code or config files committed to git. This means the same Docker image deploys to every environment — only the injected env vars differ. It also means secrets are never in source control, and promoting an image from staging to prod doesn't require a rebuild.",
    },
  ],
  build: [
    "Containerise a Node.js or Python API: write a multi-stage Dockerfile, build the image locally, push it to a free registry (Docker Hub or GitHub Container Registry), and run it with docker run confirming all env vars are injected via --env-file, not baked into the image.",
    "Set up a GitHub Actions CI/CD pipeline for a small project: lint, test, build a Docker image tagged with the commit SHA, push to a registry, and (if you have a cloud account) deploy to a staging environment using kubectl set image or AWS ECS update-service.",
    "Write Terraform code to provision an S3 bucket, an IAM role with a least-privilege policy, and a Lambda function that can read from that bucket. Use terraform plan and terraform apply against LocalStack or a free-tier AWS account.",
    "Add structured observability to a running service: emit JSON logs with a correlation ID, expose a /metrics endpoint (prom-client for Node, prometheus_client for Python), and create a Grafana dashboard showing request rate and p99 latency (use docker-compose to run Prometheus + Grafana locally).",
  ],
  pitfalls: [
    "Running as root inside containers — the container shares the host kernel, so a root process escalating privileges is a real attack vector. Always add a non-root USER in your Dockerfile.",
    "Using `latest` as an image tag in production — it is mutable, so the same tag can point to different code across deploys. Always tag images with the git commit SHA or a semantic version and pin that exact tag in your Kubernetes manifests or ECS task definition.",
    "Hardcoding secrets in environment variables set in the Dockerfile or committed .env files — they end up in the image layer history and in git. Use a secrets manager and inject at runtime via IAM role.",
    "Skipping readiness and liveness probes in Kubernetes — without a readiness probe, the rolling update sends traffic to a new pod before it's ready, causing request failures. Without a liveness probe, a deadlocked pod receives traffic indefinitely.",
    "Ignoring cost — NAT Gateway data transfer, unused Elastic IPs, over-provisioned RDS instances, and Lambda invocations on misconfigured event sources can generate surprise bills. Set AWS Budgets alerts on day one and review Cost Explorer weekly.",
  ],
  resources: [
    {
      label: "AWS Well-Architected Framework",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
    },
    {
      label: "Docker official docs — Dockerfile best practices",
      url: "https://docs.docker.com/build/building/best-practices/",
    },
    {
      label: "Kubernetes official docs — Concepts",
      url: "https://kubernetes.io/docs/concepts/",
    },
    {
      label: "GitHub Actions documentation",
      url: "https://docs.github.com/en/actions",
    },
    {
      label: "Terraform getting started — AWS",
      url: "https://developer.hashicorp.com/terraform/tutorials/aws-get-started",
    },
    {
      label: "The 12-Factor App",
      url: "https://12factor.net/",
    },
  ],
  checklist: [
    "Explain the shared-responsibility model and give two examples of what is your responsibility vs AWS's",
    "Write a multi-stage Dockerfile that produces a small production image, explain why each stage exists",
    "Describe what a Kubernetes Deployment, Service, and Ingress each do and how they relate",
    "Explain CI vs Continuous Delivery vs Continuous Deployment with a concrete pipeline example",
    "Write a minimal Terraform resource, run plan and apply, and explain what remote state is for",
    "Describe blue-green, canary, and rolling deploys — when would you use each?",
    "Explain the three pillars of observability and what each one tells you that the others don't",
    "Explain IAM least-privilege and give an example of scoping a policy to a specific resource ARN",
    "State the serverless (Lambda) cold-start tradeoff and name a workload where Lambda is the right choice vs a wrong choice",
  ],
};
