# BMad Framework - Google ADK Infrastructure as Code
# Main Terraform Configuration
#
# This file defines the core infrastructure for deploying BMad on GCP using
# Google's Agent Development Kit (google-adk) and Vertex AI services.
#
# Version: 1.0
# Created: 2025-10-15
# Terraform Version: >= 1.6.0

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }

  # Backend configuration for state management
  # Uncomment and configure for production deployments
  # backend "gcs" {
  #   bucket = "bmad-terraform-state"
  #   prefix = "terraform/state"
  # }
}

# Provider configuration
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Data source for project information
data "google_project" "project" {
  project_id = var.project_id
}

# Enable required Google Cloud APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "aiplatform.googleapis.com",        # Vertex AI (Agent Builder, Reasoning Engine)
    "cloudresourcemanager.googleapis.com", # Resource management
    "serviceusage.googleapis.com",      # API enablement
    "iam.googleapis.com",               # Identity and Access Management
    "iamcredentials.googleapis.com",    # Service account credentials
    "cloudbuild.googleapis.com",        # Cloud Build (for deployments)
    "artifactregistry.googleapis.com",  # Artifact Registry (for container images)
    "run.googleapis.com",               # Cloud Run
    "cloudfunctions.googleapis.com",    # Cloud Functions
    "storage.googleapis.com",           # Cloud Storage
    "storage-api.googleapis.com",       # Cloud Storage API
    "firestore.googleapis.com",         # Firestore
    "secretmanager.googleapis.com",     # Secret Manager
    "logging.googleapis.com",           # Cloud Logging
    "monitoring.googleapis.com",        # Cloud Monitoring
    "cloudtrace.googleapis.com",        # Cloud Trace
    "cloudscheduler.googleapis.com",    # Cloud Scheduler
    "pubsub.googleapis.com",            # Pub/Sub
    "eventarc.googleapis.com",          # Eventarc
    "workflows.googleapis.com",         # Cloud Workflows
    "discoveryengine.googleapis.com",   # Vertex AI Search (for KB Mode)
    "compute.googleapis.com",           # Compute Engine (for networking)
  ])

  project = var.project_id
  service = each.value

  # Don't disable services on destroy to prevent data loss
  disable_on_destroy = false
}

# Create Artifact Registry repository for container images
resource "google_artifact_registry_repository" "bmad_containers" {
  provider      = google-beta
  project       = var.project_id
  location      = var.region
  repository_id = "bmad-containers"
  description   = "Container images for BMad services (Cloud Run, Cloud Functions)"
  format        = "DOCKER"

  depends_on = [google_project_service.required_apis]
}

# Create Artifact Registry repository for Python packages (optional)
resource "google_artifact_registry_repository" "bmad_python" {
  provider      = google-beta
  project       = var.project_id
  location      = var.region
  repository_id = "bmad-python"
  description   = "Python packages for BMad (google-adk, custom libraries)"
  format        = "PYTHON"

  depends_on = [google_project_service.required_apis]
}

# Project-wide metadata
resource "google_compute_project_metadata" "bmad_metadata" {
  project = var.project_id
  metadata = {
    "bmad-version"     = var.bmad_version
    "deployment-env"   = var.environment
    "deployment-date"  = timestamp()
    "enable-oslogin"   = "TRUE"
  }

  depends_on = [google_project_service.required_apis]
}

# Locals for common tags and labels
locals {
  common_labels = {
    "managed-by"   = "terraform"
    "project"      = "bmad-framework"
    "environment"  = var.environment
    "version"      = var.bmad_version
    "framework"    = "google-adk"
  }

  # Service account email suffixes
  sa_orchestrator_email = "${google_service_account.orchestrator.account_id}@${var.project_id}.iam.gserviceaccount.com"
  sa_agents_email       = "${google_service_account.agents.account_id}@${var.project_id}.iam.gserviceaccount.com"
  sa_workflows_email    = "${google_service_account.workflows.account_id}@${var.project_id}.iam.gserviceaccount.com"

  # Agent names for deployment
  agent_names = [
    "analyst",
    "pm",
    "ux-expert",
    "architect",
    "po",
    "sm",
    "dev",
    "qa",
    "bmad-master",
    "bmad-orchestrator"
  ]

  # Workflow names for deployment
  workflow_names = [
    "create-next-story",
    "review-story",
    "risk-profile",
    "test-design",
    "apply-qa-fixes",
    "validate-next-story",
    "execute-checklist",
    "shard-doc"
  ]

  # Cloud Storage bucket names
  bucket_templates  = "${var.project_id}-bmad-templates"
  bucket_artifacts  = "${var.project_id}-bmad-artifacts"
  bucket_kb         = "${var.project_id}-bmad-kb"
  bucket_data       = "${var.project_id}-bmad-data"
}
