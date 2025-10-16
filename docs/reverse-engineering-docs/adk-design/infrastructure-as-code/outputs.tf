# BMad Framework - Terraform Outputs
# Output values for BMad infrastructure
#
# Version: 1.0
# Created: 2025-10-15

# =============================================================================
# PROJECT OUTPUTS
# =============================================================================

output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "project_number" {
  description = "GCP Project Number"
  value       = data.google_project.project.number
}

output "region" {
  description = "Primary deployment region"
  value       = var.region
}

output "environment" {
  description = "Deployment environment"
  value       = var.environment
}

# =============================================================================
# SERVICE ACCOUNT OUTPUTS
# =============================================================================

output "service_account_orchestrator" {
  description = "Orchestrator service account email"
  value       = google_service_account.orchestrator.email
}

output "service_account_agents" {
  description = "Agents service account email"
  value       = google_service_account.agents.email
}

output "service_account_workflows" {
  description = "Workflows service account email"
  value       = google_service_account.workflows.email
}

# =============================================================================
# STORAGE OUTPUTS
# =============================================================================

output "firestore_database_id" {
  description = "Firestore database ID"
  value       = google_firestore_database.bmad_database.name
}

output "firestore_database_location" {
  description = "Firestore database location"
  value       = google_firestore_database.bmad_database.location_id
}

output "bucket_templates" {
  description = "Templates bucket name"
  value       = google_storage_bucket.templates.name
}

output "bucket_templates_url" {
  description = "Templates bucket URL"
  value       = google_storage_bucket.templates.url
}

output "bucket_artifacts" {
  description = "Artifacts bucket name"
  value       = google_storage_bucket.artifacts.name
}

output "bucket_artifacts_url" {
  description = "Artifacts bucket URL"
  value       = google_storage_bucket.artifacts.url
}

output "bucket_kb" {
  description = "Knowledge base bucket name"
  value       = google_storage_bucket.kb.name
}

output "bucket_kb_url" {
  description = "Knowledge base bucket URL"
  value       = google_storage_bucket.kb.url
}

output "bucket_data" {
  description = "Data bucket name"
  value       = google_storage_bucket.data.name
}

output "bucket_data_url" {
  description = "Data bucket URL"
  value       = google_storage_bucket.data.url
}

# =============================================================================
# VERTEX AI OUTPUTS
# =============================================================================

output "vertex_ai_location" {
  description = "Vertex AI location"
  value       = var.vertex_ai_location
}

output "vertex_ai_model" {
  description = "Default Vertex AI model"
  value       = var.vertex_ai_model
}

output "vertex_ai_agent_endpoints" {
  description = "Vertex AI agent endpoint URLs (placeholder - actual endpoints created at deployment)"
  value = {
    for agent in local.agent_names :
    agent => "projects/${var.project_id}/locations/${var.vertex_ai_location}/agents/${agent}"
  }
}

output "vertex_ai_search_datastore_id" {
  description = "Vertex AI Search datastore ID for KB Mode"
  value       = var.enable_vertex_ai_search ? google_discovery_engine_data_store.kb_datastore[0].data_store_id : null
}

# =============================================================================
# CLOUD RUN OUTPUTS
# =============================================================================

output "cloud_run_orchestrator_url" {
  description = "Orchestrator service URL"
  value       = google_cloud_run_v2_service.orchestrator.uri
}

output "cloud_run_agent_gateway_url" {
  description = "Agent Gateway service URL"
  value       = google_cloud_run_v2_service.agent_gateway.uri
}

output "cloud_run_workflow_gateway_url" {
  description = "Workflow Gateway service URL"
  value       = google_cloud_run_v2_service.workflow_gateway.uri
}

# =============================================================================
# ARTIFACT REGISTRY OUTPUTS
# =============================================================================

output "artifact_registry_containers" {
  description = "Container registry URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.bmad_containers.repository_id}"
}

output "artifact_registry_python" {
  description = "Python registry URL"
  value       = "${var.region}-python.pkg.dev/${var.project_id}/${google_artifact_registry_repository.bmad_python.repository_id}"
}

# =============================================================================
# MONITORING OUTPUTS
# =============================================================================

output "monitoring_dashboard_url" {
  description = "Cloud Monitoring dashboard URL"
  value       = var.enable_cloud_monitoring ? "https://console.cloud.google.com/monitoring/dashboards/custom/${google_monitoring_dashboard.bmad_dashboard[0].id}?project=${var.project_id}" : null
}

output "log_sink_bucket" {
  description = "Log sink bucket name"
  value       = var.enable_cloud_logging ? google_logging_project_bucket_config.bmad_logs[0].bucket_id : null
}

# =============================================================================
# NETWORKING OUTPUTS
# =============================================================================

output "vpc_network_name" {
  description = "VPC network name"
  value       = var.create_vpc ? google_compute_network.bmad_vpc[0].name : "default"
}

output "vpc_subnet_name" {
  description = "VPC subnet name"
  value       = var.create_vpc ? google_compute_subnetwork.bmad_subnet[0].name : null
}

output "vpc_connector_id" {
  description = "Serverless VPC Connector ID"
  value       = var.enable_vpc_connector ? google_vpc_access_connector.bmad_connector[0].id : null
}

# =============================================================================
# SECRET MANAGER OUTPUTS
# =============================================================================

output "secret_manager_secrets" {
  description = "List of Secret Manager secret IDs"
  value = var.enable_secret_manager ? [
    google_secret_manager_secret.api_keys[0].secret_id,
    google_secret_manager_secret.db_credentials[0].secret_id,
  ] : []
}

# =============================================================================
# BACKUP OUTPUTS
# =============================================================================

output "firestore_backup_schedule_id" {
  description = "Firestore backup schedule ID"
  value       = var.enable_firestore_backup ? google_firestore_backup_schedule.daily_backup[0].name : null
}

output "backup_bucket_name" {
  description = "Backup bucket name"
  value       = var.enable_firestore_backup ? google_storage_bucket.backups[0].name : null
}

# =============================================================================
# COST MANAGEMENT OUTPUTS
# =============================================================================

output "budget_name" {
  description = "Budget name for cost monitoring"
  value       = var.enable_cost_alerts ? google_billing_budget.bmad_budget[0].display_name : null
}

output "monthly_budget_amount" {
  description = "Monthly budget amount (USD)"
  value       = var.monthly_budget_amount
}

# =============================================================================
# DEPLOYMENT INFORMATION
# =============================================================================

output "deployment_summary" {
  description = "Deployment summary information"
  value = {
    project_id               = var.project_id
    environment              = var.environment
    region                   = var.region
    bmad_version            = var.bmad_version
    firestore_database      = google_firestore_database.bmad_database.name
    storage_buckets         = [
      google_storage_bucket.templates.name,
      google_storage_bucket.artifacts.name,
      google_storage_bucket.kb.name,
      google_storage_bucket.data.name,
    ]
    cloud_run_services      = [
      google_cloud_run_v2_service.orchestrator.name,
      google_cloud_run_v2_service.agent_gateway.name,
      google_cloud_run_v2_service.workflow_gateway.name,
    ]
    vertex_ai_location      = var.vertex_ai_location
    vertex_ai_model         = var.vertex_ai_model
    monitoring_enabled      = var.enable_cloud_monitoring
    backup_enabled          = var.enable_firestore_backup
  }
}

# =============================================================================
# QUICK REFERENCE COMMANDS
# =============================================================================

output "quick_reference" {
  description = "Quick reference commands for common operations"
  value = {
    "List agents" = "gcloud ai agents list --project=${var.project_id} --region=${var.vertex_ai_location}"

    "View Firestore" = "gcloud firestore databases describe ${google_firestore_database.bmad_database.name} --project=${var.project_id}"

    "List buckets" = "gcloud storage buckets list --project=${var.project_id} --filter='name:bmad'"

    "View Cloud Run services" = "gcloud run services list --project=${var.project_id} --region=${var.region}"

    "View logs" = "gcloud logging read 'resource.type=cloud_run_revision' --project=${var.project_id} --limit=50"

    "View monitoring" = "https://console.cloud.google.com/monitoring?project=${var.project_id}"

    "Access Orchestrator" = google_cloud_run_v2_service.orchestrator.uri

    "Access Agent Gateway" = google_cloud_run_v2_service.agent_gateway.uri

    "Access Workflow Gateway" = google_cloud_run_v2_service.workflow_gateway.uri
  }
}

# =============================================================================
# NEXT STEPS
# =============================================================================

output "next_steps" {
  description = "Next steps after Terraform deployment"
  value = [
    "1. Upload templates to gs://${google_storage_bucket.templates.name}/",
    "2. Upload data files to gs://${google_storage_bucket.data.name}/",
    "3. Upload KB documents to gs://${google_storage_bucket.kb.name}/",
    "4. Deploy agents using the agent configuration files",
    "5. Deploy workflows using the reasoning engine workflow files",
    "6. Configure authentication and authorization",
    "7. Set up monitoring alerts and dashboards",
    "8. Run end-to-end tests",
    "9. Review the deployment guide for detailed instructions",
    "10. Access the API at: ${google_cloud_run_v2_service.orchestrator.uri}",
  ]
}
