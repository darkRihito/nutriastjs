import jwt from "jsonwebtoken";

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import ResponseClass from "../utils/response.js";
import { Users } from "../models/user.model.js";

const login = async (req, res, next) => {
  // const { userId } = req.params;
  if (!req.body.email || !req.body.password) {
    const responseError = new ResponseClass.ErrorResponse(
      "failed",
      400,
      "Email or Password is missing!"
    );
    return res.status(400).json(responseError);
  } else {
    // Find email from request body in the database
    const userRegistered = await Users.findOne({
      where: { email: req.body.email },
    });
    if (userRegistered == null) {
      const responseError = new ResponseClass.ErrorResponse(
        "failed",
        400,
        "Email not found!"
      );
      return res.status(400).json(responseError);
    } else {
      // Compare request body password with password in the database
      const matchPassword = await bcrypt.compare(
        req.body.password,
        userRegistered.password
      );
      if (!matchPassword) {
        const responseError = new ResponseClass.ErrorResponse(
          "failed",
          400,
          "Wrong password!"
        );
        return res.status(400).json(responseError);
      } else {
        // Generate a token for this user and send it to client side
        try {
          const token = jwt.sign(
            { userRegistered },
            process.env.ACCESS_TOKEN_SECRET
          );
          return res
            .cookie("access_token", token, {
              httpOnly: true,
              // maxAge: 86400000, // Cookie will expire after 1 day (in milliseconds)
              // secure: process.env.NODE_ENV === "production",
              expiresIn: "7d",
            })
            .status(200)
            .json({
              message: "Logged in successfully!",
              data: {
                userId: userRegistered.id,
                authenticationToken: token,
                username: userRegistered.username,
              },
            });
        } catch (error) {
          console.error(`Error while login user`, error.message);
          return res.status(500).json({ message: "Internal server error" });
        }
      }
    }
  }
};

// register user
const register = async (req, res, next) => {
  try {
    // Check if any required fields are missing or invalid
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.username ||
      !req.body.birthdate ||
      !req.body.gender ||
      !req.body.height ||
      !req.body.weight
    ) {
      const responseError = new ResponseClass.ErrorResponse(
        "error",
        400,
        "Please fill all fields correctly!"
      );
      return res.status(400).json(responseError);
    } else {
      // Parse the birthdate from the request body
      let parsedBirthdate = new Date(req.body.birthdate);
      // Variable initialization
      let age = 0;
      let fatneed = 0.0;
      let proteinneed = 0.0;
      let caloryneed = 0.0;
      let fiberneed = 0.0;
      let carbohidrateneed = 0.0; // Kebutuhan karbohidrat: 65% x kebutuhan kalori
      let bmr = 0.0;
      // Activity factor numbers
      let lightphysical = 1.375; // pekerja kantor yang menggunakan komputer
      let mediumphysical = 1.55; // olahragawan biasa
      let hardphysical = 1.725; // atlet atau orang yang melakukan pekerjaan fisik berat
      // Calculate age
      let birthdate = new Date(req.body.birthdate);
      let ageDiffMs = Date.now() - birthdate.getTime();
      let ageDate = new Date(ageDiffMs);
      age = Math.abs(ageDate.getUTCFullYear() - 1970);
      // Calculate BMR (Basal Metabolic Rate) using Harris-Benedict equation
      if (req.body.gender == "male") {
        // BMR = 88,362 + (13,397 x berat badan dalam kg) + (4,799 x tinggi badan dalam cm) – (5,677 x usia dalam tahun)
        bmr = 88.362 + 13.397 * req.body.weight + 4.799 * req.body.height - 5.677 * age;
      } else if (req.body.gender == "female") {
        // BMR = 447,593 + (9,247 x berat badan dalam kg) + (3,098 x tinggi badan dalam cm) – (4,330 x usia dalam tahun)
        bmr = 447.593 + 9.247 * req.body.weight + 3.098 * req.body.height - 4.33 * age;
      }
      // Total Energy Expenditure = Basal Metabolic Rate * Physical Activity Factor
      caloryneed = bmr * mediumphysical;
      carbohidrateneed = 65/100*caloryneed;
      // Total kalori harian x Persentase lemak (20%) / 9
      fatneed = (0.2 * caloryneed) / 9;
      // Kebutuhan protein adalah sebesar 15% dari kebutuhan kalori total. Setelah menemukan besarnya kalori untuk protein, ubahlah ke dalam gram. Protein sebanyak 1 gram setara dengan 4 kalori.
      proteinneed = (0.15 * caloryneed) / 4;
      fiberneed = 30; // dalam gram
      const emailRegexp =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      // Check if email is valid
      if (emailRegexp.test(req.body.email) == false) {
        const responseError = new ResponseClass.ErrorResponse(
          "error",
          400,
          "Email is invalid!"
        );
        return res.status(400).json(responseError);
      } else {
        // Check if email is already registered
        const emailuserRegistered = await Users.findOne({
          where: { email: req.body.email },
        });
        if (emailuserRegistered == null) {
          // Generate salt and hash password
          const salt = await bcrypt.genSalt();
          const hashPass = await bcrypt.hash(req.body.password, salt);
          // Create data object for user registration
          let data = {
            id: uuidv4(),
            name: req.body.name,
            email: req.body.email,
            password: hashPass,
            username: req.body.username,
            birthdate: parsedBirthdate,
            gender: req.body.gender,
            height: req.body.height,
            weight: req.body.weight,
            fatneed: fatneed,
            proteinneed: proteinneed,
            caloryneed: caloryneed,
            fiberneed: fiberneed,
            carbohidrateneed: carbohidrateneed,
          };
          try {
            // Add user to the database
            await Users.create(data);
            // Set success response properties
            const responseSuccess = new ResponseClass.SuccessResponse(
              "success",
              200,
              "Register success!",
              data
            );
            return res.status(200).json(responseSuccess);
          } catch (error) {
            const responseError = new ResponseClass.ErrorResponse(
              "error",
              400,
              "Register failed!"
            );
            return res.status(400).json(responseError);
          }
        } else {
          const responseError = new ResponseClass.ErrorResponse(
            "error",
            400,
            "Email has been registered!"
          );
          return res.status(400).json(responseError);
        }
      }
    }
  } catch (error) {
    console.error(`Error while register user!`, error.message);
    next(error);
  }
};

const logout = async (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out!" });
};

// EXPORT
export default {
  login,
  register,
  logout,
};
