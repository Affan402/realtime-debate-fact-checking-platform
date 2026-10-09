terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 5.0" 
        }
    }
}

provider "aws" {
    region = "eu-north-1"
}

resource "aws_security_group" "debate_sg" {
    name    = "debate-sg-terraform"
    description = "Security group for debate platform (terraform)"
    
    #Allow SSH (port 22) from anywhere
    ingress {
        description = "SSH access"
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    # Allow HTTP (port 80) from anywhere
    ingress {
        description = "HTTP access"
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    # Allow HTTPS (port 443) from anywhere
    ingress {
        description = "HTTPS access"
        from_port = 443
        to_port = 443
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    #Allow API access (port 5000) from anywhere
    ingress {
        description = "API access (port 5000)"
        from_port = 5000
        to_port = 5000
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    #Allow all outbound traffic
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}