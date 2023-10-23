import ResponseClass from "../utils/response.js";
import { Users } from "../models/user.model.js";

// get all users
const get = async (req, res, next) => {
  try {
    const dbResult = await Users.findAll();
    const responseSuccess = new ResponseClass.SuccessResponse(
      "success",
      200,
      "Fetching users successfully!",
      dbResult
    );
    return res.status(200).json(responseSuccess);
  } catch (error) {
    console.error(`Error while getting users`, error.message);
    next(error);
  }
};

// get user by id
const getById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    try {
      const dbResult = await Users.findOne({
        where: { id: userId },
        attributes: [
          "username",
          "email",
          "gender",
          "birthdate",
          "height",
          "weight",
          "fatneed",
          "proteinneed",
          "caloryneed",
          "fiberneed",
          "carbohidrateneed",
          "smoke",
          "alcho",
          "active",
          "cardiovascular",
        ],
      });
      // Capitalize the first letter of the gender
      const gender =
        dbResult.gender.charAt(0).toUpperCase() + dbResult.gender.slice(1);
      // Calculate age based on birthdate
      const birthdate = new Date(dbResult.birthdate);
      const ageDiffMs = Date.now() - birthdate.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      // Set success response properties
      const responseSuccess = new ResponseClass.SuccessResponse(
        "success",
        200,
        "Fetching user by Id successfully!",
        { ...dbResult.toJSON(), gender, age }
      );
      return res.status(200).json(responseSuccess);
    } catch (err) {
      const responseError = new ResponseClass.ErrorResponse(
        "error",
        400,
        "Fetching user by Id failed!"
      );
      return res.status(400).json(responseError);
    }
  } catch (err) {
    console.error(`Error while getting user by id`, err.message);
    next(err);
  }
};

// EXPORT
export default {
  get,
  getById,
};
