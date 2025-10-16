# BMad Framework - Cloud Functions
# Cloud Functions for simple task execution
#
# Version: 1.0
# Created: 2025-10-15
#
# Note: Cloud Functions are deployed programmatically for specific tasks
# This file provides examples and placeholders for function deployment

# =============================================================================
# CLOUD FUNCTIONS BUCKET (for source code)
# =============================================================================

resource "google_storage_bucket" "functions_source" {
  name          = "${var.project_id}-bmad-functions-source"
  project       = var.project_id
  location      = var.region
  storage_class = "STANDARD"

  uniform_bucket_level_access = true

  labels = merge(local.common_labels, {
    "purpose" = "functions-source"
  })

  depends_on = [google_project_service.required_apis]
}

# =============================================================================
# EXAMPLE FUNCTION: Template Renderer
# =============================================================================

# Example of a Cloud Function deployment
# Uncomment and customize for actual deployment

# resource "google_cloudfunctions2_function" "template_renderer" {
#   name        = "bmad-template-renderer"
#   project     = var.project_id
#   location    = var.region
#   description = "Renders BMad templates with provided data"
#
#   build_config {
#     runtime     = var.cloud_functions_runtime
#     entry_point = "render_template"
#     source {
#       storage_source {
#         bucket = google_storage_bucket.functions_source.name
#         object = "template-renderer-source.zip"
#       }
#     }
#   }
#
#   service_config {
#     max_instance_count             = 10
#     min_instance_count             = 0
#     available_memory               = "${var.cloud_functions_memory}Mi"
#     timeout_seconds                = var.cloud_functions_timeout
#     service_account_email          = google_service_account.workflows.email
#     ingress_settings               = "ALLOW_INTERNAL_ONLY"
#     all_traffic_on_latest_revision = true
#   }
#
#   labels = merge(local.common_labels, {
#     "function" = "template-renderer"
#   })
# }

# Note: Deploy functions using:
#   gcloud functions deploy FUNCTION_NAME \
#     --gen2 \
#     --runtime=python311 \
#     --region=REGION \
#     --source=./functions/FUNCTION_NAME \
#     --entry-point=ENTRY_POINT \
#     --service-account=SERVICE_ACCOUNT
