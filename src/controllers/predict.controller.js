import ResponseClass from "../utils/response.js";

const predict = async (req, res, next) => {
  // get userid from params
  const { userId } = request.params;
  try {
    // get user data profile
    try {
      const userdata = await Users.findOne({
        where: { id: userId },
      });
    } catch (error) {
      console.error("Error while getting data user to predict", error.message);
    }
    // get data from redict form
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
      //  make new data object
      let data = {
        age: age,
        gender: gender,
        height: userdata.height,
        weight: userdata.weight,
        ap_hi: request.body.ap_hi,
        ap_lo: request.body.ap_lo,
        cholesterol: request.body.cholesterol,
        gluc: request.body.gluc,
        smoke: request.body.smoke,
        alco: request.body.alco,
        active: request.body.active,
      };
      try {
        // Make a POST request to the prediction API
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
        // Update the database with prediction data
        const updateValues = {
          cholesterol: request.body.cholesterol,
          glucose: request.body.gluc,
          cardiovascular: cardiovascular,
          smoke: request.body.smoke,
          alcho: request.body.alco,
          active: request.body.active,
        };
        await Users.update(updateValues, { where: { id: userId } });
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

export default predict;
