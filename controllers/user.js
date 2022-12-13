import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config();
// token secret better to keep it in env file;
const secret = process.env.JWT_SECRET;

// controller signin function;
export const signin = async (req, res) => {

  // destructuring email and pasword form request body from front end;
  const { email, password } = req.body;

  try {
    // checking if the user has already signed up by his email in DB;
    const isUserExist = await User.findOne({ email });

    if (!isUserExist)
      return res.status(404).json({ message: "User not found " });

    // if user has already signed up now checking the given password and compare it with password saved in DB ;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid Pasword" });

    // assigning the token to the signed in user using his credential like email and id;
    const token = jwt.sign(
      { email: isUserExist.email, id: isUserExist._id },
      secret,
      { expiresIn: "1hr" }
    );

    res.status(200).json({ result: isUserExist, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// signup logic;
export const signup = async (req, res) => {
  // destructuring all user info from request body;
  const { firstName, lastName, password, showPassword, email } = req.body;

  try {
    // checking if the user has already signed up by his email in DB;
    const isUserExist = await User.findOne({ email });
    if (isUserExist)
      return res.status(400).json({ message: "User already exist. Sign in instead" });

    // if user has already signed up now checking the given password and compare it with password saved in DB ;
    if (password !== showPassword)
      return res.status(404).json({ message: "Password don't match" });

    // if user has not signed up so here hasing the password and slating 12 times;
    const hashedPassword = await bcrypt.hash(password, 12);

    //user credential which we wanna svae to DB;
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    // creating token for the newly signed up user;
    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1hr",
    });
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
