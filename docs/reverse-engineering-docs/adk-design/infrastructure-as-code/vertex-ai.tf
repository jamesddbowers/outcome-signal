# BMad Framework - Vertex AI Configuration
# Vertex AI agents and services
#
# Version: 1.0
# Created: 2025-10-15
#
# Note: Vertex AI Agent Builder agents are deployed programmatically using
# the agent configuration YAML files in ../agent-configurations/
# This file configures the Vertex AI infrastructure and dependencies.

# =============================================================================
# VERTEX AI SEARCH (for KB Mode)
# =============================================================================

resource "google_discovery_engine_data_store" "kb_datastore" {
  count                     = var.enable_vertex_ai_search ? 1 : 0
  project                   = var.project_id
  location                  = "global"
  data_store_id             = "bmad-kb-datastore"
  display_name              = "BMad Knowledge Base"
  industry_vertical         = "GENERIC"
  solution_types            = ["SOLUTION_TYPE_SEARCH"]
  content_config            = "CONTENT_REQUIRED"
  create_advanced_site_search = false

  depends_on = [google_project_service.required_apis]
}

# =============================================================================
# VERTEX AI STAGING BUCKET
# =============================================================================

resource "google_storage_bucket" "vertex_staging" {
  name          = var.vertex_ai_staging_bucket != "" ? var.vertex_ai_staging_bucket : "${var.project_id}-vertex-staging"
  project       = var.project_id
  location      = var.region
  storage_class = "STANDARD"

  uniform_bucket_level_access = true

  lifecycle_rule {
    condition {
      age = 7
    }
    action {
      type = "Delete"
    }
  }

  labels = merge(local.common_labels, {
    "purpose" = "vertex-ai-staging"
  })

  depends_on = [google_project_service.required_apis]
}

# =============================================================================
# AGENT DEPLOYMENT PLACEHOLDER
# =============================================================================

# Note: Actual Vertex AI agents are deployed using the Google ADK CLI or API
# The agent configurations are in ../agent-configurations/*.yaml
# Deploy using:
#   python deploy_agents.py --config=agent-configurations/analyst.yaml
#
# This Terraform configuration ensures the infrastructure is ready for agent deployment
