variable "aws_region" {
  description = "Região da AWS onde a infraestrutura será criada"
  type        = string
  default     = "sa-east-1"
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "gerenciador-tarefas-devops"
}

variable "environment" {
  description = "Ambiente da aplicação"
  type        = string
  default     = "development"
}