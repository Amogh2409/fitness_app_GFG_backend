// this file contains the logic for user registration and login

const UserServices = require('../services/userServices');
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison
const jwt = require('jsonwebtoken'); // Import jwt for token generation

exports.register = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const { email, password, age, gender, weight, height, goal, activity } = req.body;

    const duplicateUser = await UserServices.getUserByEmail(email);
    if (duplicateUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Register the user with extended details
    const user = await UserServices.registerUser(email, password, age, gender, weight, height, goal, activity);

    res.json({ status: "success", message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user by email
    const user = await UserServices.checkUser(email);
    if (!user) {
      // If user is not found, return error
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      // If passwords don't match, return error
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Generate JWT token
    let tokenData;
    tokenData = {
      id: user._id,
      email: user.email
    }; // data to be passed to the token


    const jwtSecretKey = "A123";

    const token = await UserServices.generateToken(tokenData, jwtSecretKey, "1h") // generate token

    // Send token and user details in the response
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

