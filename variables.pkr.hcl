variable "project_id" {
  type    = string
  default = "dev-nscc"
}
variable "source_image" {
  type    = string
  default = "centos-stream-8-v20240110"
}
variable "zone" {
  type    = string
  default = "us-east5-a"
}
variable "image_family" {
  type    = string
  default = "centos-stream-8"
}
variable "ssh_username" {
  type    = string
  default = "centos"
}
