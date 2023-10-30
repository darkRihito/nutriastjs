import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

function authorization(req, res, next) {
  const token = req.cookies.access_token;
  // console.log(token)
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Token tidak valid",
    });
  }
  try {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = data.userRegistered;
    // console.log(req.user);
    // req.userRole = data.role;
    return next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
}

export default authorization;
