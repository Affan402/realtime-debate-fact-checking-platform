import UserModel from "../models/Usermodel.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import OTPModel from "../models/otpmodel.js";

// Create transporter at module level
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS,
  },
});

// Verify transporter on startup
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email transporter error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const Signup = async (Req, Res) => {
  try {
    const { username, email, password } = Req.body;
    
    if (!username || !email || !password) {
      return Res.status(400).json({
        message: "Required fields are missing",
        status: false,
        Data: null,
      });
    }

    const IsExists = await UserModel.findOne({ email });
    if (IsExists) {
      return Res.status(409).json({
        message: "User Already Exists",
        status: false,
        Data: null
      });
    }

    const Hashpassword = await bcrypt.hash(password, 8);
    const Userobj = { username, email, password: Hashpassword };
    
    const User = await UserModel.create(Userobj);
    
    const otp = uuidv4().slice(0, 6);
    console.log("Generated OTP:", otp, "for user:", email);

    await transporter.sendMail({
      from: `"HiringMine" <${process.env.EMAIL}>`,
      to: email,
      subject: "Email Verification - HiringMine",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 150px;
            height: auto;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 10px;
        }
        .main-content {
            font-size: 16px;
            color: #555;
            margin-bottom: 20px;
        }
        .verification-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            font-size: 20px;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            letter-spacing: 3px;
        }
        .footer {
            font-size: 12px;
            color: #888;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://www.hiringmine.com/assets/Hiring%20Mine%20Logo-453a72d3.png" alt="HiringMine Logo">
        </div>
        <div class="greeting">
            <p>Hi ${username},</p>
        </div>
        <div class="main-content">
            <p>Thank you for signing up with HiringMine! We're excited to have you on board.</p>
            <p>To get started, please verify your email address by using the OTP below:</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <div class="verification-button">${otp}</div>
        </div>
        <div class="main-content">
            <p><strong>Note:</strong> This OTP will expire in 10 minutes.</p>
        </div>
        <div class="footer">
            <p>If you didn't sign up for this account, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} HiringMine. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
    });

    const otpobj = {
      email: email,
      otp: otp
    };

    await OTPModel.create(otpobj);
    
    return Res.status(201).json({
      message: "User Signup Successfully. Please check your email for OTP.",
      status: true,
      Data: {
        _id: User._id,
        username: User.username,
        email: User.email
      }
    });
    
  } catch (error) {
    console.error("Signup error:", error);
    return Res.status(500).json({
      message: error.message || "Something Went wrong",
      status: false,
      Data: null,
    });
  }
};

export const Verifyotp = async (Req, Res) => {
  try {
    const { email, otp } = Req.body;

    if (!email || !otp) {
      return Res.status(400).json({
        message: "Required Field are missing!",
        Data: null,
        status: false,
      });
    }

    const IsExists = await OTPModel.findOne({ email, Isverified: false });
    
    console.log("OTP Check for email:", email, "OTP provided:", otp);

    if (!IsExists) {
      return Res.status(404).json({
        message: "Invalid OTP or OTP expired",
        status: false,
        Data: null,
      });
    }

    if (IsExists.otp !== otp) {
      return Res.status(400).json({
        message: "Invalid OTP",
        status: false,
        Data: null,
      });
    }

    await OTPModel.findByIdAndUpdate(IsExists.id || IsExists._id, { Isverified: true });
    await UserModel.findOneAndUpdate({ email }, { Isverifed: true });

    return Res.status(200).json({
      message: "OTP verified successfully",
      status: true,
      Data: null,
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    return Res.status(500).json({
      message: error.message || "Something went wrong",
      Data: null,
      status: false,
    });
  }
};

export const ResetOTP = async (Req, Res) => {
  try {
    const { email } = Req.body;

    if (!email) {
      return Res.status(400).json({
        message: "Required Field are missing!",
        Data: null,
        status: false,
      });
    }
  
    const IsExists = await UserModel.findOne({ email });

    if (!IsExists) {
      return Res.status(404).json({
        message: "Invalid Email Address!",
        Data: null,
        status: false,
      });
    }

    const otp = uuidv4().slice(0, 6);
    console.log("Reset OTP:", otp, "for user:", email);

    await transporter.sendMail({
      from: `"HiringMine" <${process.env.EMAIL}>`,
      to: email,
      subject: "Email Verification - HiringMine",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 150px;
            height: auto;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 10px;
        }
        .main-content {
            font-size: 16px;
            color: #555;
            margin-bottom: 20px;
        }
        .verification-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            font-size: 20px;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            letter-spacing: 3px;
        }
        .footer {
            font-size: 12px;
            color: #888;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://www.hiringmine.com/assets/Hiring%20Mine%20Logo-453a72d3.png" alt="HiringMine Logo">
        </div>
        <div class="greeting">
            <p>Hi ${IsExists.username},</p>
        </div>
        <div class="main-content">
            <p>You requested a new OTP to verify your email address.</p>
            <p>Please use the OTP below:</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <div class="verification-button">${otp}</div>
        </div>
        <div class="main-content">
            <p><strong>Note:</strong> This OTP will expire in 10 minutes.</p>
        </div>
        <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} HiringMine. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
    });

    const otpobj = {
      email: email,
      otp: otp
    };

    await OTPModel.create(otpobj);
    
    return Res.status(200).json({
      message: "OTP Reset Successfully",
      status: true,
      Data: null
    });

  } catch (error) {
    console.error("Reset OTP error:", error);
    return Res.status(500).json({
      message: error.message || "Something went wrong",
      Data: null,
      status: false,
    });
  }
}

export const Forgetpassword = async (Req, Res) => {
  try {
    const { email } = Req.body;

    if (!email) {
      return Res.status(400).json({
        message: "Required field are missing",
        Data: null,
        status: false,
      });
    }
    
    const IsExits = await UserModel.findOne({ email });

    if (!IsExits) {
      return Res.status(404).json({
        message: "Invalid email",
        Data: null,
        status: false,
      });
    }

    const Privatekey = process.env.PRIVATE_KEY;
    const token = jwt.sign({ email: IsExits.email, id: IsExits._id }, Privatekey, { expiresIn: "1h" });
    const FE_URL = `${process.env.FRONTEND_URL}/change-password?q=${token}`;

    await transporter.sendMail({
      from: `"HiringMine" <${process.env.EMAIL}>`,
      to: email,
      subject: "Reset Your Password - HiringMine",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .main-content {
            font-size: 16px;
            color: #555;
            margin-bottom: 20px;
        }
        .reset-button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            font-size: 16px;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
        }
        .reset-button:hover {
            background-color: #0056b3;
        }
        .footer {
            font-size: 12px;
            color: #888;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://www.hiringmine.com/assets/Hiring%20Mine%20Logo-453a72d3.png" alt="HiringMine Logo" style="max-width: 150px;">
        </div>
        <div class="main-content">
            <p>Hi ${IsExits.username},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${FE_URL}" class="reset-button">Reset Password</a>
        </div>
        <div class="main-content">
            <p><strong>Note:</strong> This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} HiringMine. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
    });
    
    return Res.status(200).json({
      message: "Please check your email",
      status: true,
    });
  } catch (error) {
    console.error("Forget password error:", error);
    return Res.status(500).json({
      message: error.message || "Something went wrong",
      Data: null,
      status: false,
    });
  }
}

export const Changepassword = async (Req, Res) => {
  try {
    const { token, newpassword } = Req.body;
    
    if (!token || !newpassword) {
      return Res.status(400).json({
        message: "Required field are missing",
        Data: null,
        status: false,
      });
    }
    
    const Privatekey = process.env.PRIVATE_KEY;
    const Isverify = jwt.verify(token, Privatekey);

    if (!Isverify.id || !Isverify.email) {
      return Res.status(400).json({
        message: "Invalid token",
        Data: null,
        status: false,
      });
    }

    const newhashpassword = await bcrypt.hash(newpassword, 10);
    await UserModel.findByIdAndUpdate(Isverify.id, { password: newhashpassword });
    
    return Res.status(200).json({
      message: "Your password has successfully changed",
      Data: null,
      status: true,
    });
  } catch (error) {
    console.error("Change password error:", error);
    if (error.name === 'JsonWebTokenError') {
      return Res.status(400).json({
        message: "Invalid token",
        Data: null,
        status: false,
      });
    }
    if (error.name === 'TokenExpiredError') {
      return Res.status(400).json({
        message: "Token has expired",
        Data: null,
        status: false,
      });
    }
    return Res.status(500).json({
      message: "Something went wrong",
      Data: null,
      status: false,
    });
  }
}

export const Login = async (Req, Res) => {
  try {
    const { email, password } = Req.body;
    
    if (!email || !password) {
      return Res.status(400).json({
        message: "Email and password are required",
        Data: null,
        status: false
      });
    }

    const IsuserExists = await UserModel.findOne({ email });

    if (!IsuserExists) {
      return Res.status(401).json({
        message: "Invalid Email And password",
        Data: null,
        status: false
      });
    }

    const PasswordVerified = await bcrypt.compare(password, IsuserExists.password);

    if (!PasswordVerified) {
      return Res.status(401).json({
        message: "Invalid Email And password",
        Data: null,
        status: false
      });
    }

    if (!IsuserExists.Isverifed) {
      return Res.status(403).json({
        message: "Please verify your email before logging in",
        Data: null,
        status: false
      });
    }
 
    const Privatekey = process.env.PRIVATE_KEY;
    const token = jwt.sign({ email: IsuserExists.email, id: IsuserExists._id }, Privatekey, { expiresIn: '10h' });

    return Res.status(200).json({
      message: 'User Login Successfully',
      Data: { 
        user: {
          _id: IsuserExists._id,
          username: IsuserExists.username,
          email: IsuserExists.email,
          Isverifed: IsuserExists.Isverifed
        }, 
        token 
      },
      status: true
    });

  } catch (error) {
    console.error("Login error:", error);
    return Res.status(500).json({
      message: error.message || "Something went wrong",
      Data: null,
      status: false
    });
  }
};