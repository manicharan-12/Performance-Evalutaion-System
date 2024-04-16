const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const mongoose = require("mongoose");
const User = require("./models/user");
const Token = require("./models/token");

app.use(cors());
app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    mongoose
      .connect(
        "mongodb+srv://manicharan12:manicharan%40mongoDb@cluster0.p6x1kr4.mongodb.net/faculty_evaluation_system?retryWrites=true&w=majority",
      )
      .then(() => {
        app.listen(5000, () => {
          console.log("Server Running at http://localhost:5000");
        });
      })
      .catch();
  } catch (error) {
    console.log(`DataBase Error ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.post("/check-username", async (request, response) => {
  try {
    const { username } = request.body;
    const checkUsername = await User.findOne({ username: `${username}` });
    if (checkUsername === null) {
      response.json({ status: true });
    } else {
      response.json({ status: false });
    }
  } catch (error) {
    console.log(error);
    response.status(500);
    response.json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.post("/register/", async (request, response) => {
  try {
    const { name, email, designation, dept, username, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkEmailExist = await User.findOne({ email: email });
    if (checkEmailExist === null) {
      const newUser = new User({
        name,
        username,
        password: hashedPassword,
        email,
        designation,
        department: dept,
      });
      await newUser.save();
      response
        .status(200)
        .json({ success_msg: "User Registered Successfully" });
    } else {
      response
        .status(400)
        .json({ error_msg: "Email Already Exists! Try Choosing Another" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try Again Later",
    });
  }
});

app.post("/login", async (request, response) => {
  try {
    const { username, password } = request.body;
    const checkUsername = await User.findOne({ username: `${username}` });
    if (checkUsername !== null) {
      const checkPassword = await bcrypt.compare(
        password,
        checkUsername.password,
      );
      if (checkPassword === true) {
        const payload = { username: checkUsername.username };
        const jwt_token = jwt.sign(payload, "Anurag University");
        response.json({ jwt_token, id: checkUsername.id });
      } else {
        response.status(401).json({ error_msg: "Incorrect Password" });
      }
    } else {
      response.status(401).json({ error_msg: "Username Doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.post("/forgot-password", async (request, response) => {
  try {
    const { email } = request.body;
    const checkEmailExist = await User.findOne({ email: `${email}` });
    if (checkEmailExist !== null) {
      const token = crypto.randomBytes(32).toString("hex");
      console.log("Token:", token);
      const created_at = new Date();
      console.log("Expires at:", created_at);
      try {
        const newToken = new Token({
          email,
          token,
          created_at,
        });
        await newToken.save();
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "gade.manicharan12@gmail.com",
            pass: "ccos qjgg eozq qdyy",
          },
        });

        const options = {
          from: "Mani Charan Reddy Gade",
          to: `${email}`,
          subject: "Reset Password Link",
          html: `<p>Please click on this link to reset your password: 
      <a href="http://localhost:3000/resetPassword/${token}">http://localhost:3000/resetPassword/${token}</a></p>
      <br/>
      <h2>The link is valid for 5 minutes Only!</h2>
      `,
        };

        transporter.sendMail(options, async (error, info) => {
          if (error) {
            console.log(error);
          } else {
            response.status(200).json({
              success_msg: "Please check your email for the reset link",
              token,
            });
          }
        });
      } catch (error) {
        response
          .status(403)
          .json({ error_msg: "A mail has already sent! Please Check" });
        console.error("Query error:", error.message);
      }
    } else {
      response
        .status(404)
        .json({ error_msg: "Email Doesn't Exist! Please Check" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.post("/check/:token", async (request, response) => {
  try {
    const { token } = request.params;
    const checkTokenExist = await Token.findOne({ token: `${token}` });
    if (checkTokenExist !== null) {
      response.status(200).json("Success");
    } else {
      response.status(400).json("Invalid URl");
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.post("/resetPassword/:token", async (request, response) => {
  try {
    const { token } = request.params;
    const { email, password } = request.body;
    const checkMail = await Token.findOne({ email: `${email}` });
    if (checkMail !== null) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        { email: `${email}` },
        { $set: { password: `${hashedPassword}` } },
      );
      response.json({ success_msg: "Password Successfully Updated" });
      await Token.deleteOne({ email: `${email}` });
      console.log("Token Successfully deleted");
    } else {
      response.status(401).json({
        error_msg: "The email is Invalid. Enter the correct mail id",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.get("/profile/details/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const getUserDetails = await User.findOne({ _id: `${userId}` });
    response.json({
      name: getUserDetails.name,
      designation: getUserDetails.designation,
      department: getUserDetails.department,
      doj: getUserDetails.doj,
      teaching_experience: getUserDetails.teaching_experience,
      industry_experience: getUserDetails.industry_experience,
      total_experience: getUserDetails.total_experience,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.post("/update/profile", async (request, response) => {
  try {
    const {
      userId,
      doj,
      teachingExperience,
      industryExperience,
      totalExperience,
    } = request.body;
    await User.updateOne(
      { _id: `${userId}` },
      {
        doj: `${doj}`,
        teaching_experience: `${teachingExperience}`,
        industry_experience: `${industryExperience}`,
        total_experience: `${totalExperience}`,
      },
    );
    response.json("Status Updated");
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});
