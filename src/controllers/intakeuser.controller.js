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
    console.log(error);
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
};
