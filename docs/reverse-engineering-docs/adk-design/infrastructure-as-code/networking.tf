# BMad Framework - Networking Configuration
# VPC, subnets, and connectivity
#
# Version: 1.0
# Created: 2025-10-15

# =============================================================================
# CUSTOM VPC (Optional)
# =============================================================================

resource "google_compute_network" "bmad_vpc" {
  count                   = var.create_vpc ? 1 : 0
  project                 = var.project_id
  name                    = var.vpc_name
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"

  depends_on = [google_project_service.required_apis]
}

resource "google_compute_subnetwork" "bmad_subnet" {
  count         = var.create_vpc ? 1 : 0
  project       = var.project_id
  name          = "${var.vpc_name}-subnet"
  ip_cidr_range = var.subnet_cidr
  region        = var.region
  network       = google_compute_network.bmad_vpc[0].id
}

# =============================================================================
# SERVERLESS VPC CONNECTOR (Optional)
# =============================================================================

resource "google_vpc_access_connector" "bmad_connector" {
  count         = var.enable_vpc_connector ? 1 : 0
  project       = var.project_id
  name          = "bmad-vpc-connector"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
  network       = var.create_vpc ? google_compute_network.bmad_vpc[0].name : "default"

  depends_on = [google_project_service.required_apis]
}

# =============================================================================
# FIREWALL RULES (if custom VPC)
# =============================================================================

resource "google_compute_firewall" "allow_internal" {
  count   = var.create_vpc ? 1 : 0
  project = var.project_id
  name    = "${var.vpc_name}-allow-internal"
  network = google_compute_network.bmad_vpc[0].name

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = [var.subnet_cidr]
}
