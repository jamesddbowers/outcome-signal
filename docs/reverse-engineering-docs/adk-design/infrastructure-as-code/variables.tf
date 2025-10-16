# BMad Framework - Terraform Variables
# Input variables for BMad infrastructure deployment
#
# Version: 1.0
# Created: 2025-10-15

# =============================================================================
# PROJECT CONFIGURATION
# =============================================================================

variable "project_id" {
  description = "GCP Project ID for BMad deployment"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{4,28}[a-z0-9]$", var.project_id))
    error_message = "Project ID must be 6-30 characters, start with a letter, and contain only lowercase letters, numbers, and hyphens."
  }
}

variable "region" {
  description = "Primary GCP region for resource deployment"
  type        = string
  default     = "us-central1"

  validation {
    condition     = can(regex("^[a-z]+-[a-z]+[0-9]$", var.region))
    error_message = "Region must be a valid GCP region (e.g., us-central1, europe-west1)."
  }
}

variable "zone" {
  description = "Primary GCP zone for zonal resources"
  type        = string
  default     = "us-central1-a"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "bmad_version" {
  description = "BMad framework version"
  type        = string
  default     = "4.0.0"
}

# =============================================================================
# VERTEX AI CONFIGURATION
# =============================================================================

variable "vertex_ai_location" {
  description = "Vertex AI location (us-central1, europe-west4, etc.)"
  type        = string
  default     = "us-central1"
}

variable "vertex_ai_model" {
  description = "Default Vertex AI model for agents"
  type        = string
  default     = "gemini-2.0-flash-001"

  validation {
    condition     = can(regex("^gemini-", var.vertex_ai_model))
    error_message = "Model must be a valid Gemini model (e.g., gemini-2.0-flash-001, gemini-pro)."
  }
}

variable "vertex_ai_staging_bucket" {
  description = "Cloud Storage bucket for Vertex AI staging (auto-created if empty)"
  type        = string
  default     = ""
}

variable "enable_vertex_ai_search" {
  description = "Enable Vertex AI Search for KB Mode"
  type        = bool
  default     = true
}

# =============================================================================
# AGENT CONFIGURATION
# =============================================================================

variable "agent_temperature_creative" {
  description = "Temperature for creative agents (Analyst, UX Expert, Architect)"
  type        = number
  default     = 0.7

  validation {
    condition     = var.agent_temperature_creative >= 0 && var.agent_temperature_creative <= 1
    error_message = "Temperature must be between 0 and 1."
  }
}

variable "agent_temperature_analytical" {
  description = "Temperature for analytical agents (PO, QA)"
  type        = number
  default     = 0.5

  validation {
    condition     = var.agent_temperature_analytical >= 0 && var.agent_temperature_analytical <= 1
    error_message = "Temperature must be between 0 and 1."
  }
}

variable "agent_temperature_balanced" {
  description = "Temperature for balanced agents (PM, SM, Dev, BMad-Master)"
  type        = number
  default     = 0.6

  validation {
    condition     = var.agent_temperature_balanced >= 0 && var.agent_temperature_balanced <= 1
    error_message = "Temperature must be between 0 and 1."
  }
}

variable "agent_max_output_tokens" {
  description = "Maximum output tokens for agent responses"
  type        = number
  default     = 8192

  validation {
    condition     = var.agent_max_output_tokens >= 256 && var.agent_max_output_tokens <= 32000
    error_message = "Max output tokens must be between 256 and 32000."
  }
}

# =============================================================================
# STORAGE CONFIGURATION
# =============================================================================

variable "firestore_database_id" {
  description = "Firestore database ID"
  type        = string
  default     = "bmad-state"
}

variable "firestore_location_id" {
  description = "Firestore location (nam5, eur3, etc.)"
  type        = string
  default     = "nam5"
}

variable "storage_class" {
  description = "Cloud Storage class (STANDARD, NEARLINE, COLDLINE, ARCHIVE)"
  type        = string
  default     = "STANDARD"

  validation {
    condition     = contains(["STANDARD", "NEARLINE", "COLDLINE", "ARCHIVE"], var.storage_class)
    error_message = "Storage class must be one of: STANDARD, NEARLINE, COLDLINE, ARCHIVE."
  }
}

variable "enable_storage_versioning" {
  description = "Enable object versioning for Cloud Storage buckets"
  type        = bool
  default     = true
}

variable "storage_lifecycle_age_days" {
  description = "Days before moving old versions to NEARLINE storage"
  type        = number
  default     = 90
}

# =============================================================================
# CLOUD RUN CONFIGURATION
# =============================================================================

variable "cloud_run_min_instances" {
  description = "Minimum number of Cloud Run instances (0 for scale-to-zero)"
  type        = number
  default     = 0

  validation {
    condition     = var.cloud_run_min_instances >= 0 && var.cloud_run_min_instances <= 10
    error_message = "Min instances must be between 0 and 10."
  }
}

variable "cloud_run_max_instances" {
  description = "Maximum number of Cloud Run instances"
  type        = number
  default     = 10

  validation {
    condition     = var.cloud_run_max_instances >= 1 && var.cloud_run_max_instances <= 100
    error_message = "Max instances must be between 1 and 100."
  }
}

variable "cloud_run_cpu" {
  description = "CPU allocation for Cloud Run services (1, 2, 4, 6, 8)"
  type        = number
  default     = 2

  validation {
    condition     = contains([1, 2, 4, 6, 8], var.cloud_run_cpu)
    error_message = "CPU must be one of: 1, 2, 4, 6, 8."
  }
}

variable "cloud_run_memory" {
  description = "Memory allocation for Cloud Run services (e.g., 512Mi, 1Gi, 2Gi)"
  type        = string
  default     = "2Gi"

  validation {
    condition     = can(regex("^[0-9]+(Mi|Gi)$", var.cloud_run_memory))
    error_message = "Memory must be in format like 512Mi or 2Gi."
  }
}

variable "cloud_run_timeout" {
  description = "Request timeout for Cloud Run services (seconds)"
  type        = number
  default     = 300

  validation {
    condition     = var.cloud_run_timeout >= 1 && var.cloud_run_timeout <= 3600
    error_message = "Timeout must be between 1 and 3600 seconds."
  }
}

variable "cloud_run_ingress" {
  description = "Ingress settings (all, internal, internal-and-cloud-load-balancing)"
  type        = string
  default     = "all"

  validation {
    condition     = contains(["all", "internal", "internal-and-cloud-load-balancing"], var.cloud_run_ingress)
    error_message = "Ingress must be one of: all, internal, internal-and-cloud-load-balancing."
  }
}

# =============================================================================
# CLOUD FUNCTIONS CONFIGURATION
# =============================================================================

variable "cloud_functions_runtime" {
  description = "Runtime for Cloud Functions"
  type        = string
  default     = "python311"

  validation {
    condition     = can(regex("^python3(9|10|11|12)$", var.cloud_functions_runtime))
    error_message = "Runtime must be python39, python310, python311, or python312."
  }
}

variable "cloud_functions_memory" {
  description = "Memory allocation for Cloud Functions (MB)"
  type        = number
  default     = 512

  validation {
    condition     = contains([128, 256, 512, 1024, 2048, 4096, 8192], var.cloud_functions_memory)
    error_message = "Memory must be one of: 128, 256, 512, 1024, 2048, 4096, 8192."
  }
}

variable "cloud_functions_timeout" {
  description = "Timeout for Cloud Functions (seconds)"
  type        = number
  default     = 540

  validation {
    condition     = var.cloud_functions_timeout >= 1 && var.cloud_functions_timeout <= 540
    error_message = "Timeout must be between 1 and 540 seconds."
  }
}

# =============================================================================
# NETWORKING CONFIGURATION
# =============================================================================

variable "create_vpc" {
  description = "Create custom VPC network (false to use default network)"
  type        = bool
  default     = false
}

variable "vpc_name" {
  description = "Custom VPC network name (only if create_vpc = true)"
  type        = string
  default     = "bmad-vpc"
}

variable "subnet_cidr" {
  description = "Subnet CIDR range (only if create_vpc = true)"
  type        = string
  default     = "10.0.0.0/24"
}

variable "enable_vpc_connector" {
  description = "Create Serverless VPC Connector for private resource access"
  type        = bool
  default     = false
}

# =============================================================================
# MONITORING CONFIGURATION
# =============================================================================

variable "enable_cloud_monitoring" {
  description = "Enable Cloud Monitoring dashboards and alerts"
  type        = bool
  default     = true
}

variable "enable_cloud_logging" {
  description = "Enable Cloud Logging sinks and exports"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "Log retention period in days"
  type        = number
  default     = 30

  validation {
    condition     = var.log_retention_days >= 1 && var.log_retention_days <= 3650
    error_message = "Log retention must be between 1 and 3650 days."
  }
}

variable "enable_error_reporting" {
  description = "Enable Error Reporting"
  type        = bool
  default     = true
}

variable "enable_cloud_trace" {
  description = "Enable Cloud Trace for distributed tracing"
  type        = bool
  default     = true
}

# =============================================================================
# BACKUP CONFIGURATION
# =============================================================================

variable "enable_firestore_backup" {
  description = "Enable automated Firestore backups"
  type        = bool
  default     = true
}

variable "firestore_backup_schedule" {
  description = "Cron schedule for Firestore backups (default: daily at 2 AM)"
  type        = string
  default     = "0 2 * * *"
}

variable "firestore_backup_retention_days" {
  description = "Retention period for Firestore backups (days)"
  type        = number
  default     = 30

  validation {
    condition     = var.firestore_backup_retention_days >= 7 && var.firestore_backup_retention_days <= 365
    error_message = "Backup retention must be between 7 and 365 days."
  }
}

# =============================================================================
# SECURITY CONFIGURATION
# =============================================================================

variable "enable_secret_manager" {
  description = "Enable Secret Manager for sensitive configuration"
  type        = bool
  default     = true
}

variable "allowed_ip_ranges" {
  description = "IP ranges allowed to access services (empty = all, use CIDR notation)"
  type        = list(string)
  default     = []

  validation {
    condition = alltrue([
      for cidr in var.allowed_ip_ranges :
      can(regex("^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$", cidr))
    ])
    error_message = "All IP ranges must be in valid CIDR notation (e.g., 10.0.0.0/8)."
  }
}

variable "enable_binary_authorization" {
  description = "Enable Binary Authorization for container images"
  type        = bool
  default     = false
}

# =============================================================================
# COST OPTIMIZATION CONFIGURATION
# =============================================================================

variable "enable_cost_alerts" {
  description = "Enable budget alerts for cost monitoring"
  type        = bool
  default     = true
}

variable "monthly_budget_amount" {
  description = "Monthly budget amount (USD) for cost alerts"
  type        = number
  default     = 1000

  validation {
    condition     = var.monthly_budget_amount >= 0
    error_message = "Budget amount must be >= 0."
  }
}

variable "budget_alert_thresholds" {
  description = "Budget alert thresholds (percentages)"
  type        = list(number)
  default     = [0.5, 0.8, 0.9, 1.0]

  validation {
    condition = alltrue([
      for threshold in var.budget_alert_thresholds :
      threshold > 0 && threshold <= 1.5
    ])
    error_message = "Alert thresholds must be between 0 and 1.5 (0% to 150%)."
  }
}

# =============================================================================
# LABELS AND TAGS
# =============================================================================

variable "additional_labels" {
  description = "Additional labels to apply to all resources"
  type        = map(string)
  default     = {}

  validation {
    condition = alltrue([
      for k, v in var.additional_labels :
      can(regex("^[a-z][a-z0-9_-]{0,62}$", k)) && can(regex("^[a-z0-9_-]{0,63}$", v))
    ])
    error_message = "Labels must follow GCP naming conventions."
  }
}

# =============================================================================
# NOTIFICATION CONFIGURATION
# =============================================================================

variable "notification_email" {
  description = "Email address for alerts and notifications"
  type        = string
  default     = ""

  validation {
    condition     = var.notification_email == "" || can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.notification_email))
    error_message = "Must be a valid email address or empty string."
  }
}

variable "notification_channels" {
  description = "Additional notification channel IDs (Slack, PagerDuty, etc.)"
  type        = list(string)
  default     = []
}
