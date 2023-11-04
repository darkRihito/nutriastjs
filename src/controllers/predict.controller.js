import ResponseClass from "../utils/response.js";
import fetch from "node-fetch";
import { Users } from "../models/user.model.js";
import { IntakeUsers } from "../models/intakeuser.model.js";

const predict = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const userdata = await Users.findOne({
      where: { id: userId },
    });
    if (
      req.body.cholesterol == null ||
      req.body.gluc == null ||
      req.body.ap_hi == null ||
      req.body.ap_lo == null ||
      req.body.smoke == null ||
      req.body.alco == null ||
      req.body.active == null
    ) {
      const responseError = new ResponseClass.ErrorResponse(
        "error",
        400,
        "Please fill all field correctly!"
      );
      return res.status(400).json(responseError);
    } else {
      const birthdate = new Date(userdata.birthdate);
      const ageDiffMs = Date.now() - birthdate.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      let gender = 0;
      if (userdata.gender == "male") {
        gender = 1;
      } else if (userdata.gender == "female") {
        gender = 2;
      }
      let data = {
        age: age,
        gender: gender,
        height: userdata.height,
        weight: userdata.weight,
        ap_hi: req.body.ap_hi,
        ap_lo: req.body.ap_lo,
        cholesterol: req.body.cholesterol,
        gluc: req.body.gluc,
        smoke: req.body.smoke,
        alco: req.body.alco,
        active: req.body.active,
      };
      try {
        const response = await fetch(
          "https://nutriastml-2qo27ggsha-et.a.run.app/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const jsonData = await response.json();
        let cardiovascular;
        if (jsonData.prediction == 1) {
          cardiovascular = "Aware";
        } else if (jsonData.prediction == 0) {
          cardiovascular = "Safe";
        }
        const updateValues = {
          cholesterol: req.body.cholesterol,
          glucose: req.body.gluc,
          cardiovascular: cardiovascular,
          smoke: req.body.smoke,
          alcho: req.body.alco,
          active: req.body.active,
        };
        await Users.update(updateValues, { where: { id: userId } });
        const responseSuccess = new ResponseClass.SuccessResponse(
          "success",
          200,
          "Predict sucess!",
          updateValues
        );
        return res.status(200).json(responseSuccess);
      } catch (error) {
        console.error(`Error while make post to API`, error.message);
        next(error);
      }
    }
  } catch (error) {
    console.error(`Error while predict cardiovascular`, error.message);
    next(error);
  }
};

export default { predict };
