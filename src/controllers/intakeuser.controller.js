import { Users } from "../models/user.model.js";
import { IntakeUsers } from "../models/intakeuser.model.js";

import ResponseClass from "../utils/response.js";

const get = async (req, res, next) => {
  try {
    const dbResult = await IntakeUsers.findAll({});
    const responseSuccess = new ResponseClass.SuccessResponse(
      "success",
      200,
      "Fetching intake users successfully!",
      dbResult
    );
    return res.status(200).json(responseSuccess);
  } catch (error) {
    const responseError = new ResponseClass.ErrorResponse(
      "failed",
      400,
      "Error fetching intake users!"
    );
    return responseError;
  }
};

const getById = async (req, res, next) => {
  const { intakeUserId } = req.params;
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
    if (check == null) {
      const responseSuccess = new ResponseClass.SuccessResponse(
        "success",
        200,
        "Fetching intake users successfully!",
        {
          healthstatus: "UNKNOWN",
          feedback: "You haven't fill intake form for today.",
        }
      );
      return res.status(200).json(responseSuccess);
    } else {
      const responseSuccess = new ResponseClass.SuccessResponse(
        "success",
        200,
        "Fetching intake users successfully!",
        check
      );
    }
  } catch (error) {
    const responseError = new ResponseClass.ErrorResponse(
      "failed",
      400,
      "Error fetching intake users!"
    );
    return responseError;
  }
};

const getHistory = async (req) => {
  const { intakeUserId } = req.params;
  try {
    const dbResult = await IntakeUsers.findAll({
      where: {
        userid: intakeUserId,
      },
      order: [["createdAt", "DESC"]],
    });
    const responseSuccess = new ResponseClass.SuccessResponse(
      "success",
      200,
      "Fetching intake users successfully!",
      dbResult
    );
    return responseSuccess;
  } catch (error) {
    const responseError = new ResponseClass.ErrorResponse(
      "failed",
      400,
      "Error fetching intake users!"
    );
    return responseError;
  }
};

const createIntakeUsers = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setHours(today.getHours() + 7);
    const check = await IntakeUsers.findOne({
      where: {
        userid: userId,
        createdAt: {
          [Op.gte]: today,
        },
      },
    });
    if (check !== null) {
      const responseSuccess = new ResponseClass.SuccessResponse(
        "success",
        200,
        "You have filled this form today!"
      );
      return responseSuccess;
    } else {

      // FE bakal kirim request body berupa jumlah Protein, Energi, Karbohidrat Lemak, Serat

      // let totalFat = 0;
      // let totalProtein = 0;
      // let totalCalory = 0;
      // let totalFiber = 0;
      // let totalCarbohidrate = 0;
      // let inputData = req.body;

    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  get,
  getById,
  getHistory,
  createIntakeUsers,
};
