# BMad Framework - Infrastructure as Code (Terraform)

**Version**: 1.0
**Created**: 2025-10-15
**Terraform Version**: >= 1.6.0
**Framework**: BMad Core v4 → Google Agent Development Kit (google-adk)

---

## Overview

This directory contains Terraform configurations for deploying the BMad framework on Google Cloud Platform using **Google's Agent Development Kit (google-adk)** and supporting GCP services.

**What is Google ADK?** Google's Agent Development Kit (google-adk) is Google's official open-source framework for building and deploying AI agents (`pip install google-adk`). See [../architecture-design.md](../architecture-design.md#231-understanding-googles-agent-development-kit-google-adk) for detailed explanation.

### Infrastructure Components

The Terraform configuration deploys:

- **Vertex AI Infrastructure** (Agent Builder, Search/RAG for KB Mode)
- **3 Service Accounts** (Orchestrator, Agents, Workflows)
- **Firestore Database** with indexes for state management
- **4 Cloud Storage Buckets** (Templates, Artifacts, KB, Data)
- **3 Cloud Run Services** (Orchestrator, Agent Gateway, Workflow Gateway)
- **Artifact Registry** for container images and Python packages
- **Pub/Sub Topics** for event-driven workflows
- **Monitoring & Logging** (Dashboards, alerts, log sinks)
- **Secret Manager** for sensitive configuration
- **Backup Infrastructure** (Automated Firestore backups)
- **Optional: Custom VPC and Networking**

---

## Quick Start

### Prerequisites

1. **GCP Account** with billing enabled
2. **Project Creator** or **Editor** role
3. **Tools Installed**:
   - Terraform >= 1.6.0
   - gcloud CLI
   - Python 3.10+

### 1. Install Tools

```bash
# Install Terraform
brew install terraform  # macOS
# or download from https://www.terraform.io/downloads

# Install gcloud CLI
brew install google-cloud-sdk  # macOS
# or follow https://cloud.google.com/sdk/docs/install

# Verify installations
terraform version
gcloud version
```

### 2. Authenticate

```bash
# Authenticate with GCP
gcloud auth login
gcloud auth application-default login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

### 3. Configure Variables

```bash
# Copy example variables
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
vim terraform.tfvars  # or use your favorite editor
```

### 4. Initialize Terraform

```bash
# Initialize Terraform (downloads providers)
terraform init
```

### 5. Plan Deployment

```bash
# Preview what will be created
terraform plan
```

### 6. Deploy Infrastructure

```bash
# Apply the configuration
terraform apply

# Review the plan and type 'yes' to proceed
```

### 7. Verify Deployment

```bash
# View outputs
terraform output

# Check GCP resources
gcloud services list --enabled
gcloud storage buckets list
gcloud firestore databases list
```

---

## Terraform Files

| File | Purpose |
|------|---------|
| **main.tf** | Provider configuration, APIs, Artifact Registry, metadata |
| **variables.tf** | All input variables with validation and defaults |
| **outputs.tf** | Output values (URLs, IDs, quick reference commands) |
| **iam.tf** | Service accounts, IAM roles, permissions |
| **storage.tf** | Firestore database, Cloud Storage buckets, backups |
| **vertex-ai.tf** | Vertex AI Search configuration for KB Mode |
| **run.tf** | Cloud Run services (Orchestrator, Agent Gateway, Workflow Gateway) |
| **functions.tf** | Cloud Functions placeholders and source bucket |
| **workflows.tf** | Pub/Sub topics for event-driven workflows |
| **monitoring.tf** | Cloud Monitoring dashboards, alerts, logging |
| **networking.tf** | Optional custom VPC, subnets, VPC connector |
| **terraform.tfvars.example** | Example variable values (copy to terraform.tfvars) |

---

## Configuration

### Key Variables

Edit `terraform.tfvars` to customize your deployment:

```hcl
# Project
project_id  = "your-project-id"
region      = "us-central1"
environment = "prod"

# Vertex AI
vertex_ai_model = "gemini-2.0-flash-001"
enable_vertex_ai_search = true

# Cloud Run Scaling
cloud_run_min_instances = 0    # 0 = scale-to-zero
cloud_run_max_instances = 10
cloud_run_cpu           = 2
cloud_run_memory        = "2Gi"

# Budget Alerts
enable_cost_alerts    = true
monthly_budget_amount = 1000  # USD
```

See `terraform.tfvars.example` for all available variables.

---

## Deployment Workflow

### Standard Deployment

```bash
# 1. Initialize (first time only)
terraform init

# 2. Preview changes
terraform plan

# 3. Apply changes
terraform apply

# 4. View outputs
terraform output
```

### Environment-Specific Deployments

```bash
# Development
terraform workspace new dev
terraform apply -var-file=terraform.dev.tfvars

# Staging
terraform workspace new staging
terraform apply -var-file=terraform.staging.tfvars

# Production
terraform workspace new prod
terraform apply -var-file=terraform.prod.tfvars
```

### Targeted Resource Changes

```bash
# Apply changes to specific resources
terraform apply -target=google_storage_bucket.templates

# Destroy specific resources
terraform destroy -target=google_storage_bucket.templates
```

---

## Post-Deployment Steps

After Terraform successfully deploys the infrastructure:

### 1. Upload Templates and Data

```bash
# Upload templates
gsutil -m cp -r /path/to/templates/* gs://YOUR-PROJECT-bmad-templates/

# Upload data files (checklists, workflows)
gsutil -m cp -r /path/to/data/* gs://YOUR-PROJECT-bmad-data/

# Upload KB documents
gsutil -m cp -r /path/to/kb/* gs://YOUR-PROJECT-bmad-kb/
```

### 2. Deploy Agents

```bash
# Deploy all 10 agents using agent configurations
cd ../agent-configurations

# Deploy each agent
for agent in analyst pm ux-expert architect po sm dev qa bmad-master bmad-orchestrator; do
  python deploy_agent.py --config=${agent}.yaml
done
```

### 3. Deploy Workflows

```bash
# Deploy Reasoning Engine workflows
cd ../reasoning-engine-workflows

# Deploy each workflow
for workflow in create-next-story review-story risk-profile test-design \
                apply-qa-fixes validate-next-story execute-checklist shard-doc; do
  python deploy_workflow.py --workflow=${workflow}
done
```

### 4. Build and Deploy Cloud Run Services

```bash
# Build container images
gcloud builds submit --config=cloudbuild.yaml

# Images are automatically deployed via Terraform Cloud Run resources
# Or manually deploy:
gcloud run deploy bmad-orchestrator \
  --image=REGION-docker.pkg.dev/PROJECT/bmad-containers/orchestrator:latest \
  --region=REGION
```

### 5. Configure Authentication

```bash
# For production, set up Identity Platform
gcloud identity platforms create-config

# Configure OAuth providers
# Set up IAM policies for user access
```

### 6. Test Deployment

```bash
# Get orchestrator URL
ORCHESTRATOR_URL=$(terraform output -raw cloud_run_orchestrator_url)

# Test health endpoint
curl ${ORCHESTRATOR_URL}/health

# Test agent invocation (requires authentication)
curl -X POST ${ORCHESTRATOR_URL}/v1/agents/analyst/invoke \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{"command": "help"}'
```

---

## Cost Management

### Estimated Costs

| Service | Estimated Cost/Month |
|---------|---------------------|
| Vertex AI Agents | $300-$500 |
| Reasoning Engine | $100-$200 |
| Cloud Run | $50-$150 |
| Cloud Functions | $20-$50 |
| Firestore | $30-$80 |
| Cloud Storage | $10-$30 |
| Vertex AI Search | $40-$100 |
| Networking & Misc | $30-$70 |
| **TOTAL** | **$580-$1,180/month** |

*Note: Early adoption costs will be lower ($100-$300/month)*

### Cost Optimization

1. **Enable Budget Alerts**: Set `enable_cost_alerts = true`
2. **Scale-to-Zero**: Use `cloud_run_min_instances = 0`
3. **Lifecycle Policies**: Archives old versions after 90 days
4. **Right-Size Resources**: Adjust CPU/memory based on actual usage
5. **Monitor Usage**: Use Cloud Monitoring dashboards

---

## Security Best Practices

### Production Checklist

- [ ] Enable Secret Manager (`enable_secret_manager = true`)
- [ ] Configure IP allowlist (`allowed_ip_ranges`)
- [ ] Enable Binary Authorization (`enable_binary_authorization = true`)
- [ ] Use authenticated Cloud Run access (remove `allUsers` invoker)
- [ ] Enable VPC Service Controls (manual configuration)
- [ ] Configure Identity Platform for user authentication
- [ ] Review IAM permissions (principle of least privilege)
- [ ] Enable audit logging (enabled by default)
- [ ] Set up Security Command Center (manual configuration)
- [ ] Configure DLP API for sensitive data (manual configuration)

### IAM Roles

This configuration creates 3 service accounts:

1. **bmad-orchestrator**: Orchestrates agents and workflows
2. **bmad-agents**: Executes agent tasks
3. **bmad-workflows**: Runs Reasoning Engine workflows

Each has minimal required permissions. Review `iam.tf` for details.

---

## Backup and Recovery

### Automated Backups

- **Firestore**: Daily backups at 2 AM (configurable)
- **Cloud Storage**: Object versioning enabled
- **Retention**: 30 days (configurable)

### Manual Backup

```bash
# Backup Firestore
gcloud firestore export gs://YOUR-PROJECT-bmad-backups/firestore/$(date +%Y%m%d)

# Backup Cloud Storage buckets
gsutil -m rsync -r gs://YOUR-PROJECT-bmad-artifacts/ gs://YOUR-PROJECT-bmad-backups/artifacts/
```

### Disaster Recovery

```bash
# Restore Firestore
gcloud firestore import gs://YOUR-PROJECT-bmad-backups/firestore/20250101

# Restore Cloud Storage
gsutil -m rsync -r gs://YOUR-PROJECT-bmad-backups/artifacts/ gs://YOUR-PROJECT-bmad-artifacts/
```

---

## Troubleshooting

### Common Issues

**Issue: `terraform init` fails with provider errors**
```bash
# Solution: Clear provider cache and reinitialize
rm -rf .terraform .terraform.lock.hcl
terraform init
```

**Issue: API not enabled errors**
```bash
# Solution: Manually enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable firestore.googleapis.com
```

**Issue: Permission denied errors**
```bash
# Solution: Ensure you have necessary IAM roles
gcloud projects add-iam-policy-binding YOUR-PROJECT \
  --member=user:YOUR-EMAIL \
  --role=roles/owner
```

**Issue: Quota exceeded errors**
```bash
# Solution: Request quota increase
# Visit: https://console.cloud.google.com/iam-admin/quotas
```

### Debug Commands

```bash
# View Terraform state
terraform show

# List all resources
terraform state list

# Get resource details
terraform state show google_storage_bucket.templates

# Validate configuration
terraform validate

# Format configuration
terraform fmt -recursive
```

---

## Maintenance

### Updating Infrastructure

```bash
# Pull latest configuration
git pull

# Review changes
terraform plan

# Apply updates
terraform apply
```

### Destroying Resources

**WARNING**: This will delete all BMad resources!

```bash
# Destroy all resources
terraform destroy

# Destroy specific resources
terraform destroy -target=google_storage_bucket.templates
```

### State Management

```bash
# View state
terraform show

# List resources in state
terraform state list

# Move resource to different address
terraform state mv old_address new_address

# Remove resource from state (doesn't delete actual resource)
terraform state rm resource_address
```

---

## Advanced Configuration

### Remote State Backend

For production, use remote state storage:

1. Create GCS bucket for state:
```bash
gsutil mb gs://YOUR-PROJECT-terraform-state
gsutil versioning set on gs://YOUR-PROJECT-terraform-state
```

2. Uncomment backend configuration in `main.tf`:
```hcl
terraform {
  backend "gcs" {
    bucket = "YOUR-PROJECT-terraform-state"
    prefix = "terraform/state"
  }
}
```

3. Initialize with backend:
```bash
terraform init -migrate-state
```

### Multi-Environment Setup

```bash
# Create environment-specific variable files
cp terraform.tfvars.example terraform.dev.tfvars
cp terraform.tfvars.example terraform.staging.tfvars
cp terraform.tfvars.example terraform.prod.tfvars

# Use workspaces
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod

# Apply to specific environment
terraform workspace select prod
terraform apply -var-file=terraform.prod.tfvars
```

---

## Support and Documentation

### Related Documentation

- [Architecture Design](../architecture-design.md) - System architecture overview
- [Deployment Guide](../deployment-guide.md) - Detailed deployment procedures
- [API Specifications](../api-specifications.md) - API documentation
- [Storage Schema](../storage-schema.md) - Data storage design
- [Migration Strategy](../migration-strategy.md) - Migration approach

### Getting Help

- **Terraform Issues**: https://github.com/hashicorp/terraform/issues
- **GCP Issues**: https://issuetracker.google.com/issues
- **BMad Issues**: [Your issue tracker]

---

## Changelog

### Version 1.0 (2025-10-15)

- Initial Terraform configuration
- All core infrastructure components
- IAM roles and service accounts
- Storage (Firestore + Cloud Storage)
- Cloud Run services
- Monitoring and logging
- Backup configuration

---

**Last Updated**: 2025-10-15
**Maintained By**: BMad Platform Team
