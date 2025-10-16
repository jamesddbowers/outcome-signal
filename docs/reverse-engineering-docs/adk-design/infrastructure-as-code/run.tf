# BMad Framework - Cloud Run Services
# Cloud Run deployments for BMad API services
#
# Version: 1.0
# Created: 2025-10-15

# =============================================================================
# ORCHESTRATOR SERVICE
# =============================================================================

resource "google_cloud_run_v2_service" "orchestrator" {
  name     = "bmad-orchestrator"
  project  = var.project_id
  location = var.region
  ingress  = var.cloud_run_ingress

  template {
    service_account = google_service_account.orchestrator.email

    scaling {
      min_instance_count = var.cloud_run_min_instances
      max_instance_count = var.cloud_run_max_instances
    }

    containers {
      # Container image should be built and pushed to Artifact Registry
      # Example: gcr.io/PROJECT_ID/bmad-orchestrator:latest
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.bmad_containers.repository_id}/orchestrator:latest"

      resources {
        limits = {
          cpu    = "${var.cloud_run_cpu}"
          memory = var.cloud_run_memory
        }
      }

      env {
        name  = "PROJECT_ID"
        value = var.project_id
      }

      env {
        name  = "FIRESTORE_DATABASE"
        value = google_firestore_database.bmad_database.name
      }

      env {
        name  = "ENVIRONMENT"
        value = var.environment
      }
    }

    timeout = "${var.cloud_run_timeout}s"
  }

  labels = merge(local.common_labels, {
    "service" = "orchestrator"
  })

  depends_on = [
    google_project_service.required_apis,
    google_artifact_registry_repository.bmad_containers
  ]
}

# =============================================================================
# AGENT GATEWAY SERVICE
# =============================================================================

resource "google_cloud_run_v2_service" "agent_gateway" {
  name     = "bmad-agent-gateway"
  project  = var.project_id
  location = var.region
  ingress  = var.cloud_run_ingress

  template {
    service_account = google_service_account.agents.email

    scaling {
      min_instance_count = var.cloud_run_min_instances
      max_instance_count = var.cloud_run_max_instances
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.bmad_containers.repository_id}/agent-gateway:latest"

      resources {
        limits = {
          cpu    = "${var.cloud_run_cpu}"
          memory = var.cloud_run_memory
        }
      }

      env {
        name  = "PROJECT_ID"
        value = var.project_id
      }

      env {
        name  = "VERTEX_AI_LOCATION"
        value = var.vertex_ai_location
      }

      env {
        name  = "FIRESTORE_DATABASE"
        value = google_firestore_database.bmad_database.name
      }
    }

    timeout = "${var.cloud_run_timeout}s"
  }

  labels = merge(local.common_labels, {
    "service" = "agent-gateway"
  })

  depends_on = [
    google_project_service.required_apis,
    google_artifact_registry_repository.bmad_containers
  ]
}

# =============================================================================
# WORKFLOW GATEWAY SERVICE
# =============================================================================

resource "google_cloud_run_v2_service" "workflow_gateway" {
  name     = "bmad-workflow-gateway"
  project  = var.project_id
  location = var.region
  ingress  = var.cloud_run_ingress

  template {
    service_account = google_service_account.workflows.email

    scaling {
      min_instance_count = var.cloud_run_min_instances
      max_instance_count = var.cloud_run_max_instances
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.bmad_containers.repository_id}/workflow-gateway:latest"

      resources {
        limits = {
          cpu    = "${var.cloud_run_cpu}"
          memory = var.cloud_run_memory
        }
      }

      env {
        name  = "PROJECT_ID"
        value = var.project_id
      }

      env {
        name  = "VERTEX_AI_LOCATION"
        value = var.vertex_ai_location
      }

      env {
        name  = "FIRESTORE_DATABASE"
        value = google_firestore_database.bmad_database.name
      }
    }

    timeout = "${var.cloud_run_timeout}s"
  }

  labels = merge(local.common_labels, {
    "service" = "workflow-gateway"
  })

  depends_on = [
    google_project_service.required_apis,
    google_artifact_registry_repository.bmad_containers
  ]
}
