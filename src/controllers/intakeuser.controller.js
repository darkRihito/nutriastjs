import { Users } from "../models/user.model.js";
import { IntakeUsers } from "../models/intakeuser.model.js";

import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import ResponseClass from "../utils/response.js";

const get = async (req, res, next) => {
  try {
    const dbResult = await IntakeUsers.findAll({});
    const responseSuccess = new ResponseClass.SuccessResponse("success", 200, "Fetching intake users successfully!", dbResult);
    return res.status(200).json(responseSuccess);
  } catch (error) {
    const responseError = new ResponseClass.ErrorResponse("failed", 400, "Error fetching intake users!");
    return responseError;
  }
};

const getById = async (req, res, next) => {
  const intakeUserId = req.user.id;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // cek apakah user sudah melakukan intake hari ini
    const check = await IntakeUsers.findOne({
      where: {
        userid: intakeUserId,
        createdAt: {
          [Op.gte]: today,
        },
      },
      attributes: ["healthstatus", "feedback"],
    });
    // console.log(today);
    if (check == null) {
      const responseSuccess = new ResponseClass.SuccessResponse("success", 200, "Fetching intake users successfully!", {
        healthstatus: "UNKNOWN",
        feedback: "You haven't fill intake form for today.",
      });
      return res.status(200).json(responseSuccess);
    } else {
      const responseSuccess = new ResponseClass.SuccessResponse("success", 200, "Fetching intake users successfully!", check);
      return res.status(200).json(responseSuccess);
    }
  } catch (error) {
    const responseError = new ResponseClass.ErrorResponse("failed", 400, "Error fetching intake users!");
    return responseError;
  }
};

const getHistorie = async (req, res, next) => {
 // const { intakeUserId } = req.params;
 console.log("AAAAAAAAAAAAAAAAA", req.user.id);
 const userId = req.user.id;
 try {
   const dbResult = await IntakeUsers.findAll({
     where: {
       userid: userId,
     },
     order: [["createdAt", "DESC"]],
   });
   const responseSuccess = new ResponseClass.SuccessResponse("success", 200, "Fetching intake users successfully!", dbResult);
   return res.status(200).json(responseSuccess);
 } catch (error) {
   const responseError = new ResponseClass.ErrorResponse("failed", 400, "Error fetching intake users!");
   return res.status(400).error;
 }
};

const createIntakeUsers = async (req, res, next) => {
  const userId = req.user.id;
  // console.log(userId);

  try {
    // console.log(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setHours(today.getHours() + 7);
    // console.log(req.body);

    const check = await IntakeUsers.findOne({
      where: {
        userid: userId,
        createdAt: {
          [Op.gte]: today,
        },
      },
    });
    // console.log("check: ", check);

    if (check !== null) {
      console.log("Success udah ngisi");
      const responseSuccess = new ResponseClass.SuccessResponse("success", 200, "You have filled this form today!");
      return responseSuccess;
    } else {
      let totalFat = req.body.totalFat;
      let totalProtein = req.body.totalProtein;
      let totalCalory = req.body.totalCalory;
      let totalFiber = req.body.totalFiber;
      let totalCarbohidrate = req.body.totalCarbohidrate;

      const userdata = await Users.findOne({ where: { id: userId } });
      const lackof = [];

      if (totalFat < userdata.fatneed) lackof.push("fat");
      if (totalProtein < userdata.proteinneed) lackof.push("protein");
      if (totalCalory < userdata.caloryneed) lackof.push("calory");
      if (totalFiber < userdata.fiberneed) lackof.push("fiber");
      if (totalCarbohidrate < (65 / 100) * req.body.caloryintake) lackof.push("carbohidrate");

      let feedback, status;

      if (lackof.length === 0) {
        feedback =
          "Great job on meeting your daily nutrition needs! Keep up the good work and continue to prioritize a balanced and healthy diet. Remember to listen to your body and make adjustments as necessary to maintain optimal health.";
        status = "EXCELLENT";
      } else {
        feedback = `You are not meeting your daily nutrition needs for ${lackof.join(", ")}. Consider adjusting your diet to include more of these nutrients.`;
        status = "POOR";

        // Generate feedback for each specific condition
        const conditions = {
          protein: "Increase your intake of protein-rich foods such as lean meats, poultry, fish, eggs, dairy, legumes, and nuts.",
          fat: "Include healthy sources of fats in your diet, such as avocados, nuts, seeds, and olive oil.",
          calory: "Ensure that you are consuming enough calories to meet your energy needs. Consider adding more nutrient-dense foods to your meals and snacks.",
          fiber: "Boost your fiber intake by incorporating more fruits, vegetables, whole grains, and legumes into your diet.",
          carbohidrate: "Include complex carbohydrates like whole grains, fruits, and vegetables to meet your carbohydrate needs.",
        };

        const specificFeedback = lackof.map((nutrient) => conditions[nutrient]);
        feedback += "\n\nSpecific recommendations:\n" + specificFeedback.join("\n");

        const createdAtValue = new Date();
        const updatedAtValue = new Date();
        createdAtValue.setHours(createdAtValue.getHours() + 7);
        updatedAtValue.setHours(updatedAtValue.getHours() + 7);
        try {
          const intakeUserId = uuidv4();
          const data = {
            id: intakeUserId,
            userid: userId,
            fatintake: totalFat,
            proteinintake: totalProtein,
            caloryintake: totalCalory,
            fiberintake: totalFiber,
            carbohidrateintake: totalCarbohidrate,
            healthstatus: status,
            feedback: feedback,
            createdAt: createdAtValue,
            updatedAt: updatedAtValue,
          };
          await IntakeUsers.create(data);
          const responseSuccess = new ResponseClass.SuccessResponse("success", 200, "Insert intake user success!", data);
          return res.status(200).json(responseSuccess);
        } catch (error) {
          const responseError = new ResponseClass.ErrorResponse("failed", 400, "Error creating intake users!");
          return res.status(400).json(error);
        }
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  get,
  getById,
  getHistorie,
  createIntakeUsers,
};
