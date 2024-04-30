const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

const User = require("./models/user");
const Token = require("./models/token");
const AcademicWorkPartA = require("./models/Academic Work/partA");
const AcademicWorkPartB = require("./models/Academic Work/partB");
const PhdConformation = require("./models/Research And Development/rdConformation");
const ResearchAndDevelopmentPartB = require("./models/Research And Development/partB");
const ResearchAndDevelopmentPartC = require("./models/Research And Development/partC");

const conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
});

const storage = new GridFsStorage({
  url: "mongodb+srv://manicharan12:manicharan%40mongoDb@cluster0.p6x1kr4.mongodb.net/faculty_evaluation_system?retryWrites=true&w=majority",
  file: (req, file) => {
    return {
      filename: "file_" + Date.now(),
    };
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const initializeDbAndServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://manicharan12:manicharan%40mongoDb@cluster0.p6x1kr4.mongodb.net/faculty_evaluation_system?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    app.listen(5000, () => {
      console.log("Server Running at http://localhost:5000");
    });
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
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
            pass: "psuh fkfz zshn kbwg",
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

app.get("/year/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const getYear = await AcademicWorkPartA.findOne(
      { userId },
      { academic_year: 1 },
    );
    response.json(getYear);
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post("/academic-work-1", async (request, response) => {
  try {
    const {
      userId,
      tableData,
      year,
      averageResultPercentage,
      averageFeedbackPercentage,
      totalApiScore,
    } = request.body;
    const existingData = await AcademicWorkPartA.findOne({
      userId,
      academic_year: year,
    });
    if (existingData) {
      existingData.tableData = tableData;
      existingData.averageResultPercentage = averageResultPercentage;
      existingData.averageFeedbackPercentage = averageFeedbackPercentage;
      existingData.totalApiScore = totalApiScore;
      await existingData.save();
    } else {
      const newAcademicWork = new AcademicWorkPartA({
        userId,
        academic_year: year,
        academic_work_part_a: tableData,
        averageResultPercentage,
        averageFeedbackPercentage,
        totalApiScore,
      });
      await newAcademicWork.save();
    }

    response.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/academic-work-1/data/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const getUserDetails = await AcademicWorkPartA.findOne({ userId });
    response.json(getUserDetails);
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post("/academic-work-2", upload.single("file"), async (req, res) => {
  try {
    console.log(req.body);
    const editorContent = req.body.editorContent;
    const uploadedFile = req.file;

    const data = new AcademicWorkPartB({
      editorContent,
      filename: uploadedFile.filename,
      mimetype: uploadedFile.mimetype,
      size: uploadedFile.size,
    });

    await data.save();

    res
      .status(200)
      .json({ message: "File and editor content uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.post("/rdConfo", async (request, response) => {
  try {
    const { userId, possesPhD, registerPhD, receivedPhd, tableData } =
      request.body;
    const existingData = await PhdConformation.findOne({ userId });
    if (existingData) {
      existingData.registerPhD = registerPhD;
      existingData.receivedPhd = receivedPhd;
      existingData.phDDetails = tableData;
      const res = await existingData.save();
    } else {
      const newPhdConformationData = new PhdConformation({
        userId,
        possesPhD,
        registerPhD,
        receivedPhd,
        phDDetails: tableData,
      });

      const res = await newPhdConformationData.save();
    }
    response.json("Saved Successfully");
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/rdConfo/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const getPhdConformationDetails = await PhdConformation.findOne({ userId });
    response.json(getPhdConformationDetails);
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post("/RD/PartB", async (request, response) => {
  try {
    const { userId, tableData } = request.body;
    const existingData = await ResearchAndDevelopmentPartB.findOne({ userId });
    if (existingData) {
      existingData.presentation_data = tableData;
      await existingData.save();
    } else {
      const newResearchAndDevelopmentPartB = new ResearchAndDevelopmentPartB({
        userId,
        presentation_data: tableData,
      });
      const res = await newResearchAndDevelopmentPartB.save();
    }
    response.status(200).json({ success_msg: "Successfully Saved1" });
    console.log("Success");
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/RD/PartB/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const ResearchAndDevelopmentPartBDetails =
      await ResearchAndDevelopmentPartB.findOne({ userId });
    response.json(ResearchAndDevelopmentPartBDetails);
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post("/RD/PartC", async (request, response) => {
  try {
    const { userId, tableData } = request.body;
    const existingData = await ResearchAndDevelopmentPartC.findOne({ userId });
    if (existingData) {
      existingData.projects_data = tableData;
      await existingData.save();
    } else {
      const newResearchAndDevelopmentPartC = new ResearchAndDevelopmentPartC({
        userId,
        projects_data: tableData,
      });
      const res = await newResearchAndDevelopmentPartC.save();
    }
    response.status(200).json({ success_msg: "Successfully Saved1" });
    console.log("Success");
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/RD/PartC/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const ResearchAndDevelopmentPartCDetails =
      await ResearchAndDevelopmentPartC.findOne({ userId });
    response.json(ResearchAndDevelopmentPartCDetails);
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});
