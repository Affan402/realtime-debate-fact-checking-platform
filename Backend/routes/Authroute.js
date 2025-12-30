import express from "express"
import { Signup , Login , Verifyotp , ResetOTP , Forgetpassword , Changepassword} from "../controllers/Auth.js";
import rateLimit from "express-rate-limit";
const route = express.Router();




/* Rate Limiter */

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: 'draft-7', // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});



route.post("/signup",limiter,Signup)
route.post("/login",limiter,Login)




route.post("/verify-otp" ,limiter , Verifyotp)
route.post("/reset-otp",limiter,ResetOTP)
route.post("/forgetpassowrd",limiter, Forgetpassword)
route.post("/changepassword",limiter,Changepassword)



export default route