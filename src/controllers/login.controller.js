import authorization from "../middleware/authorization.js";
import jwt from 'jsonwebtoken';

const post = async (req, res, next) => {
  const { userId, password } = req.params;
  try {
    const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET);
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Logged in successfully 😊 👌" });
  } catch (error) {
    console.error(`Error while login user`, error.message);
    next(error);
  }
};

// EXPORT
export default {
  post,
};
