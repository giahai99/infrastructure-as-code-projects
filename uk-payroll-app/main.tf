module "uk_payroll" {
  source = "../modules/payroll-app"
  app_region = "eu-west-2"
  ami = "ami-0a94c8e4ca2674d5a"
}
