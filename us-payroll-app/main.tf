module "us_payroll" {
  source = "../modules/payroll-app"
  app_region = "us-west-2"
  ami = "ami-075686beab831bb7f"
}
