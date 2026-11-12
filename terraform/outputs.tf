output "frontend_bucket_name" {
  description = "Nome do bucket S3 do frontend"
  value       = aws_s3_bucket.frontend.bucket
}

output "aws_region" {
  description = "Região AWS utilizada"
  value       = var.aws_region
}