# BMad Framework - Cloud Workflows
# Cloud Workflows for orchestration
#
# Version: 1.0
# Created: 2025-10-15
#
# Note: Complex workflows are implemented as Reasoning Engine workflows
# Cloud Workflows are used for simple orchestration patterns

# =============================================================================
# PUB/SUB TOPICS (for event-driven workflows)
# =============================================================================

resource "google_pubsub_topic" "agent_events" {
  project = var.project_id
  name    = "bmad-agent-events"

  labels = merge(local.common_labels, {
    "purpose" = "agent-events"
  })

  depends_on = [google_project_service.required_apis]
}

resource "google_pubsub_topic" "workflow_events" {
  project = var.project_id
  name    = "bmad-workflow-events"

  labels = merge(local.common_labels, {
    "purpose" = "workflow-events"
  })

  depends_on = [google_project_service.required_apis]
}

# =============================================================================
# PUB/SUB SUBSCRIPTIONS
# =============================================================================

resource "google_pubsub_subscription" "agent_events_sub" {
  project = var.project_id
  name    = "bmad-agent-events-sub"
  topic   = google_pubsub_topic.agent_events.name

  ack_deadline_seconds = 20

  labels = local.common_labels
}

resource "google_pubsub_subscription" "workflow_events_sub" {
  project = var.project_id
  name    = "bmad-workflow-events-sub"
  topic   = google_pubsub_topic.workflow_events.name

  ack_deadline_seconds = 20

  labels = local.common_labels
}

# =============================================================================
# REASONING ENGINE WORKFLOWS
# =============================================================================

# Note: Reasoning Engine workflows are deployed programmatically using
# the workflow implementations in ../reasoning-engine-workflows/*.py
# Deploy using:
#   python deploy_workflows.py --workflow=create-next-story
