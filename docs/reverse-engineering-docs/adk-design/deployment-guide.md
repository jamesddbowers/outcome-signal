# BMad Framework - Google ADK Deployment Guide

**Document Version**: 1.0
**Created**: 2025-10-15
**Last Updated**: 2025-10-15
**Status**: Complete
**Framework**: BMad Core v4 → Google Agent Development Kit (google-adk) + GCP Services

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Prerequisites](#2-prerequisites)
3. [GCP Project Setup](#3-gcp-project-setup)
4. [Service Account Configuration](#4-service-account-configuration)
5. [Vertex AI Setup](#5-vertex-ai-setup)
6. [Storage Configuration](#6-storage-configuration)
7. [Agent Deployment](#7-agent-deployment)
8. [Workflow Deployment](#8-workflow-deployment)
9. [API Deployment](#9-api-deployment)
10. [Configuration Management](#10-configuration-management)
11. [Monitoring and Logging](#11-monitoring-and-logging)
12. [Testing and Validation](#12-testing-and-validation)
13. [Production Deployment](#13-production-deployment)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Introduction

### 1.1 Purpose

This deployment guide provides step-by-step procedures for deploying the BMad framework on Google Cloud Platform using **Google's Agent Development Kit (google-adk)** and Vertex AI services.

**What is Google ADK?** Google's Agent Development Kit (google-adk) is Google's official open-source framework for building and deploying AI agents (`pip install google-adk`). See [architecture-design.md](architecture-design.md#231-understanding-googles-agent-development-kit-google-adk) for detailed explanation.

### 1.2 Audience

This guide is intended for:
- **DevOps Engineers**: Responsible for infrastructure provisioning and deployment
- **Cloud Architects**: Designing and validating GCP architecture
- **Platform Engineers**: Configuring and managing the BMad platform
- **Technical Leads**: Overseeing deployment execution

### 1.3 Deployment Overview

The BMad platform deployment consists of:
- **10 Vertex AI Agents** (Analyst, PM, UX Expert, Architect, PO, SM, Dev, QA, BMad-Master, BMad-Orchestrator)
- **8 Reasoning Engine Workflows** (create-next-story, review-story, risk-profile, test-design, apply-qa-fixes, validate-next-story, execute-checklist, shard-doc)
- **3 Cloud Run Services** (Orchestrator, Agent Gateway, Workflow Gateway)
- **Multiple Cloud Functions** (simple task execution)
- **Storage Services** (Firestore, Cloud Storage)
- **Supporting Services** (Vertex AI Search for KB Mode, Secret Manager, Cloud Logging, Cloud Monitoring)

### 1.4 Deployment Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| **Phase 1: Prerequisites & GCP Setup** | 2-4 hours | GCP project, billing, APIs, base IAM |
| **Phase 2: Storage Configuration** | 2-3 hours | Firestore, Cloud Storage, indexes |
| **Phase 3: Service Accounts & IAM** | 2-3 hours | Service accounts, roles, permissions |
| **Phase 4: Vertex AI Setup** | 1-2 hours | Enable Vertex AI, configure endpoints |
| **Phase 5: Agent Deployment** | 4-6 hours | Deploy all 10 agents |
| **Phase 6: Workflow Deployment** | 4-6 hours | Deploy all 8 workflows |
| **Phase 7: API Deployment** | 3-4 hours | Deploy Cloud Run services |
| **Phase 8: Configuration & Testing** | 3-4 hours | Load templates, test end-to-end |
| **Phase 9: Monitoring Setup** | 2-3 hours | Dashboards, alerts, logging |
| **Phase 10: Production Hardening** | 2-3 hours | Security review, cost optimization |
| **TOTAL** | **25-38 hours** | ~1 week with 1-2 engineers |

### 1.5 Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│   Web UI / IDE Plugins / REST API Clients                  │
└────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                         │
│              Cloud Run + Load Balancer                      │
│   • Authentication (Identity Platform)                      │
│   • Authorization (IAM + Custom RBAC)                       │
│   • Rate Limiting                                           │
└────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Orchestration │  │    Agent     │  │   Workflow   │
│   Service    │  │   Service    │  │   Service    │
│ (Cloud Run)  │  │ (Cloud Run)  │  │ (Cloud Run)  │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
┌────────────────────────────────────────────────────────────┐
│                    EXECUTION LAYER                          │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐   │
│  │  Vertex AI    │  │   Reasoning   │  │    Cloud     │   │
│  │ Agent Builder │  │    Engine     │  │  Functions   │   │
│  │  (10 Agents)  │  │ (8 Workflows) │  │    (Tasks)   │   │
│  └───────────────┘  └───────────────┘  └──────────────┘   │
└────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Firestore   │  │Cloud Storage │  │  Vertex AI   │
│ (Metadata &  │  │(Artifacts &  │  │    Search    │
│    State)    │  │  Templates)  │  │  (KB Mode)   │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 2. Prerequisites

### 2.1 Required Accounts

- **Google Cloud Account** with billing enabled
- **Organization Admin** or **Project Creator** role (for new projects)
- **Billing Account User** role (to link billing)

### 2.2 Required Tools

Install the following tools on your deployment workstation:

#### gcloud CLI
```bash
# Install gcloud CLI
# macOS
brew install google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Windows
# Download and run: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe

# Initialize gcloud
gcloud init

# Authenticate
gcloud auth login
gcloud auth application-default login
```

#### Terraform (for Infrastructure-as-Code)
```bash
# macOS
brew install terraform

# Linux
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Windows
choco install terraform

# Verify
terraform version
```

#### Python 3.10+
```bash
# Verify Python version
python3 --version  # Should be 3.10 or higher

# Create virtual environment
python3 -m venv bmad-deploy-env
source bmad-deploy-env/bin/activate  # Linux/macOS
# bmad-deploy-env\Scripts\activate   # Windows

# Install deployment dependencies
pip install --upgrade pip
pip install google-adk google-cloud-aiplatform google-cloud-firestore \
    google-cloud-storage google-cloud-functions google-cloud-run \
    google-cloud-logging google-cloud-monitoring pyyaml
```

#### kubectl (for GKE if using Kubernetes)
```bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify
kubectl version --client
```

#### jq (JSON processing)
```bash
# macOS
brew install jq

# Linux
sudo apt-get install jq  # Debian/Ubuntu
sudo yum install jq      # RHEL/CentOS

# Verify
jq --version
```

### 2.3 Required Permissions

The user or service account performing the deployment needs:

| Permission | Purpose |
|------------|---------|
| `resourcemanager.projects.create` | Create GCP projects |
| `billing.accounts.getIamPolicy` | Link billing account |
| `serviceusage.services.enable` | Enable required APIs |
| `iam.serviceAccounts.create` | Create service accounts |
| `iam.serviceAccountKeys.create` | Create service account keys |
| `storage.buckets.create` | Create Cloud Storage buckets |
| `datastore.databases.create` | Create Firestore database |
| `aiplatform.endpoints.create` | Deploy Vertex AI endpoints |
| `run.services.create` | Deploy Cloud Run services |
| `cloudfunctions.functions.create` | Deploy Cloud Functions |

**Recommended Role**: `Project Editor` or `Project Owner` for initial deployment.

### 2.4 Network Requirements

- **Firewall Rules**: Allow outbound HTTPS (443) for API calls to Google services
- **VPC Requirements**: Default VPC is sufficient; custom VPC configuration is optional
- **DNS**: No custom DNS required unless using custom domains for APIs

### 2.5 Cost Considerations

Before deployment, ensure:
- Billing account has sufficient credits/budget
- Budget alerts are configured
- Cost estimation has been reviewed (see [architecture-design.md#11-cost-optimization-strategies](architecture-design.md#11-cost-optimization-strategies))

**Estimated Monthly Costs**:
- **Development/Testing**: $100-$300/month
- **Production (moderate usage)**: $580-$1,180/month
- **Production (high usage)**: $1,500-$3,000/month

### 2.6 Pre-Deployment Checklist

Before proceeding, verify:

- [ ] Google Cloud account created with billing enabled
- [ ] gcloud CLI installed and authenticated
- [ ] Python 3.10+ installed with required packages
- [ ] Terraform installed (if using IaC approach)
- [ ] Deployment user has required permissions
- [ ] Budget alerts configured
- [ ] Network connectivity verified
- [ ] Source code repository cloned (agent configs, workflow code, templates)

---

## 3. GCP Project Setup

### 3.1 Create New GCP Project

#### Option A: Via gcloud CLI (Recommended)

```bash
# Set environment variables
export PROJECT_ID="bmad-production"  # Must be globally unique
export PROJECT_NAME="BMad Production"
export ORGANIZATION_ID="123456789012"  # Your organization ID (optional)
export BILLING_ACCOUNT_ID="ABCDEF-123456-ABCDEF"  # Your billing account ID

# Create project
gcloud projects create $PROJECT_ID \
    --name="$PROJECT_NAME" \
    --organization=$ORGANIZATION_ID  # Omit if not using organization

# Set as default project
gcloud config set project $PROJECT_ID

# Link billing account
gcloud billing projects link $PROJECT_ID \
    --billing-account=$BILLING_ACCOUNT_ID

# Verify project creation
gcloud projects describe $PROJECT_ID
```

#### Option B: Via Terraform

Create `terraform/project.tf`:

```hcl
variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "bmad-production"
}

variable "billing_account" {
  description = "Billing account ID"
  type        = string
}

variable "organization_id" {
  description = "Organization ID"
  type        = string
  default     = ""
}

resource "google_project" "bmad_project" {
  name            = "BMad Production"
  project_id      = var.project_id
  billing_account = var.billing_account
  org_id          = var.organization_id

  labels = {
    environment = "production"
    framework   = "bmad"
    managed-by  = "terraform"
  }
}

output "project_id" {
  value = google_project.bmad_project.project_id
}
```

```bash
# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var="billing_account=ABCDEF-123456-ABCDEF"

# Apply
terraform apply -var="billing_account=ABCDEF-123456-ABCDEF"
```

### 3.2 Enable Required APIs

#### Required APIs for BMad Platform

```bash
# Core APIs
gcloud services enable aiplatform.googleapis.com          # Vertex AI
gcloud services enable run.googleapis.com                 # Cloud Run
gcloud services enable cloudfunctions.googleapis.com      # Cloud Functions
gcloud services enable firestore.googleapis.com           # Firestore
gcloud services enable storage-api.googleapis.com         # Cloud Storage
gcloud services enable secretmanager.googleapis.com       # Secret Manager

# Supporting APIs
gcloud services enable cloudresourcemanager.googleapis.com  # Resource Manager
gcloud services enable iam.googleapis.com                   # IAM
gcloud services enable logging.googleapis.com               # Cloud Logging
gcloud services enable monitoring.googleapis.com            # Cloud Monitoring
gcloud services enable cloudtrace.googleapis.com            # Cloud Trace
gcloud services enable cloudbuild.googleapis.com            # Cloud Build (for deployments)
gcloud services enable artifactregistry.googleapis.com      # Artifact Registry

# Optional APIs (for advanced features)
gcloud services enable pubsub.googleapis.com                # Pub/Sub (event-driven workflows)
gcloud services enable cloudscheduler.googleapis.com        # Cloud Scheduler (cron jobs)
gcloud services enable discoveryengine.googleapis.com       # Vertex AI Search (KB Mode)

# Verify enabled APIs
gcloud services list --enabled
```

#### Terraform Alternative

Create `terraform/apis.tf`:

```hcl
locals {
  required_apis = [
    "aiplatform.googleapis.com",
    "run.googleapis.com",
    "cloudfunctions.googleapis.com",
    "firestore.googleapis.com",
    "storage-api.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "cloudtrace.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "pubsub.googleapis.com",
    "cloudscheduler.googleapis.com",
    "discoveryengine.googleapis.com",
  ]
}

resource "google_project_service" "required_apis" {
  for_each = toset(local.required_apis)

  project = var.project_id
  service = each.value

  disable_on_destroy = false
}
```

### 3.3 Configure Project Defaults

```bash
# Set default region and zone
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

# Set default Vertex AI location
export VERTEX_AI_LOCATION="us-central1"

# Create environment configuration file
cat > .env <<EOF
# GCP Project Configuration
PROJECT_ID=$PROJECT_ID
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
REGION=us-central1
ZONE=us-central1-a
VERTEX_AI_LOCATION=us-central1

# Billing
BILLING_ACCOUNT_ID=$BILLING_ACCOUNT_ID

# Service Accounts (will be populated later)
ORCHESTRATOR_SA=
AGENT_SA=
WORKFLOW_SA=

# Storage
FIRESTORE_DATABASE=(default)
TEMPLATES_BUCKET=
DATA_BUCKET=
ARTIFACTS_BUCKET=
KB_BUCKET=
EOF

# Source environment
source .env
```

### 3.4 Configure Budget Alerts

```bash
# Create budget alert (via gcloud)
gcloud billing budgets create \
    --billing-account=$BILLING_ACCOUNT_ID \
    --display-name="BMad Production Budget" \
    --budget-amount=1000.00 \
    --threshold-rule=percent=50 \
    --threshold-rule=percent=75 \
    --threshold-rule=percent=90 \
    --threshold-rule=percent=100

# Alternative: Configure via Cloud Console
# Navigation: Billing > Budgets & alerts > Create Budget
```

### 3.5 Set Up Project Labels

```bash
# Add project labels for organization and cost tracking
gcloud projects update $PROJECT_ID \
    --update-labels=environment=production,framework=bmad,cost-center=engineering

# Verify labels
gcloud projects describe $PROJECT_ID --format="value(labels)"
```

---

## 4. Service Account Configuration

### 4.1 Service Account Overview

BMad requires three primary service accounts:

| Service Account | Purpose | Key Permissions |
|----------------|---------|-----------------|
| **bmad-orchestrator** | Orchestrates workflows, routes requests | Invoke agents/workflows, read/write Firestore, read Cloud Storage |
| **bmad-agents** | Executes agent logic | Read/write Firestore, read/write Cloud Storage, invoke Vertex AI |
| **bmad-workflows** | Executes Reasoning Engine workflows | Read/write Firestore, read/write Cloud Storage, invoke Cloud Functions |

### 4.2 Create Service Accounts

```bash
# Set project context
gcloud config set project $PROJECT_ID

# Create Orchestrator Service Account
gcloud iam service-accounts create bmad-orchestrator \
    --display-name="BMad Orchestrator Service Account" \
    --description="Orchestrates BMad workflows and agent invocations"

# Create Agents Service Account
gcloud iam service-accounts create bmad-agents \
    --display-name="BMad Agents Service Account" \
    --description="Executes BMad agent logic via Vertex AI"

# Create Workflows Service Account
gcloud iam service-accounts create bmad-workflows \
    --display-name="BMad Workflows Service Account" \
    --description="Executes BMad Reasoning Engine workflows"

# Verify service accounts
gcloud iam service-accounts list
```

### 4.3 Assign IAM Roles

#### Orchestrator Service Account

```bash
ORCHESTRATOR_SA="bmad-orchestrator@${PROJECT_ID}.iam.gserviceaccount.com"

# Core permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$ORCHESTRATOR_SA" \
    --role="roles/aiplatform.user"  # Invoke Vertex AI agents

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$ORCHESTRATOR_SA" \
    --role="roles/datastore.user"  # Read/write Firestore

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$ORCHESTRATOR_SA" \
    --role="roles/storage.objectViewer"  # Read Cloud Storage

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$ORCHESTRATOR_SA" \
    --role="roles/run.invoker"  # Invoke Cloud Run services

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$ORCHESTRATOR_SA" \
    --role="roles/cloudfunctions.invoker"  # Invoke Cloud Functions

# Logging and monitoring
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$ORCHESTRATOR_SA" \
    --role="roles/logging.logWriter"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$ORCHESTRATOR_SA" \
    --role="roles/monitoring.metricWriter"
```

#### Agents Service Account

```bash
AGENT_SA="bmad-agents@${PROJECT_ID}.iam.gserviceaccount.com"

# Core permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$AGENT_SA" \
    --role="roles/aiplatform.user"  # Execute on Vertex AI

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$AGENT_SA" \
    --role="roles/datastore.user"  # Read/write Firestore

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$AGENT_SA" \
    --role="roles/storage.objectAdmin"  # Read/write Cloud Storage

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$AGENT_SA" \
    --role="roles/secretmanager.secretAccessor"  # Access secrets

# Allow invoking Cloud Functions (for tool execution)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$AGENT_SA" \
    --role="roles/cloudfunctions.invoker"

# Logging and monitoring
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$AGENT_SA" \
    --role="roles/logging.logWriter"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$AGENT_SA" \
    --role="roles/monitoring.metricWriter"
```

#### Workflows Service Account

```bash
WORKFLOW_SA="bmad-workflows@${PROJECT_ID}.iam.gserviceaccount.com"

# Core permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$WORKFLOW_SA" \
    --role="roles/aiplatform.user"  # Invoke Vertex AI services

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$WORKFLOW_SA" \
    --role="roles/datastore.user"  # Read/write Firestore

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$WORKFLOW_SA" \
    --role="roles/storage.objectAdmin"  # Read/write Cloud Storage

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$WORKFLOW_SA" \
    --role="roles/cloudfunctions.invoker"  # Invoke helper functions

# Logging and monitoring
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$WORKFLOW_SA" \
    --role="roles/logging.logWriter"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$WORKFLOW_SA" \
    --role="roles/monitoring.metricWriter"
```

### 4.4 Create Service Account Keys (for local development)

**⚠️ Warning**: Service account keys should only be created for local development. Production deployments should use Workload Identity or ADC (Application Default Credentials).

```bash
# Create keys directory
mkdir -p keys

# Create Orchestrator key
gcloud iam service-accounts keys create keys/orchestrator-key.json \
    --iam-account=$ORCHESTRATOR_SA

# Create Agents key
gcloud iam service-accounts keys create keys/agents-key.json \
    --iam-account=$AGENT_SA

# Create Workflows key
gcloud iam service-accounts keys create keys/workflows-key.json \
    --iam-account=$WORKFLOW_SA

# Secure keys
chmod 600 keys/*.json

# Set environment variable for local testing
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/keys/orchestrator-key.json"
```

### 4.5 Configure Workload Identity (for GKE deployments)

If deploying to Google Kubernetes Engine:

```bash
# Create GKE cluster with Workload Identity
gcloud container clusters create bmad-cluster \
    --region=$REGION \
    --workload-pool=$PROJECT_ID.svc.id.goog \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=10

# Create Kubernetes service accounts
kubectl create serviceaccount bmad-orchestrator-ksa -n bmad
kubectl create serviceaccount bmad-agents-ksa -n bmad
kubectl create serviceaccount bmad-workflows-ksa -n bmad

# Bind K8s SA to GCP SA
gcloud iam service-accounts add-iam-policy-binding $ORCHESTRATOR_SA \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:$PROJECT_ID.svc.id.goog[bmad/bmad-orchestrator-ksa]"

gcloud iam service-accounts add-iam-policy-binding $AGENT_SA \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:$PROJECT_ID.svc.id.goog[bmad/bmad-agents-ksa]"

gcloud iam service-accounts add-iam-policy-binding $WORKFLOW_SA \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:$PROJECT_ID.svc.id.goog[bmad/bmad-workflows-ksa]"

# Annotate K8s service accounts
kubectl annotate serviceaccount bmad-orchestrator-ksa \
    iam.gke.io/gcp-service-account=$ORCHESTRATOR_SA \
    -n bmad

kubectl annotate serviceaccount bmad-agents-ksa \
    iam.gke.io/gcp-service-account=$AGENT_SA \
    -n bmad

kubectl annotate serviceaccount bmad-workflows-ksa \
    iam.gke.io/gcp-service-account=$WORKFLOW_SA \
    -n bmad
```

### 4.6 Verify Service Account Configuration

```bash
# List all service accounts
gcloud iam service-accounts list

# Check IAM bindings for each SA
gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --format="table(bindings.role)" \
    --filter="bindings.members:serviceAccount:bmad-orchestrator@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --format="table(bindings.role)" \
    --filter="bindings.members:serviceAccount:bmad-agents@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --format="table(bindings.role)" \
    --filter="bindings.members:serviceAccount:bmad-workflows@${PROJECT_ID}.iam.gserviceaccount.com"
```

### 4.7 Update Environment Configuration

```bash
# Update .env file
cat >> .env <<EOF

# Service Accounts
ORCHESTRATOR_SA=$ORCHESTRATOR_SA
AGENT_SA=$AGENT_SA
WORKFLOW_SA=$WORKFLOW_SA
EOF

# Source updated environment
source .env
```

---

## 5. Vertex AI Setup

### 5.1 Enable Vertex AI API

```bash
# Enable Vertex AI API (if not already done in section 3.2)
gcloud services enable aiplatform.googleapis.com

# Verify API is enabled
gcloud services list --enabled | grep aiplatform
```

### 5.2 Configure Vertex AI Location

```bash
# Set Vertex AI location (us-central1 recommended for Agent Builder)
export VERTEX_AI_LOCATION="us-central1"

# Verify available locations
gcloud ai-platform locations list
```

### 5.3 Initialize Vertex AI SDK

Create `scripts/init_vertex_ai.py`:

```python
#!/usr/bin/env python3
"""Initialize Vertex AI for BMad deployment."""

import os
from google.cloud import aiplatform

def init_vertex_ai():
    """Initialize Vertex AI with project configuration."""
    project_id = os.environ.get('PROJECT_ID')
    location = os.environ.get('VERTEX_AI_LOCATION', 'us-central1')

    if not project_id:
        raise ValueError("PROJECT_ID environment variable not set")

    # Initialize Vertex AI
    aiplatform.init(
        project=project_id,
        location=location,
    )

    print(f"✓ Vertex AI initialized")
    print(f"  Project: {project_id}")
    print(f"  Location: {location}")

    # Verify initialization
    try:
        # List any existing models (should work if properly configured)
        models = aiplatform.Model.list(limit=1)
        print(f"✓ Vertex AI API accessible")
    except Exception as e:
        print(f"✗ Vertex AI API test failed: {e}")
        return False

    return True

if __name__ == "__main__":
    success = init_vertex_ai()
    exit(0 if success else 1)
```

```bash
# Run initialization script
python scripts/init_vertex_ai.py
```

### 5.4 Create Staging Bucket for Vertex AI

```bash
# Create staging bucket for Vertex AI artifacts
export STAGING_BUCKET="bmad-vertex-ai-staging"

gsutil mb -p $PROJECT_ID \
    -c STANDARD \
    -l $REGION \
    gs://$STAGING_BUCKET

# Set lifecycle policy (delete temporary files after 30 days)
cat > lifecycle.json <<EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 30}
      }
    ]
  }
}
EOF

gsutil lifecycle set lifecycle.json gs://$STAGING_BUCKET
rm lifecycle.json

# Update environment
echo "STAGING_BUCKET=$STAGING_BUCKET" >> .env
```

### 5.5 Configure Model Garden Access (Optional)

If using Gemini models from Model Garden:

```bash
# Grant service accounts access to Model Garden
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$AGENT_SA" \
    --role="roles/aiplatform.user"

# Verify model availability
gcloud ai models list \
    --region=$VERTEX_AI_LOCATION \
    --filter="displayName:gemini*"
```

### 5.6 Set Up Vertex AI Agent Builder

Vertex AI Agent Builder is used for hosting the 10 BMad agents. Configure the service:

```bash
# Enable Vertex AI Agent Builder API (part of aiplatform.googleapis.com)
# Already enabled in section 3.2

# Create directory for agent builder configs
mkdir -p vertex-ai-agent-builder

# Verify Agent Builder is accessible
gcloud alpha ai agent-builder list --location=$VERTEX_AI_LOCATION 2>/dev/null || \
    echo "Agent Builder may require allowlist access. Contact Google Cloud support if needed."
```

**Note**: Vertex AI Agent Builder may require allowlist access during preview. Contact Google Cloud support to enable for your project.

### 5.7 Configure Vertex AI Search (for KB Mode)

KB Mode uses Vertex AI Search for RAG (Retrieval-Augmented Generation):

```bash
# Enable Discovery Engine API (Vertex AI Search)
gcloud services enable discoveryengine.googleapis.com

# Verify API is enabled
gcloud services list --enabled | grep discoveryengine

# Create search datastore (will be configured later with KB documents)
# This step will be completed in section 10 (Configuration Management)
```

### 5.8 Vertex AI Quotas and Limits

Check and request quota increases if needed:

```bash
# Check current Vertex AI quotas
gcloud compute project-info describe --project=$PROJECT_ID

# View Vertex AI specific quotas
# Navigation: Console > IAM & Admin > Quotas
# Filter: Service = "Vertex AI API"

# Request quota increase if needed:
# https://cloud.google.com/vertex-ai/docs/quotas
```

**Recommended Quotas**:
- **Online prediction requests per minute**: 6000 (100 req/min per agent × 10 agents × 6 for burst)
- **Model training nodes**: 10 (not typically needed for BMad)
- **Reasoning Engine deployments**: 10 (one per workflow + buffer)

---

## 6. Storage Configuration

### 6.1 Firestore Setup

#### 6.1.1 Create Firestore Database

```bash
# Create Firestore database in Native mode
gcloud firestore databases create \
    --location=$REGION \
    --type=firestore-native

# Verify database creation
gcloud firestore databases list

# Update environment
echo "FIRESTORE_DATABASE=(default)" >> .env
```

#### 6.1.2 Create Firestore Indexes

Firestore requires composite indexes for complex queries. Create `firestore-indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "stories",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "priority", "order": "ASCENDING"},
        {"fieldPath": "created_at", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "stories",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "epic_id", "order": "ASCENDING"},
        {"fieldPath": "story_id", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "gates",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "decision", "order": "ASCENDING"},
        {"fieldPath": "created_at", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "artifacts",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "type", "order": "ASCENDING"},
        {"fieldPath": "version", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "workflows",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "updated_at", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "sessions",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "agent_id", "order": "ASCENDING"},
        {"fieldPath": "last_activity_at", "order": "DESCENDING"}
      ]
    }
  ],
  "fieldOverrides": []
}
```

Deploy indexes:

```bash
# Deploy Firestore indexes
gcloud firestore indexes composite create --database=(default) --file=firestore-indexes.json

# Monitor index creation (can take several minutes)
gcloud firestore indexes composite list --database=(default)
```

#### 6.1.3 Configure Firestore Security Rules

Create `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isBMadServiceAccount() {
      return request.auth.token.email.matches('bmad-.*@' + request.project + '.iam.gserviceaccount.com');
    }

    function isProjectMember(projectId) {
      return isAuthenticated() &&
        (isBMadServiceAccount() ||
         request.auth.uid in get(/databases/$(database)/documents/projects/$(projectId)).data.members);
    }

    // Projects collection
    match /projects/{projectId} {
      allow read: if isProjectMember(projectId);
      allow create: if isAuthenticated();
      allow update, delete: if isProjectMember(projectId);

      // Subcollections
      match /stories/{storyId} {
        allow read, write: if isProjectMember(projectId);
      }

      match /artifacts/{artifactId} {
        allow read, write: if isProjectMember(projectId);
      }

      match /gates/{gateId} {
        allow read, write: if isProjectMember(projectId);
      }

      match /sessions/{sessionId} {
        allow read, write: if isProjectMember(projectId);
      }
    }

    // Workflows collection (global)
    match /workflows/{workflowId} {
      allow read, write: if isBMadServiceAccount();

      match /steps/{stepId} {
        allow read, write: if isBMadServiceAccount();
      }
    }

    // Agents collection (global, monitoring only)
    match /agents/{agentId} {
      allow read: if isAuthenticated();
      allow write: if isBMadServiceAccount();
    }

    // System collection (admin only)
    match /system/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isBMadServiceAccount();
    }
  }
}
```

Deploy security rules:

```bash
# Deploy Firestore security rules
gcloud firestore databases update --database=(default) --file=firestore.rules

# Verify rules deployment
gcloud firestore databases describe --database=(default)
```

### 6.2 Cloud Storage Setup

#### 6.2.1 Create Storage Buckets

```bash
# Bucket names must be globally unique - adjust if needed
export TEMPLATES_BUCKET="${PROJECT_ID}-bmad-templates"
export DATA_BUCKET="${PROJECT_ID}-bmad-data"
export ARTIFACTS_BUCKET="${PROJECT_ID}-bmad-artifacts"
export KB_BUCKET="${PROJECT_ID}-bmad-kb"

# Create templates bucket
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$TEMPLATES_BUCKET

# Create data bucket (checklists, workflows, prompts)
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$DATA_BUCKET

# Create artifacts bucket (user-generated PRDs, stories, etc.)
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$ARTIFACTS_BUCKET

# Create KB bucket (knowledge base documents)
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$KB_BUCKET

# Verify bucket creation
gsutil ls -p $PROJECT_ID
```

#### 6.2.2 Configure Bucket Versioning and Lifecycle

```bash
# Enable versioning on artifacts bucket (important for audit trail)
gsutil versioning set on gs://$ARTIFACTS_BUCKET

# Set lifecycle policies for artifact bucket
cat > artifacts-lifecycle.json <<EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {
          "age": 90,
          "matchesPrefix": ["projects/"]
        }
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {
          "age": 365,
          "matchesPrefix": ["projects/"]
        }
      }
    ]
  }
}
EOF

gsutil lifecycle set artifacts-lifecycle.json gs://$ARTIFACTS_BUCKET
rm artifacts-lifecycle.json

# Set lifecycle policy for KB bucket (delete old versions)
cat > kb-lifecycle.json <<EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {
          "numNewerVersions": 3,
          "isLive": false
        }
      }
    ]
  }
}
EOF

gsutil versioning set on gs://$KB_BUCKET
gsutil lifecycle set kb-lifecycle.json gs://$KB_BUCKET
rm kb-lifecycle.json
```

#### 6.2.3 Configure Bucket IAM Policies

```bash
# Templates bucket: Read-only for agents/workflows
gsutil iam ch serviceAccount:$AGENT_SA:objectViewer gs://$TEMPLATES_BUCKET
gsutil iam ch serviceAccount:$WORKFLOW_SA:objectViewer gs://$TEMPLATES_BUCKET

# Data bucket: Read-only for agents/workflows
gsutil iam ch serviceAccount:$AGENT_SA:objectViewer gs://$DATA_BUCKET
gsutil iam ch serviceAccount:$WORKFLOW_SA:objectViewer gs://$DATA_BUCKET

# Artifacts bucket: Read/write for agents/workflows
gsutil iam ch serviceAccount:$AGENT_SA:objectAdmin gs://$ARTIFACTS_BUCKET
gsutil iam ch serviceAccount:$WORKFLOW_SA:objectAdmin gs://$ARTIFACTS_BUCKET
gsutil iam ch serviceAccount:$ORCHESTRATOR_SA:objectViewer gs://$ARTIFACTS_BUCKET

# KB bucket: Read-only for agents
gsutil iam ch serviceAccount:$AGENT_SA:objectViewer gs://$KB_BUCKET
```

#### 6.2.4 Upload Initial Framework Data

```bash
# Create directory structure
mkdir -p bmad-data/{templates,tasks,checklists,workflows,data}

# Upload templates (assuming you have them locally)
# Copy your 13 YAML templates to bmad-data/templates/
gsutil -m cp bmad-data/templates/*.yaml gs://$TEMPLATES_BUCKET/templates/

# Upload task definitions
gsutil -m cp bmad-data/tasks/*.md gs://$DATA_BUCKET/tasks/

# Upload checklists
gsutil -m cp bmad-data/checklists/*.yaml gs://$DATA_BUCKET/checklists/

# Upload workflow definitions
gsutil -m cp bmad-data/workflows/*.yaml gs://$DATA_BUCKET/workflows/

# Upload data files (technical-preferences.md, etc.)
gsutil -m cp bmad-data/data/*.md gs://$DATA_BUCKET/data/

# Verify uploads
gsutil ls -r gs://$TEMPLATES_BUCKET
gsutil ls -r gs://$DATA_BUCKET
```

#### 6.2.5 Create Bucket Directory Structure

```bash
# Create standard directory structure in artifacts bucket
gsutil -m mkdir gs://$ARTIFACTS_BUCKET/projects/

# The following structure will be created automatically by the system:
# projects/{project-id}/
#   ├── prd/
#   ├── architecture/
#   ├── frontend-spec/
#   ├── stories/
#   └── qa/
#       ├── gates/
#       └── assessments/
```

#### 6.2.6 Configure CORS (if web UI will access directly)

If your web UI needs direct access to Cloud Storage:

```bash
cat > cors-config.json <<EOF
[
  {
    "origin": ["https://your-bmad-ui.com", "http://localhost:3000"],
    "method": ["GET", "PUT", "POST"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set cors-config.json gs://$ARTIFACTS_BUCKET
rm cors-config.json
```

### 6.3 Update Environment Configuration

```bash
# Add storage configuration to .env
cat >> .env <<EOF

# Cloud Storage Buckets
TEMPLATES_BUCKET=$TEMPLATES_BUCKET
DATA_BUCKET=$DATA_BUCKET
ARTIFACTS_BUCKET=$ARTIFACTS_BUCKET
KB_BUCKET=$KB_BUCKET
STAGING_BUCKET=$STAGING_BUCKET
EOF

# Source updated environment
source .env
```

### 6.4 Verify Storage Configuration

Create `scripts/verify_storage.py`:

```python
#!/usr/bin/env python3
"""Verify storage configuration."""

import os
from google.cloud import firestore, storage

def verify_firestore():
    """Verify Firestore is accessible."""
    print("Checking Firestore...")
    try:
        db = firestore.Client()
        # Try to read system collection (will create if doesn't exist)
        system_ref = db.collection('system').document('config')
        system_ref.set({'initialized': True, 'version': '1.0'}, merge=True)
        print("✓ Firestore accessible")
        return True
    except Exception as e:
        print(f"✗ Firestore error: {e}")
        return False

def verify_buckets():
    """Verify Cloud Storage buckets are accessible."""
    print("\nChecking Cloud Storage...")
    client = storage.Client()

    buckets = [
        os.environ.get('TEMPLATES_BUCKET'),
        os.environ.get('DATA_BUCKET'),
        os.environ.get('ARTIFACTS_BUCKET'),
        os.environ.get('KB_BUCKET'),
    ]

    all_ok = True
    for bucket_name in buckets:
        if not bucket_name:
            continue
        try:
            bucket = client.bucket(bucket_name)
            bucket.reload()  # Verify exists
            print(f"✓ {bucket_name}")
        except Exception as e:
            print(f"✗ {bucket_name}: {e}")
            all_ok = False

    return all_ok

if __name__ == "__main__":
    firestore_ok = verify_firestore()
    storage_ok = verify_buckets()

    if firestore_ok and storage_ok:
        print("\n✓ All storage services configured correctly")
        exit(0)
    else:
        print("\n✗ Some storage services have errors")
        exit(1)
```

```bash
# Run verification
python scripts/verify_storage.py
```

---

## 7. Agent Deployment

### 7.1 Agent Deployment Overview

BMad includes 10 specialized agents that must be deployed to Vertex AI Agent Builder:

| Agent | ID | Primary Function | Complexity |
|-------|----|--------------------|------------|
| Analyst (Mary) | analyst | Research & Discovery | Medium |
| PM (John) | pm | Product Strategy | High |
| UX Expert (Sally) | ux-expert | User Experience | Medium |
| Architect (Winston) | architect | System Design | High |
| PO (Sarah) | po | Validation & Process | Medium |
| SM (Bob) | sm | Story Creation | High |
| Dev (James) | dev | Implementation | High |
| QA (Quinn) | qa | Test Architect | High |
| BMad-Master | bmad-master | Universal Executor | Medium |
| BMad-Orchestrator | bmad-orchestrator | Web Platform | High |

### 7.2 Prepare Agent Configurations

Agent configurations should already be created in `agent-configurations/` directory. See [agent-configurations/](agent-configurations/) for complete specifications.

```bash
# Verify agent configurations exist
ls -la agent-configurations/

# Expected files:
# analyst.yaml
# pm.yaml
# ux-expert.yaml
# architect.yaml
# po.yaml
# sm.yaml
# dev.yaml
# qa.yaml
# bmad-master.yaml
# bmad-orchestrator.yaml
```

### 7.3 Deploy Agents to Vertex AI

#### 7.3.1 Create Agent Deployment Script

Create `scripts/deploy_agent.py`:

```python
#!/usr/bin/env python3
"""Deploy a BMad agent to Vertex AI Agent Builder."""

import os
import sys
import yaml
from google.cloud import aiplatform

def deploy_agent(agent_config_path: str):
    """Deploy an agent from YAML configuration."""

    # Load agent configuration
    with open(agent_config_path, 'r') as f:
        config = yaml.safe_load(f)

    agent_id = config['metadata']['id']
    agent_name = config['metadata']['name']

    print(f"Deploying {agent_name} ({agent_id})...")

    # Initialize Vertex AI
    project_id = os.environ.get('PROJECT_ID')
    location = os.environ.get('VERTEX_AI_LOCATION', 'us-central1')

    aiplatform.init(project=project_id, location=location)

    # Prepare agent configuration for Vertex AI
    # Note: This is a simplified example. Actual implementation
    # will depend on Vertex AI Agent Builder API specifics.

    try:
        # Create or update agent
        # (Vertex AI Agent Builder API calls would go here)

        print(f"✓ {agent_name} deployed successfully")
        print(f"  Agent ID: {agent_id}")
        print(f"  Endpoint: projects/{project_id}/locations/{location}/agents/{agent_id}")

        return True

    except Exception as e:
        print(f"✗ Failed to deploy {agent_name}: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: deploy_agent.py <agent_config.yaml>")
        sys.exit(1)

    success = deploy_agent(sys.argv[1])
    sys.exit(0 if success else 1)
```

#### 7.3.2 Deploy All Agents

```bash
# Make deployment script executable
chmod +x scripts/deploy_agent.py

# Deploy each agent
for agent in analyst pm ux-expert architect po sm dev qa bmad-master bmad-orchestrator; do
    echo "Deploying $agent..."
    python scripts/deploy_agent.py agent-configurations/${agent}.yaml
    echo ""
done
```

**Note**: The actual deployment to Vertex AI Agent Builder will depend on the specific API. The above is a template. Vertex AI Agent Builder may use REST API, gcloud commands, or Python SDK. Update the script based on official documentation.

### 7.4 Verify Agent Deployment

```bash
# List deployed agents
gcloud ai agents list --location=$VERTEX_AI_LOCATION

# Test agent invocation (example for PM agent)
gcloud ai agents invoke pm-agent \
    --location=$VERTEX_AI_LOCATION \
    --request='{"message": "Test connection"}'
```

### 7.5 Agent Configuration Management

Store agent endpoint URLs:

```bash
# Create agent endpoints file
cat > agent-endpoints.json <<EOF
{
  "analyst": "projects/$PROJECT_ID/locations/$VERTEX_AI_LOCATION/agents/analyst",
  "pm": "projects/$PROJECT_ID/locations/$VERTEX_AI_LOCATION/agents/pm",
  "ux-expert": "projects/$PROJECT_ID/locations/$VERTEX_AI_LOCATION/agents/ux-expert",
  "architect": "projects/$PROJECT_ID/locations/$VERTEX_AI_LOCATION/agents/architect",
  "po": "projects/$PROJECT_ID/locations/$VERTEX_AI_LOCATION/agents/po",
  "sm": "projects/$PROJECT_ID/locations/$VERTEX_AI_LOCATION/agents/sm",
  "dev": "projects/$PROJECT_ID/locations/$VERTEX_AI_LOCATION/agents/dev",
  "qa": "projects/$PROJECT_ID/locations/$VERTEX_AI_LOCATION/agents/qa",
  "bmad-master": "projects/$PROJECT_ID/locations/$VERTEX_AI_LOCATION/agents/bmad-master",
  "bmad-orchestrator": "projects/$PROJECT_ID/locations/$VERTEX_AI_LOCATION/agents/bmad-orchestrator"
}
EOF

# Upload to Firestore for runtime access
python - <<EOF
from google.cloud import firestore
import json

db = firestore.Client()
with open('agent-endpoints.json', 'r') as f:
    endpoints = json.load(f)

db.collection('system').document('agent-endpoints').set(endpoints)
print("✓ Agent endpoints stored in Firestore")
EOF
```

---

## 8. Workflow Deployment

### 8.1 Workflow Deployment Overview

Deploy 8 Reasoning Engine workflows to Vertex AI:

| Workflow | Complexity | Avg Duration | Purpose |
|----------|-----------|--------------|---------|
| create-next-story | High | 30-60s | 6-step story creation |
| review-story | High | 60-120s | Comprehensive QA review |
| risk-profile | Medium | 20-40s | Risk assessment |
| test-design | Medium-High | 30-60s | Test scenario generation |
| apply-qa-fixes | Medium | 60-180s | QA fix application |
| validate-next-story | Low-Medium | 15-30s | Story validation |
| execute-checklist | Medium | 20-40s | Checklist execution |
| shard-doc | High | 40-80s | Document sharding |

### 8.2 Prepare Workflow Code

Workflow implementations should be in `reasoning-engine-workflows/` directory. See [reasoning-engine-workflows/README.md](reasoning-engine-workflows/README.md) for details.

```bash
# Verify workflow code exists
ls -la reasoning-engine-workflows/

# Expected files:
# create-next-story.py
# review-story.py
# risk-profile.py
# test-design.py
# apply-qa-fixes.py
# validate-next-story.py
# execute-checklist.py
# shard-doc.py
# README.md
```

### 8.3 Deploy Workflows to Reasoning Engine

#### 8.3.1 Create Workflow Deployment Script

Create `scripts/deploy_workflow.py`:

```python
#!/usr/bin/env python3
"""Deploy a workflow to Vertex AI Reasoning Engine."""

import os
import sys
from google.cloud import aiplatform

def deploy_workflow(workflow_module: str, workflow_class: str):
    """Deploy a workflow to Reasoning Engine."""

    project_id = os.environ.get('PROJECT_ID')
    location = os.environ.get('VERTEX_AI_LOCATION', 'us-central1')
    staging_bucket = os.environ.get('STAGING_BUCKET')
    workflow_sa = os.environ.get('WORKFLOW_SA')

    print(f"Deploying workflow: {workflow_class}")
    print(f"  Module: {workflow_module}")
    print(f"  Location: {location}")

    # Initialize Vertex AI
    aiplatform.init(
        project=project_id,
        location=location,
        staging_bucket=f"gs://{staging_bucket}"
    )

    try:
        # Import workflow class dynamically
        import importlib
        module = importlib.import_module(workflow_module)
        WorkflowClass = getattr(module, workflow_class)

        # Create Reasoning Engine application
        reasoning_app = aiplatform.ReasoningEngine(
            requirements=[
                'google-adk',
                'google-cloud-firestore',
                'google-cloud-storage',
                'google-cloud-aiplatform',
                'pyyaml',
            ],
            reasoning_engine=WorkflowClass,
        )

        # Deploy
        deployment = reasoning_app.deploy(
            display_name=f"bmad-{workflow_module.replace('_', '-')}",
            service_account=workflow_sa,
        )

        print(f"✓ Workflow deployed successfully")
        print(f"  Resource Name: {deployment.resource_name}")
        print(f"  Endpoint: {deployment.endpoint}")

        return deployment

    except Exception as e:
        print(f"✗ Deployment failed: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: deploy_workflow.py <module> <class>")
        print("Example: deploy_workflow.py create_next_story CreateNextStoryWorkflow")
        sys.exit(1)

    workflow_module = sys.argv[1]
    workflow_class = sys.argv[2]

    deployment = deploy_workflow(workflow_module, workflow_class)
    sys.exit(0 if deployment else 1)
```

#### 8.3.2 Deploy All Workflows

```bash
# Make deployment script executable
chmod +x scripts/deploy_workflow.py

# Add reasoning-engine-workflows to Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)/reasoning-engine-workflows"

# Deploy each workflow
python scripts/deploy_workflow.py create_next_story CreateNextStoryWorkflow
python scripts/deploy_workflow.py review_story ReviewStoryWorkflow
python scripts/deploy_workflow.py risk_profile RiskProfileWorkflow
python scripts/deploy_workflow.py test_design TestDesignWorkflow
python scripts/deploy_workflow.py apply_qa_fixes ApplyQAFixesWorkflow
python scripts/deploy_workflow.py validate_next_story ValidateNextStoryWorkflow
python scripts/deploy_workflow.py execute_checklist ExecuteChecklistWorkflow
python scripts/deploy_workflow.py shard_doc ShardDocWorkflow
```

### 8.4 Store Workflow Endpoints

```bash
# Store workflow endpoints in Firestore
python - <<EOF
from google.cloud import firestore, aiplatform
import os

project_id = os.environ.get('PROJECT_ID')
location = os.environ.get('VERTEX_AI_LOCATION', 'us-central1')

aiplatform.init(project=project_id, location=location)

# List deployed Reasoning Engines
endpoints = {}
for engine in aiplatform.ReasoningEngine.list():
    if 'bmad-' in engine.display_name:
        workflow_name = engine.display_name.replace('bmad-', '').replace('-', '_')
        endpoints[workflow_name] = engine.resource_name

# Store in Firestore
db = firestore.Client()
db.collection('system').document('workflow-endpoints').set(endpoints)

print("✓ Workflow endpoints stored:")
for name, endpoint in endpoints.items():
    print(f"  {name}: {endpoint}")
EOF
```

### 8.5 Verify Workflow Deployment

```bash
# List deployed Reasoning Engines
gcloud ai reasoning-engines list --location=$VERTEX_AI_LOCATION

# Test workflow invocation (example: risk-profile)
python - <<EOF
from google.cloud import aiplatform
import os

project_id = os.environ.get('PROJECT_ID')
location = os.environ.get('VERTEX_AI_LOCATION', 'us-central1')

aiplatform.init(project=project_id, location=location)

# Find risk-profile workflow
workflows = [w for w in aiplatform.ReasoningEngine.list() if 'risk-profile' in w.display_name]
if workflows:
    workflow = workflows[0]
    print(f"Testing workflow: {workflow.display_name}")

    # Test invocation would go here
    # result = workflow.query(...)

    print("✓ Workflow is accessible")
else:
    print("✗ risk-profile workflow not found")
EOF
```

---

## 9. API Deployment

### 9.1 API Services Overview

BMad requires three Cloud Run services:

| Service | Purpose | Responsibilities |
|---------|---------|------------------|
| **Orchestrator Service** | Main entry point | Agent routing, workflow coordination, session management |
| **Agent Gateway** | Agent invocation | Proxy to Vertex AI agents, context management |
| **Workflow Gateway** | Workflow execution | Reasoning Engine invocation, state management |

### 9.2 Build and Deploy Orchestrator Service

#### 9.2.1 Create Orchestrator Service

Create `services/orchestrator/main.py`:

```python
"""BMad Orchestrator Service - Main entry point for BMad API."""

from flask import Flask, request, jsonify
from google.cloud import firestore
import os

app = Flask(__name__)
db = firestore.Client()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'service': 'orchestrator'}), 200

@app.route('/v1/projects/<project_id>/agents/<agent_id>/invoke', methods=['POST'])
def invoke_agent(project_id, agent_id):
    """Invoke a BMad agent."""
    data = request.get_json()

    # TODO: Implement agent invocation logic
    # 1. Load agent endpoint from Firestore
    # 2. Forward request to Vertex AI agent
    # 3. Return response

    return jsonify({
        'status': 'success',
        'agent': agent_id,
        'project': project_id,
        'message': 'Agent invocation endpoint'
    }), 200

@app.route('/v1/projects/<project_id>/workflows/<workflow_id>/start', methods=['POST'])
def start_workflow(project_id, workflow_id):
    """Start a workflow."""
    data = request.get_json()

    # TODO: Implement workflow start logic
    # 1. Load workflow endpoint from Firestore
    # 2. Initialize workflow state
    # 3. Invoke Reasoning Engine
    # 4. Return workflow execution ID

    return jsonify({
        'status': 'started',
        'workflow': workflow_id,
        'project': project_id,
        'execution_id': 'exec-12345'
    }), 202

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
```

Create `services/orchestrator/requirements.txt`:

```
flask==3.0.0
google-cloud-firestore==2.13.1
google-cloud-storage==2.14.0
google-cloud-aiplatform==1.38.1
gunicorn==21.2.0
```

Create `services/orchestrator/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
```

#### 9.2.2 Deploy Orchestrator to Cloud Run

```bash
# Build and deploy orchestrator service
cd services/orchestrator

# Build container image
gcloud builds submit --tag gcr.io/$PROJECT_ID/bmad-orchestrator:latest

# Deploy to Cloud Run
gcloud run deploy bmad-orchestrator \
    --image gcr.io/$PROJECT_ID/bmad-orchestrator:latest \
    --platform managed \
    --region $REGION \
    --service-account $ORCHESTRATOR_SA \
    --set-env-vars PROJECT_ID=$PROJECT_ID,VERTEX_AI_LOCATION=$VERTEX_AI_LOCATION \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --timeout 300 \
    --max-instances 10

# Get service URL
ORCHESTRATOR_URL=$(gcloud run services describe bmad-orchestrator \
    --region $REGION \
    --format 'value(status.url)')

echo "Orchestrator deployed at: $ORCHESTRATOR_URL"
echo "ORCHESTRATOR_URL=$ORCHESTRATOR_URL" >> ../../.env

cd ../..
```

### 9.3 Deploy Agent Gateway Service

(Similar structure to Orchestrator - create `services/agent-gateway/` with appropriate code)

```bash
# Deploy agent gateway
gcloud run deploy bmad-agent-gateway \
    --image gcr.io/$PROJECT_ID/bmad-agent-gateway:latest \
    --platform managed \
    --region $REGION \
    --service-account $AGENT_SA \
    --set-env-vars PROJECT_ID=$PROJECT_ID,VERTEX_AI_LOCATION=$VERTEX_AI_LOCATION \
    --memory 256Mi \
    --cpu 1 \
    --timeout 60 \
    --max-instances 20
```

### 9.4 Deploy Workflow Gateway Service

```bash
# Deploy workflow gateway
gcloud run deploy bmad-workflow-gateway \
    --image gcr.io/$PROJECT_ID/bmad-workflow-gateway:latest \
    --platform managed \
    --region $REGION \
    --service-account $WORKFLOW_SA \
    --set-env-vars PROJECT_ID=$PROJECT_ID,VERTEX_AI_LOCATION=$VERTEX_AI_LOCATION \
    --memory 512Mi \
    --cpu 2 \
    --timeout 600 \
    --max-instances 10
```

### 9.5 Configure API Authentication

```bash
# Create API key for testing
gcloud alpha services api-keys create bmad-api-test-key \
    --display-name="BMad API Test Key"

# Get API key value
gcloud alpha services api-keys list --filter="displayName:BMad API Test Key"

# For production, use OAuth 2.0 and Identity Platform
# See api-specifications.md for complete authentication setup
```

---

## 10. Configuration Management

### 10.1 Load Framework Templates

```bash
# Upload all 13 templates to Cloud Storage
# Templates should be in bmad-data/templates/ directory

gsutil -m cp agent-configurations/../templates/*.yaml gs://$TEMPLATES_BUCKET/templates/

# Verify upload
gsutil ls gs://$TEMPLATES_BUCKET/templates/

# Expected files:
# - project-brief-tmpl.yaml
# - prd-tmpl.yaml
# - brownfield-prd-tmpl.yaml
# - market-research-tmpl.yaml
# - competitor-analysis-tmpl.yaml
# - brainstorming-output-tmpl.yaml
# - architecture-tmpl.yaml
# - fullstack-architecture-tmpl.yaml
# - brownfield-architecture-tmpl.yaml
# - front-end-architecture-tmpl.yaml
# - front-end-spec-tmpl.yaml
# - story-tmpl.yaml
# - qa-gate-tmpl.yaml
```

### 10.2 Configure System Settings

```python
# Store system configuration in Firestore
python - <<EOF
from google.cloud import firestore

db = firestore.Client()

system_config = {
    'version': '1.0.0',
    'framework': 'bmad-core-v4',
    'deployment_date': firestore.SERVER_TIMESTAMP,
    'templates_bucket': '$TEMPLATES_BUCKET',
    'data_bucket': '$DATA_BUCKET',
    'artifacts_bucket': '$ARTIFACTS_BUCKET',
    'kb_bucket': '$KB_BUCKET',
    'vertex_ai_location': '$VERTEX_AI_LOCATION',
    'agents': {
        'count': 10,
        'service_account': '$AGENT_SA'
    },
    'workflows': {
        'count': 8,
        'service_account': '$WORKFLOW_SA'
    },
    'features': {
        'kb_mode': True,
        'team_bundles': True,
        'workflow_resumability': True,
        'artifact_versioning': True
    }
}

db.collection('system').document('config').set(system_config)
print("✓ System configuration stored")
EOF
```

### 10.3 Initialize KB Mode (Optional)

If using KB Mode for knowledge base retrieval:

```bash
# Upload knowledge base documents
gsutil -m cp -r kb-documents/* gs://$KB_BUCKET/kb/

# Configure Vertex AI Search datastore
gcloud alpha discovery-engine data-stores create bmad-kb-datastore \
    --location=global \
    --industry-vertical=GENERIC \
    --solution-type=SOLUTION_TYPE_SEARCH \
    --content-config=CONTENT_REQUIRED

# Import documents into datastore
# (Follow Vertex AI Search documentation for data import)
```

---

## 11. Monitoring and Logging

### 11.1 Configure Cloud Logging

```bash
# Create log sink for BMad logs
gcloud logging sinks create bmad-logs-sink \
    bigquery.googleapis.com/projects/$PROJECT_ID/datasets/bmad_logs \
    --log-filter='resource.type="cloud_run_revision" AND resource.labels.service_name=~"bmad-.*"'

# Create dataset for logs (if needed)
bq mk --dataset --location=$REGION bmad_logs
```

### 11.2 Create Monitoring Dashboards

Create `monitoring/dashboard.json`:

```json
{
  "displayName": "BMad Platform Dashboard",
  "dashboardFilters": [],
  "mosaicLayout": {
    "columns": 12,
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Agent Invocations (per minute)",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"aiplatform.googleapis.com/Agent\"",
                  "aggregation": {
                    "perSeriesAligner": "ALIGN_RATE"
                  }
                }
              }
            }]
          }
        }
      }
    ]
  }
}
```

Deploy dashboard:

```bash
gcloud monitoring dashboards create --config-from-file=monitoring/dashboard.json
```

### 11.3 Configure Alerts

```bash
# Create alert for high error rate
gcloud alpha monitoring policies create \
    --notification-channels=CHANNEL_ID \
    --display-name="BMad High Error Rate" \
    --condition-display-name="Error rate > 5%" \
    --condition-threshold-value=0.05 \
    --condition-threshold-duration=300s
```

---

## 12. Testing and Validation

### 12.1 Health Check Tests

```bash
# Test orchestrator health
curl $ORCHESTRATOR_URL/health

# Expected: {"status": "healthy", "service": "orchestrator"}
```

### 12.2 End-to-End Test

Create `scripts/e2e_test.py`:

```python
#!/usr/bin/env python3
"""End-to-end test for BMad deployment."""

import requests
import os

def test_create_project():
    """Test project creation."""
    orchestrator_url = os.environ.get('ORCHESTRATOR_URL')

    response = requests.post(
        f"{orchestrator_url}/v1/projects",
        json={
            "name": "Test Project",
            "type": "greenfield",
            "workflow": "fullstack"
        }
    )

    assert response.status_code == 201
    project_id = response.json()['project_id']
    print(f"✓ Project created: {project_id}")
    return project_id

def test_invoke_agent(project_id):
    """Test agent invocation."""
    orchestrator_url = os.environ.get('ORCHESTRATOR_URL')

    response = requests.post(
        f"{orchestrator_url}/v1/projects/{project_id}/agents/pm/invoke",
        json={
            "command": "create_prd",
            "parameters": {"mode": "interactive"}
        }
    )

    assert response.status_code == 200
    print(f"✓ Agent invoked successfully")

if __name__ == "__main__":
    try:
        project_id = test_create_project()
        test_invoke_agent(project_id)
        print("\n✓ All tests passed")
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        exit(1)
```

```bash
# Run E2E test
python scripts/e2e_test.py
```

---

## 13. Production Deployment

### 13.1 Production Hardening Checklist

- [ ] Remove test API keys
- [ ] Configure OAuth 2.0 for production
- [ ] Enable Cloud Armor (DDoS protection)
- [ ] Configure custom domain with SSL
- [ ] Set up backup and disaster recovery
- [ ] Configure rate limiting
- [ ] Review and tighten IAM permissions
- [ ] Enable audit logging
- [ ] Set up cost budgets and alerts
- [ ] Configure uptime checks
- [ ] Document runbooks

### 13.2 Backup Configuration

```bash
# Configure automated Firestore backups
gcloud firestore backups schedules create \
    --database='(default)' \
    --retention=30d \
    --recurrence=daily

# Configure Cloud Storage bucket backups
gsutil versioning set on gs://$ARTIFACTS_BUCKET
```

### 13.3 Production Deployment Approval

Final checklist before declaring production-ready:

- [ ] All agents deployed and tested
- [ ] All workflows deployed and tested
- [ ] API services deployed with authentication
- [ ] Storage configured with proper permissions
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery tested
- [ ] Documentation complete
- [ ] Stakeholder approval obtained

---

## 14. Troubleshooting

### 14.1 Common Issues

#### Issue: Agent deployment fails

**Symptoms**: Error during agent deployment to Vertex AI

**Solutions**:
1. Verify Vertex AI API is enabled: `gcloud services list --enabled | grep aiplatform`
2. Check service account permissions
3. Verify agent configuration YAML is valid
4. Check Vertex AI quotas

#### Issue: Firestore permission denied

**Symptoms**: 403 errors when accessing Firestore

**Solutions**:
1. Verify service account has `roles/datastore.user`
2. Check Firestore security rules
3. Ensure Firestore is in Native mode

#### Issue: Cloud Storage access errors

**Symptoms**: 404 or 403 errors when accessing buckets

**Solutions**:
1. Verify bucket exists: `gsutil ls gs://BUCKET_NAME`
2. Check IAM permissions: `gsutil iam get gs://BUCKET_NAME`
3. Verify service account in bucket IAM policy

### 14.2 Debugging Tools

```bash
# View recent logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50 --format=json

# Check service status
gcloud run services list --platform=managed --region=$REGION

# Test service account permissions
gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:ACCOUNT_EMAIL"
```

### 14.3 Support Resources

- **Architecture Documentation**: [architecture-design.md](architecture-design.md)
- **API Specifications**: [api-specifications.md](api-specifications.md)
- **Storage Schema**: [storage-schema.md](storage-schema.md)
- **Agent Configurations**: [agent-configurations/](agent-configurations/)
- **Workflow Implementations**: [reasoning-engine-workflows/](reasoning-engine-workflows/)

---

## Appendix A: Deployment Checklist

### Pre-Deployment
- [ ] GCP account created with billing
- [ ] Tools installed (gcloud, terraform, python)
- [ ] Deployment user has required permissions
- [ ] Budget alerts configured

### Phase 1: Project Setup
- [ ] GCP project created
- [ ] Required APIs enabled
- [ ] Project defaults configured
- [ ] Budget alerts set

### Phase 2: IAM
- [ ] Service accounts created
- [ ] IAM roles assigned
- [ ] Service account keys created (dev only)
- [ ] Workload Identity configured (if using GKE)

### Phase 3: Storage
- [ ] Firestore database created
- [ ] Firestore indexes deployed
- [ ] Firestore security rules deployed
- [ ] Cloud Storage buckets created
- [ ] Bucket IAM policies configured
- [ ] Framework data uploaded

### Phase 4: Vertex AI
- [ ] Vertex AI API enabled
- [ ] Staging bucket created
- [ ] Vertex AI initialized
- [ ] Quotas verified

### Phase 5: Agents
- [ ] Agent configurations prepared
- [ ] All 10 agents deployed
- [ ] Agent endpoints stored
- [ ] Agent invocation tested

### Phase 6: Workflows
- [ ] Workflow code prepared
- [ ] All 8 workflows deployed
- [ ] Workflow endpoints stored
- [ ] Workflow execution tested

### Phase 7: APIs
- [ ] Orchestrator service deployed
- [ ] Agent gateway deployed
- [ ] Workflow gateway deployed
- [ ] API authentication configured

### Phase 8: Configuration
- [ ] Templates uploaded
- [ ] System configuration stored
- [ ] KB Mode configured (if applicable)

### Phase 9: Monitoring
- [ ] Cloud Logging configured
- [ ] Monitoring dashboards created
- [ ] Alerts configured

### Phase 10: Testing
- [ ] Health checks passing
- [ ] E2E tests passing
- [ ] Load testing completed

### Phase 11: Production
- [ ] Production hardening complete
- [ ] Backups configured
- [ ] Documentation complete
- [ ] Production approval obtained

---

## Appendix B: Environment Variables Reference

```bash
# Project Configuration
PROJECT_ID=                 # GCP project ID
PROJECT_NUMBER=             # GCP project number
REGION=                     # Primary GCP region (e.g., us-central1)
ZONE=                       # Primary GCP zone (e.g., us-central1-a)
VERTEX_AI_LOCATION=         # Vertex AI location (e.g., us-central1)
BILLING_ACCOUNT_ID=         # Billing account ID

# Service Accounts
ORCHESTRATOR_SA=            # bmad-orchestrator@PROJECT_ID.iam.gserviceaccount.com
AGENT_SA=                   # bmad-agents@PROJECT_ID.iam.gserviceaccount.com
WORKFLOW_SA=                # bmad-workflows@PROJECT_ID.iam.gserviceaccount.com

# Storage
FIRESTORE_DATABASE=         # (default)
TEMPLATES_BUCKET=           # PROJECT_ID-bmad-templates
DATA_BUCKET=                # PROJECT_ID-bmad-data
ARTIFACTS_BUCKET=           # PROJECT_ID-bmad-artifacts
KB_BUCKET=                  # PROJECT_ID-bmad-kb
STAGING_BUCKET=             # bmad-vertex-ai-staging

# API URLs
ORCHESTRATOR_URL=           # https://bmad-orchestrator-HASH-uc.a.run.app
AGENT_GATEWAY_URL=          # https://bmad-agent-gateway-HASH-uc.a.run.app
WORKFLOW_GATEWAY_URL=       # https://bmad-workflow-gateway-HASH-uc.a.run.app
```

---

**Document Version**: 1.0
**Created**: 2025-10-15
**Last Updated**: 2025-10-15
**Maintained By**: BMad Platform Team
**Framework**: BMad Core v4 → Google ADK + GCP Services

