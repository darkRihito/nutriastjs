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
    // console.log(error);
    const responseError = new ResponseClass.ErrorResponse(
      "failed",
      400,
      "Error fetching intake users!"
    );
    return responseError;
  }
};

export default {
  get,
  getById,
};
