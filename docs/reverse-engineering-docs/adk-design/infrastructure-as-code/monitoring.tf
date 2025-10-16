# BMad Framework - Monitoring & Logging
# Cloud Monitoring, Logging, and alerting configuration
#
# Version: 1.0
# Created: 2025-10-15

# =============================================================================
# CLOUD LOGGING
# =============================================================================

resource "google_logging_project_bucket_config" "bmad_logs" {
  count          = var.enable_cloud_logging ? 1 : 0
  project        = var.project_id
  location       = "global"
  retention_days = var.log_retention_days
  bucket_id      = "bmad-logs"
}

# =============================================================================
# CLOUD MONITORING DASHBOARD
# =============================================================================

resource "google_monitoring_dashboard" "bmad_dashboard" {
  count          = var.enable_cloud_monitoring ? 1 : 0
  project        = var.project_id
  dashboard_json = jsonencode({
    displayName = "BMad Framework Dashboard"
    mosaicLayout = {
      columns = 12
      tiles = [
        {
          width  = 6
          height = 4
          widget = {
            title = "Cloud Run Request Count"
            xyChart = {
              dataSets = [{
                timeSeriesQuery = {
                  timeSeriesFilter = {
                    filter = "resource.type=\"cloud_run_revision\" AND metric.type=\"run.googleapis.com/request_count\""
                  }
                }
              }]
            }
          }
        }
      ]
    }
  })
}

# =============================================================================
# ALERT POLICIES
# =============================================================================

resource "google_monitoring_alert_policy" "high_error_rate" {
  count        = var.enable_cloud_monitoring ? 1 : 0
  project      = var.project_id
  display_name = "BMad High Error Rate"
  combiner     = "OR"
  conditions {
    display_name = "Error rate > 5%"
    condition_threshold {
      filter          = "resource.type=\"cloud_run_revision\" AND metric.type=\"run.googleapis.com/request_count\""
      duration        = "60s"
      comparison      = "COMPARISON_GT"
      threshold_value = 0.05
    }
  }
}

# =============================================================================
# BUDGET ALERTS
# =============================================================================

data "google_billing_account" "account" {
  billing_account = var.project_id
}

resource "google_billing_budget" "bmad_budget" {
  count           = var.enable_cost_alerts ? 1 : 0
  billing_account = data.google_billing_account.account.id
  display_name    = "BMad Monthly Budget"

  budget_filter {
    projects = ["projects/${data.google_project.project.number}"]
  }

  amount {
    specified_amount {
      currency_code = "USD"
      units         = tostring(var.monthly_budget_amount)
    }
  }

  dynamic "threshold_rules" {
    for_each = var.budget_alert_thresholds
    content {
      threshold_percent = threshold_rules.value
    }
  }
}
