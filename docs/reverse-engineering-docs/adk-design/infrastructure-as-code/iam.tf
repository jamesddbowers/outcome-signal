# BMad Framework - IAM Configuration
# Service accounts, roles, and policies for BMad infrastructure
#
# Version: 1.0
# Created: 2025-10-15

# =============================================================================
# SERVICE ACCOUNTS
# =============================================================================

# Orchestrator Service Account
# Used by the orchestration service (Cloud Run) to coordinate agents and workflows
resource "google_service_account" "orchestrator" {
  project      = var.project_id
  account_id   = "bmad-orchestrator"
  display_name = "BMad Orchestrator Service Account"
  description  = "Service account for BMad orchestration service (coordinates agents and workflows)"

  depends_on = [google_project_service.required_apis]
}

# Agents Service Account
# Used by Vertex AI agents to execute tasks and access resources
resource "google_service_account" "agents" {
  project      = var.project_id
  account_id   = "bmad-agents"
  display_name = "BMad Agents Service Account"
  description  = "Service account for Vertex AI agents (10 agents: Analyst, PM, UX, Architect, PO, SM, Dev, QA, Master, Orchestrator)"

  depends_on = [google_project_service.required_apis]
}

# Workflows Service Account
# Used by Reasoning Engine workflows and Cloud Workflows
resource "google_service_account" "workflows" {
  project      = var.project_id
  account_id   = "bmad-workflows"
  display_name = "BMad Workflows Service Account"
  description  = "Service account for Reasoning Engine workflows and Cloud Workflows"

  depends_on = [google_project_service.required_apis]
}

# =============================================================================
# IAM ROLE BINDINGS - ORCHESTRATOR SERVICE ACCOUNT
# =============================================================================

# Allow orchestrator to invoke agents
resource "google_project_iam_member" "orchestrator_aiplatform_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.orchestrator.email}"
}

# Allow orchestrator to read/write Firestore
resource "google_project_iam_member" "orchestrator_datastore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.orchestrator.email}"
}

# Allow orchestrator to read/write Cloud Storage
resource "google_project_iam_member" "orchestrator_storage_admin" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.orchestrator.email}"
}

# Allow orchestrator to invoke workflows
resource "google_project_iam_member" "orchestrator_workflows_invoker" {
  project = var.project_id
  role    = "roles/workflows.invoker"
  member  = "serviceAccount:${google_service_account.orchestrator.email}"
}

# Allow orchestrator to invoke Cloud Functions
resource "google_project_iam_member" "orchestrator_functions_invoker" {
  project = var.project_id
  role    = "roles/cloudfunctions.invoker"
  member  = "serviceAccount:${google_service_account.orchestrator.email}"
}

# Allow orchestrator to write logs
resource "google_project_iam_member" "orchestrator_log_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.orchestrator.email}"
}

# Allow orchestrator to write metrics
resource "google_project_iam_member" "orchestrator_metric_writer" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.orchestrator.email}"
}

# Allow orchestrator to read secrets
resource "google_project_iam_member" "orchestrator_secret_accessor" {
  count   = var.enable_secret_manager ? 1 : 0
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.orchestrator.email}"
}

# Allow orchestrator to publish to Pub/Sub
resource "google_project_iam_member" "orchestrator_pubsub_publisher" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.orchestrator.email}"
}

# =============================================================================
# IAM ROLE BINDINGS - AGENTS SERVICE ACCOUNT
# =============================================================================

# Allow agents to call Vertex AI services (LLM inference)
resource "google_project_iam_member" "agents_aiplatform_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.agents.email}"
}

# Allow agents to read/write Firestore
resource "google_project_iam_member" "agents_datastore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.agents.email}"
}

# Allow agents to read/write Cloud Storage
resource "google_project_iam_member" "agents_storage_admin" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.agents.email}"
}

# Allow agents to invoke Cloud Functions
resource "google_project_iam_member" "agents_functions_invoker" {
  project = var.project_id
  role    = "roles/cloudfunctions.invoker"
  member  = "serviceAccount:${google_service_account.agents.email}"
}

# Allow agents to invoke workflows
resource "google_project_iam_member" "agents_workflows_invoker" {
  project = var.project_id
  role    = "roles/workflows.invoker"
  member  = "serviceAccount:${google_service_account.agents.email}"
}

# Allow agents to write logs
resource "google_project_iam_member" "agents_log_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.agents.email}"
}

# Allow agents to write metrics
resource "google_project_iam_member" "agents_metric_writer" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.agents.email}"
}

# Allow agents to read secrets
resource "google_project_iam_member" "agents_secret_accessor" {
  count   = var.enable_secret_manager ? 1 : 0
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.agents.email}"
}

# Allow agents to search (for KB Mode)
resource "google_project_iam_member" "agents_discoveryengine_viewer" {
  count   = var.enable_vertex_ai_search ? 1 : 0
  project = var.project_id
  role    = "roles/discoveryengine.viewer"
  member  = "serviceAccount:${google_service_account.agents.email}"
}

# =============================================================================
# IAM ROLE BINDINGS - WORKFLOWS SERVICE ACCOUNT
# =============================================================================

# Allow workflows to call Vertex AI services
resource "google_project_iam_member" "workflows_aiplatform_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.workflows.email}"
}

# Allow workflows to read/write Firestore
resource "google_project_iam_member" "workflows_datastore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.workflows.email}"
}

# Allow workflows to read/write Cloud Storage
resource "google_project_iam_member" "workflows_storage_admin" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.workflows.email}"
}

# Allow workflows to invoke Cloud Functions
resource "google_project_iam_member" "workflows_functions_invoker" {
  project = var.project_id
  role    = "roles/cloudfunctions.invoker"
  member  = "serviceAccount:${google_service_account.workflows.email}"
}

# Allow workflows to invoke other workflows
resource "google_project_iam_member" "workflows_invoker" {
  project = var.project_id
  role    = "roles/workflows.invoker"
  member  = "serviceAccount:${google_service_account.workflows.email}"
}

# Allow workflows to write logs
resource "google_project_iam_member" "workflows_log_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.workflows.email}"
}

# Allow workflows to write metrics
resource "google_project_iam_member" "workflows_metric_writer" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.workflows.email}"
}

# Allow workflows to read secrets
resource "google_project_iam_member" "workflows_secret_accessor" {
  count   = var.enable_secret_manager ? 1 : 0
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.workflows.email}"
}

# Allow workflows to publish to Pub/Sub
resource "google_project_iam_member" "workflows_pubsub_publisher" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.workflows.email}"
}

# =============================================================================
# CROSS-SERVICE ACCOUNT PERMISSIONS
# =============================================================================

# Allow orchestrator to impersonate agents service account
resource "google_service_account_iam_member" "orchestrator_impersonate_agents" {
  service_account_id = google_service_account.agents.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "serviceAccount:${google_service_account.orchestrator.email}"
}

# Allow orchestrator to impersonate workflows service account
resource "google_service_account_iam_member" "orchestrator_impersonate_workflows" {
  service_account_id = google_service_account.workflows.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "serviceAccount:${google_service_account.orchestrator.email}"
}

# Allow agents to invoke other agents (for agent-to-agent communication)
resource "google_service_account_iam_member" "agents_impersonate_self" {
  service_account_id = google_service_account.agents.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.agents.email}"
}

# =============================================================================
# CLOUD RUN SERVICE ACCOUNT BINDINGS
# =============================================================================

# Allow public (unauthenticated) access to Cloud Run services
# Note: In production, you should use authenticated access with Identity Platform
# Uncomment the following to allow unauthenticated access (for testing only)

# resource "google_cloud_run_service_iam_member" "orchestrator_public" {
#   service  = google_cloud_run_v2_service.orchestrator.name
#   location = google_cloud_run_v2_service.orchestrator.location
#   role     = "roles/run.invoker"
#   member   = "allUsers"
# }

# For production, use authenticated access:
# Allow specific users/groups to invoke Cloud Run services
# resource "google_cloud_run_service_iam_member" "orchestrator_users" {
#   service  = google_cloud_run_v2_service.orchestrator.name
#   location = google_cloud_run_v2_service.orchestrator.location
#   role     = "roles/run.invoker"
#   member   = "user:admin@example.com"
# }

# =============================================================================
# CUSTOM IAM ROLES (Optional)
# =============================================================================

# Custom role for BMad administrators
resource "google_project_iam_custom_role" "bmad_admin" {
  project     = var.project_id
  role_id     = "bmadAdmin"
  title       = "BMad Administrator"
  description = "Full administrative access to BMad resources"
  permissions = [
    "aiplatform.agents.create",
    "aiplatform.agents.delete",
    "aiplatform.agents.get",
    "aiplatform.agents.list",
    "aiplatform.agents.update",
    "datastore.databases.get",
    "datastore.entities.create",
    "datastore.entities.delete",
    "datastore.entities.get",
    "datastore.entities.list",
    "datastore.entities.update",
    "storage.buckets.get",
    "storage.buckets.list",
    "storage.objects.create",
    "storage.objects.delete",
    "storage.objects.get",
    "storage.objects.list",
    "storage.objects.update",
    "workflows.executions.cancel",
    "workflows.executions.get",
    "workflows.executions.list",
    "workflows.workflows.get",
    "workflows.workflows.list",
    "cloudfunctions.functions.get",
    "cloudfunctions.functions.invoke",
    "cloudfunctions.functions.list",
    "run.services.get",
    "run.services.list",
    "logging.logEntries.list",
    "logging.logs.list",
    "monitoring.dashboards.get",
    "monitoring.dashboards.list",
    "monitoring.timeSeries.list",
  ]
}

# Custom role for BMad developers (read-only access)
resource "google_project_iam_custom_role" "bmad_developer" {
  project     = var.project_id
  role_id     = "bmadDeveloper"
  title       = "BMad Developer"
  description = "Read access to BMad resources and ability to invoke agents/workflows"
  permissions = [
    "aiplatform.agents.get",
    "aiplatform.agents.list",
    "datastore.databases.get",
    "datastore.entities.get",
    "datastore.entities.list",
    "storage.buckets.get",
    "storage.buckets.list",
    "storage.objects.get",
    "storage.objects.list",
    "workflows.executions.get",
    "workflows.executions.list",
    "workflows.workflows.get",
    "workflows.workflows.list",
    "cloudfunctions.functions.get",
    "cloudfunctions.functions.invoke",
    "cloudfunctions.functions.list",
    "run.services.get",
    "run.services.list",
    "logging.logEntries.list",
    "logging.logs.list",
    "monitoring.dashboards.get",
    "monitoring.dashboards.list",
    "monitoring.timeSeries.list",
  ]
}

# =============================================================================
# WORKLOAD IDENTITY FEDERATION (for GKE if needed)
# =============================================================================

# Uncomment if deploying on GKE with Workload Identity
# resource "google_service_account_iam_member" "workload_identity_binding" {
#   service_account_id = google_service_account.orchestrator.name
#   role               = "roles/iam.workloadIdentityUser"
#   member             = "serviceAccount:${var.project_id}.svc.id.goog[bmad/orchestrator]"
# }

# =============================================================================
# ORGANIZATION POLICIES (if applicable)
# =============================================================================

# Note: Organization policies require org-level permissions
# Uncomment and customize if you have organization admin access

# Allow external IPs for Cloud Run services
# resource "google_project_organization_policy" "external_ip_access" {
#   project    = var.project_id
#   constraint = "compute.vmExternalIpAccess"
#
#   list_policy {
#     allow {
#       all = true
#     }
#   }
# }

# =============================================================================
# IAM AUDIT LOGGING
# =============================================================================

# Enable audit logging for BMad services
resource "google_project_iam_audit_config" "bmad_audit" {
  project = var.project_id
  service = "allServices"

  audit_log_config {
    log_type = "ADMIN_READ"
  }

  audit_log_config {
    log_type = "DATA_READ"
  }

  audit_log_config {
    log_type = "DATA_WRITE"
  }
}
