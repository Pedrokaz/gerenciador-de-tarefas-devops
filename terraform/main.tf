resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-frontend-pedro-2026"

  tags = {
    Name        = "Frontend ${var.project_name}"
    Environment = var.environment
    Project     = var.project_name
  }
}