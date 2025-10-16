# BMad Framework - Storage Configuration
# Firestore and Cloud Storage resources
#
# Version: 1.0
# Created: 2025-10-15

# =============================================================================
# FIRESTORE DATABASE
# =============================================================================

resource "google_firestore_database" "bmad_database" {
  project     = var.project_id
  name        = var.firestore_database_id
  location_id = var.firestore_location_id
  type        = "FIRESTORE_NATIVE"

  # Delete protection - prevent accidental deletion
  deletion_policy = "DELETE"

  depends_on = [google_project_service.required_apis]
}

# Firestore indexes for optimized queries
resource "google_firestore_index" "projects_by_status" {
  project    = var.project_id
  database   = google_firestore_database.bmad_database.name
  collection = "projects"

  fields {
    field_path = "status"
    order      = "ASCENDING"
  }

  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}

resource "google_firestore_index" "stories_by_epic_status" {
  project    = var.project_id
  database   = google_firestore_database.bmad_database.name
  collection = "stories"

  fields {
    field_path = "projectId"
    order      = "ASCENDING"
  }

  fields {
    field_path = "epicId"
    order      = "ASCENDING"
  }

  fields {
    field_path = "status"
    order      = "ASCENDING"
  }

  fields {
    field_path = "sequence"
    order      = "ASCENDING"
  }
}

resource "google_firestore_index" "gates_by_project" {
  project    = var.project_id
  database   = google_firestore_database.bmad_database.name
  collection = "gates"

  fields {
    field_path = "projectId"
    order      = "ASCENDING"
  }

  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}

# =============================================================================
# CLOUD STORAGE BUCKETS
# =============================================================================

# Templates bucket
resource "google_storage_bucket" "templates" {
  name          = local.bucket_templates
  project       = var.project_id
  location      = var.region
  storage_class = var.storage_class

  uniform_bucket_level_access = true

  versioning {
    enabled = var.enable_storage_versioning
  }

  lifecycle_rule {
    condition {
      num_newer_versions = 3
      with_state         = "ARCHIVED"
    }
    action {
      type = "Delete"
    }
  }

  labels = merge(local.common_labels, {
    "purpose" = "templates"
  })

  depends_on = [google_project_service.required_apis]
}

# Artifacts bucket
resource "google_storage_bucket" "artifacts" {
  name          = local.bucket_artifacts
  project       = var.project_id
  location      = var.region
  storage_class = var.storage_class

  uniform_bucket_level_access = true

  versioning {
    enabled = var.enable_storage_versioning
  }

  lifecycle_rule {
    condition {
      age                = var.storage_lifecycle_age_days
      matches_storage_class = ["STANDARD"]
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  labels = merge(local.common_labels, {
    "purpose" = "artifacts"
  })

  depends_on = [google_project_service.required_apis]
}

# Knowledge base bucket
resource "google_storage_bucket" "kb" {
  name          = local.bucket_kb
  project       = var.project_id
  location      = var.region
  storage_class = var.storage_class

  uniform_bucket_level_access = true

  versioning {
    enabled = var.enable_storage_versioning
  }

  labels = merge(local.common_labels, {
    "purpose" = "knowledge-base"
  })

  depends_on = [google_project_service.required_apis]
}

# Data bucket (checklists, workflows, prompts)
resource "google_storage_bucket" "data" {
  name          = local.bucket_data
  project       = var.project_id
  location      = var.region
  storage_class = var.storage_class

  uniform_bucket_level_access = true

  versioning {
    enabled = var.enable_storage_versioning
  }

  labels = merge(local.common_labels, {
    "purpose" = "data"
  })

  depends_on = [google_project_service.required_apis]
}

# Backups bucket
resource "google_storage_bucket" "backups" {
  count         = var.enable_firestore_backup ? 1 : 0
  name          = "${var.project_id}-bmad-backups"
  project       = var.project_id
  location      = var.region
  storage_class = "NEARLINE"

  uniform_bucket_level_access = true

  lifecycle_rule {
    condition {
      age = var.firestore_backup_retention_days
    }
    action {
      type = "Delete"
    }
  }

  labels = merge(local.common_labels, {
    "purpose" = "backups"
  })

  depends_on = [google_project_service.required_apis]
}

# =============================================================================
# FIRESTORE BACKUP SCHEDULE
# =============================================================================

resource "google_firestore_backup_schedule" "daily_backup" {
  count    = var.enable_firestore_backup ? 1 : 0
  project  = var.project_id
  database = google_firestore_database.bmad_database.name

  retention = "${var.firestore_backup_retention_days * 86400}s"

  daily_recurrence {}
}
