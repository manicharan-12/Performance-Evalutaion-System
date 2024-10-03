require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const GridFSBucket = require("mongodb").GridFSBucket;
const multer = require("multer");
const { Readable } = require("stream");
const mongoose = require("mongoose");

const User = require("./models/user");
const Token = require("./models/token");
const Form = require("./models/newForm");
const AcademicWorkPartA = require("./models/Academic Work/partA");
const AcademicWorkPartB = require("./models/Academic Work/partB");
const PhdConformation = require("./models/Research And Development/rdConformation");
const ResearchAndDevelopmentPartA = require("./models/Research And Development/partA");
const ResearchAndDevelopmentPartB = require("./models/Research And Development/partB");
const ResearchAndDevelopmentPartC = require("./models/Research And Development/partC");
const ResearchAndDevelopmentPartD = require("./models/Research And Development/partD");
const ContributionToUniversitySchool = require("./models/contributionToUniversitySchool");
const ContributionToDepartment = require("./models/contributionToDepartment");
const ContributionToSociety = require("./models/contributionToSociety");
const ApiScore = require("./models/apiScore");
const AssessmentOfFunctionalHead = require("./models/assessmentOfFunctionalHead");
const assessmentOfFunctionalHead = require("./models/assessmentOfFunctionalHead");

// const mongoURI = "mongodb://localhost:27017/faculty_evaluation_system";
const mongoURI =
  "mongodb+srv://manicharan12:manicharan%40mongoDb@cluster0.p6x1kr4.mongodb.net/faculty_evaluation_system?retryWrites=true&w=majority";

const conn = mongoose.createConnection(mongoURI);
let gfs, gridFSBucket;
conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  gfs = gridFSBucket;
  console.log("GridFS initialized");
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
    fieldSize: 10 * 1024 * 1024,
  },
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const initializeDbAndServer = async () => {
  try {
    await mongoose.connect(mongoURI);
    const PORT = process.env.PORT || 6969;
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
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
    console.error(error);
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
        checkUsername.password
      );
      if (checkPassword === true) {
        const payload = { username: checkUsername.username };
        const jwt_token = jwt.sign(payload, "Anurag University");
        response.json({
          jwt_token,
          id: checkUsername.id,
          role: checkUsername.designation,
        });
      } else {
        response.status(401).json({ error_msg: "Incorrect Password" });
      }
    } else {
      response.status(401).json({ error_msg: "Username Doesn't exist" });
    }
  } catch (error) {
    console.error(error);
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
      const created_at = new Date();
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
            console.error(error);
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
    console.error(error);
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
    console.error(error);
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
        { $set: { password: `${hashedPassword}` } }
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
    console.error(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.post("/add/form/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { formName } = request.body;
    const createForm = new Form({
      user_id: userId,
      formName,
    });
    const data = await createForm.save();
    response.json({ formId: data._id });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.get("/user/forms/:userId", async (request, response) => {
  try {
    const userId = request.params;
    const getForms = await Form.find({ user_id: `${userId.userId}` });
    response.json({ getForms });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.put("/update/form/:formId", async (request, response) => {
  try {
    const { formId } = request.params;
    const { formName } = request.body;

    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { formName },
      { new: true }
    );

    if (updatedForm) {
      response.json({ success: true, form: updatedForm });
    } else {
      response.status(404).json({ error_msg: "Form not found" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.delete("/delete/form/:formId", async (request, response) => {
  try {
    const { formId } = request.params;

    const deletedForm = await Form.findByIdAndDelete(formId);

    if (deletedForm) {
      response.json({ success: true });
    } else {
      response.status(404).json({ error_msg: "Form not found" });
    }
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
      }
    );
    response.json("Status Updated");
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.get("/year/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { formId } = request.query;
    const getYear = await AcademicWorkPartA.findOne(
      { userId, formId },
      { academic_year: 1 }
    );
    response.json(getYear);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post("/academic-work-1", async (request, response) => {
  try {
    const {
      userId,
      formId,
      tableData,
      year,
      averageResultPercentage,
      averageFeedbackPercentage,
      totalApiScore,
    } = request.body;
    console.log(userId, formId);

    const existingData = await AcademicWorkPartA.findOne({
      userId,
      formId,
      academic_year: year,
    });
    if (existingData) {
      existingData.academic_work_part_a = tableData;
      existingData.averageResultPercentage = averageResultPercentage;
      existingData.averageFeedbackPercentage = averageFeedbackPercentage;
      existingData.totalApiScore = totalApiScore;
      await existingData.save();
    } else {
      const newAcademicWork = new AcademicWorkPartA({
        userId,
        formId,
        academic_year: year,
        academic_work_part_a: tableData,
        averageResultPercentage,
        averageFeedbackPercentage,
        totalApiScore,
      });
      await newAcademicWork.save();
    }
    const existingApiScore = await ApiScore.findOne({ userId, formId });
    if (existingApiScore) {
      existingApiScore.apiScores.academicWorkPartA = totalApiScore;
      await existingApiScore.save();
    } else {
      const newApiScore = new ApiScore({
        userId,
        formId,
        apiScores: { academicWorkPartA: totalApiScore },
      });
      await newApiScore.save();
    }

    response.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/academic-work-1/data/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { formId } = request.query;
    const getUserDetails = await AcademicWorkPartA.findOne({ userId, formId });
    response.json(getUserDetails);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post("/academic-work-2", upload.array("files"), async (req, res) => {
  const { userId, formId, editorContent, reviewerScore, deletedFiles } =
    req.body;
  const files = req.files || [];

  try {
    let academicWork = await AcademicWorkPartB.findOne({ userId, formId });

    if (deletedFiles && deletedFiles.length > 0) {
      const deletedFilesArray = Array.isArray(deletedFiles)
        ? deletedFiles
        : [deletedFiles];
      for (const fileId of deletedFilesArray) {
        try {
          await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));
        } catch (err) {
          console.error(`Error deleting file with ID: ${fileId}`, err);
        }
      }
    }

    const fileUploadPromises = files.map((file) => {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      return new Promise((resolve, reject) => {
        const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        readableStream
          .pipe(uploadStream)
          .on("error", reject)
          .on("finish", () => {
            resolve({
              filename: file.originalname,
              mimetype: file.mimetype,
              fileId: uploadStream.id,
            });
          });
      });
    });

    const fileData = await Promise.all(fileUploadPromises);

    if (academicWork) {
      academicWork.editorContent = editorContent;
      academicWork.reviewerScore = reviewerScore;
      if (Array.isArray(deletedFiles)) {
        academicWork.files = academicWork.files.filter(
          (file) => !deletedFiles.includes(file.fileId.toString())
        );
      }
      academicWork.files.push(...fileData);
      await academicWork.save();
    } else {
      academicWork = new AcademicWorkPartB({
        userId,
        formId,
        editorContent,
        reviewerScore,
        files: fileData,
      });
      await academicWork.save();
    }

    const existingApiScore = await ApiScore.findOne({ userId, formId });
    if (existingApiScore) {
      existingApiScore.apiScores.academicWorkPartB = 5;
      existingApiScore.reviewerApiScores.academicWorkPartB = reviewerScore;
      await existingApiScore.save();
    } else {
      const newApiScore = new ApiScore({
        userId,
        formId,
        apiScores: { academicWorkPartB: 5 },
        reviewerApiScores: { academicWorkPartB: reviewerScore },
      });
      await newApiScore.save();
    }

    res.json({ message: "Data saved successfully", data: academicWork });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Error saving data" });
  }
});

app.get("/academic-work-2/data/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { formId } = req.query;
    const academicWork = await AcademicWorkPartB.findOne({ userId, formId });

    if (academicWork) {
      const filePromises = academicWork.files.map((file) => {
        return new Promise((resolve, reject) => {
          try {
            const fileStream = gfs.openDownloadStream(file.fileId);
            let fileBuffer = Buffer.from([]);
            fileStream.on("data", (chunk) => {
              fileBuffer = Buffer.concat([fileBuffer, chunk]);
            });

            fileStream.on("end", () => {
              resolve({
                ...file.toObject(),
                fileContent: fileBuffer.toString("base64"),
              });
            });

            fileStream.on("error", (error) => {
              console.error(
                `Error downloading file with ID: ${file.fileId}`,
                error
              );
              reject(error);
            });
          } catch (error) {
            console.error(
              `Error opening download stream for file with ID: ${file.fileId}`,
              error
            );
            reject(error);
          }
        });
      });

      const filesData = await Promise.allSettled(filePromises);
      const successfulFiles = filesData
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      res.status(200).json({
        academicWork: {
          editorContent: academicWork.editorContent,
          files: successfulFiles,
        },
      });
    } else {
      res.status(200).json({
        academicWork: {
          editorContent: "",
          files: [],
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve data" });
  }
});

app.get("/files/:fileId", async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await gfs
      .find({ _id: new mongoose.Types.ObjectId(fileId) })
      .toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set("Content-Type", file[0].contentType);
    const readStream = gfs.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );
    readStream.pipe(res);
  } catch (error) {
    console.error(`Error retrieving file with ID: ${fileId}`, error);
    res.status(500).json({ message: "Error retrieving file" });
  }
});

app.post("/rdConfo", upload.array("files"), async (req, res) => {
  try {
    const {
      userId,
      formId,
      possesPhD,
      registerPhD,
      receivedPhd,
      tableData,
      deletedFiles,
    } = req.body;

    if (!userId || !possesPhD) {
      return res
        .status(400)
        .json({ message: "userId and possesPhD are required" });
    }

    if (possesPhD !== "yes") {
      return res.status(400).json({ message: "possesPhD must be 'yes'" });
    }

    let parsedTableData = [];
    if (typeof tableData === "string") {
      try {
        parsedTableData = JSON.parse(tableData);
      } catch (err) {
        console.error("Error parsing tableData:", err);
        return res.status(400).json({ message: "Invalid tableData format" });
      }
    } else {
      parsedTableData = tableData || [];
    }

    let phdConformationData = await PhdConformation.findOne({ userId, formId });
    if (!phdConformationData) {
      phdConformationData = new PhdConformation({ userId, formId, possesPhD });
    }

    if (registerPhD === "yes" || receivedPhd === "yes") {
      phdConformationData.registerPhD = registerPhD;
      phdConformationData.receivedPhd = receivedPhd;
    }

    phdConformationData.phDDetails =
      parsedTableData || phdConformationData.phDDetails || [];

    if (deletedFiles && deletedFiles.length > 0) {
      const deletedFilesArray = Array.isArray(deletedFiles)
        ? deletedFiles
        : [deletedFiles];
      for (const fileId of deletedFilesArray) {
        try {
          await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));
        } catch (err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ message: "Error deleting file" });
        }
      }
      phdConformationData.files = phdConformationData.files.filter(
        (file) => !deletedFiles.includes(file.fileId.toString())
      );
    }

    const files = req.files || [];
    const fileUploadPromises = files.map((file) => {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      return new Promise((resolve, reject) => {
        const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        readableStream
          .pipe(uploadStream)
          .on("error", reject)
          .on("finish", () => {
            resolve({
              filename: file.originalname,
              mimetype: file.mimetype,
              fileId: uploadStream.id,
            });
          });
      });
    });

    const fileData = await Promise.all(fileUploadPromises);
    phdConformationData.files.push(...fileData);

    await phdConformationData.save();

    res.json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error in /rdConfo route:", error);
    res
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/rdConfo/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { formId } = request.query;
    const getPhdConformationDetails = await PhdConformation.findOne({
      userId,
      formId,
    });

    if (getPhdConformationDetails) {
      const filePromises = getPhdConformationDetails.files.map((file) => {
        return new Promise((resolve, reject) => {
          try {
            const fileStream = gfs.openDownloadStream(file.fileId);
            let fileBuffer = Buffer.from([]);
            fileStream.on("data", (chunk) => {
              fileBuffer = Buffer.concat([fileBuffer, chunk]);
            });

            fileStream.on("end", () => {
              resolve({
                ...file.toObject(),
                fileContent: fileBuffer.toString("base64"),
              });
            });

            fileStream.on("error", (error) => {
              console.error(
                `Error downloading file with ID: ${file.fileId}`,
                error
              );
              reject(error);
            });
          } catch (error) {
            console.error(
              `Error opening download stream for file with ID: ${file.fileId}`,
              error
            );
            reject(error);
          }
        });
      });

      const filesData = await Promise.allSettled(filePromises);
      const successfulFiles = filesData
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      response.status(200).json({
        phdConformation: {
          phDDetails: getPhdConformationDetails.phDDetails,
          possesPhD: getPhdConformationDetails.possesPhD,
          receivedPhd: getPhdConformationDetails.receivedPhd,
          registerPhD: getPhdConformationDetails.registerPhD,
          files: successfulFiles,
        },
      });
    } else {
      response.status(200).json({
        phdConformation: {
          phDDetails: "",
          possesPhD: "",
          receivedPhd: "",
          registerPhD: "",
          files: [],
        },
      });
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post("/RD/PartA", upload.array("files"), async (request, response) => {
  try {
    const { userId, formId, tableData, totalApiScore } = request.body;
    let { deletedFiles } = request.body;
    const files = request.files;
    let parsedTableData;

    if (typeof tableData === "string") {
      try {
        parsedTableData = JSON.parse(tableData);
      } catch (err) {
        console.error("Error parsing tableData:", err);
        return response
          .status(400)
          .json({ message: "Invalid tableData format" });
      }
    } else {
      parsedTableData = tableData;
    }

    if (deletedFiles && deletedFiles.length > 0) {
      const deletedFilesArray = Array.isArray(deletedFiles)
        ? deletedFiles
        : [deletedFiles];
      for (const fileId of deletedFilesArray) {
        try {
          await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));
        } catch (err) {
          return res.status(500).json({ message: "Error deleting file" });
        }
      }
    }

    const fileUploadPromises = files.map((file) => {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      return new Promise((resolve, reject) => {
        const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        readableStream
          .pipe(uploadStream)
          .on("error", reject)
          .on("finish", () => {
            resolve({
              filename: file.originalname,
              mimetype: file.mimetype,
              fileId: uploadStream.id,
            });
          });
      });
    });

    const fileData = await Promise.all(fileUploadPromises);
    const existingData = await ResearchAndDevelopmentPartA.findOne({
      userId,
      formId,
    });

    if (existingData) {
      existingData.presentation_data = parsedTableData; // Use parsed table data
      if (Array.isArray(deletedFiles)) {
        existingData.files = existingData.files.filter(
          (file) => !deletedFiles.includes(file.fileId.toString())
        );
      }
      existingData.files = existingData.files || [];
      existingData.files.push(...fileData);
      await existingData.save();
    } else {
      const newResearchAndDevelopmentPartA = new ResearchAndDevelopmentPartA({
        userId,
        formId,
        presentation_data: parsedTableData,
        files: fileData,
      });
      await newResearchAndDevelopmentPartA.save();
    }
    const existingApiScore = await ApiScore.findOne({ userId, formId });
    if (existingApiScore) {
      existingApiScore.apiScores.researchAndDevelopmentPartA = totalApiScore;
      await existingApiScore.save();
    } else {
      const newApiScore = new ApiScore({
        userId,
        formId,
        apiScores: { researchAndDevelopmentPartA: totalApiScore },
      });
      await newApiScore.save();
    }

    response.status(200).json({ success_msg: "Successfully Saved" });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/RD/PartA/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { formId } = request.query;

    const researchAndDevelopmentPartADetails =
      await ResearchAndDevelopmentPartA.findOne({ userId, formId });
    if (researchAndDevelopmentPartADetails) {
      const filePromises = researchAndDevelopmentPartADetails.files.map(
        (file) => {
          return new Promise((resolve, reject) => {
            try {
              const fileStream = gfs.openDownloadStream(file.fileId);
              let fileBuffer = Buffer.from([]);
              fileStream.on("data", (chunk) => {
                fileBuffer = Buffer.concat([fileBuffer, chunk]);
              });

              fileStream.on("end", () => {
                resolve({
                  ...file.toObject(),
                  fileContent: fileBuffer.toString("base64"),
                });
              });

              fileStream.on("error", (error) => {
                console.error(
                  `Error downloading file with ID: ${file.fileId}`,
                  error
                );
                reject(error);
              });
            } catch (error) {
              console.error(
                `Error opening download stream for file with ID: ${file.fileId}`,
                error
              );
              reject(error);
            }
          });
        }
      );

      const filesData = await Promise.allSettled(filePromises);
      const successfulFiles = filesData
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      response.status(200).json({
        phdPartA: {
          presentation_data:
            researchAndDevelopmentPartADetails.presentation_data,
          files: successfulFiles,
        },
      });
    } else {
      response.status(200).json({
        phdPartA: {
          presentation_data: [
            {
              titleOfThePaper: "",
              titleOfTheme: "",
              organizedBy: "",
              indexedIn: "",
              noOfDays: "",
              apiScore: "",
            },
          ],
          files: [],
        },
      });
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post("/RD/PartB", upload.array("files"), async (request, response) => {
  try {
    const { userId, formId, tableData, totalApiScore } = request.body;
    console.log({ userId, formId, tableData, totalApiScore });
    let { deletedFiles } = request.body;
    const files = request.files;
    let parsedTableData;

    if (typeof tableData === "string") {
      try {
        parsedTableData = JSON.parse(tableData);
      } catch (err) {
        console.error("Error parsing tableData:", err);
        return response
          .status(400)
          .json({ message: "Invalid tableData format" });
      }
    } else {
      parsedTableData = tableData;
    }

    if (deletedFiles && deletedFiles.length > 0) {
      const deletedFilesArray = Array.isArray(deletedFiles)
        ? deletedFiles
        : [deletedFiles];
      for (const fileId of deletedFilesArray) {
        try {
          await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));
        } catch (err) {
          return res.status(500).json({ message: "Error deleting file" });
        }
      }
    }

    const fileUploadPromises = files.map((file) => {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      return new Promise((resolve, reject) => {
        const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        readableStream
          .pipe(uploadStream)
          .on("error", reject)
          .on("finish", () => {
            resolve({
              filename: file.originalname,
              mimetype: file.mimetype,
              fileId: uploadStream.id,
            });
          });
      });
    });

    const fileData = await Promise.all(fileUploadPromises);
    const existingData = await ResearchAndDevelopmentPartB.findOne({
      userId,
      formId,
    });

    if (existingData) {
      existingData.presentation_data = parsedTableData; // Use parsed table data
      if (Array.isArray(deletedFiles)) {
        existingData.files = existingData.files.filter(
          (file) => !deletedFiles.includes(file.fileId.toString())
        );
      }
      existingData.files = existingData.files || [];
      existingData.files.push(...fileData);
      await existingData.save();
    } else {
      const newResearchAndDevelopmentPartB = new ResearchAndDevelopmentPartB({
        userId,
        formId,
        presentation_data: parsedTableData, // Use parsed table data
        files: fileData,
      });
      await newResearchAndDevelopmentPartB.save();
    }
    const existingApiScore = await ApiScore.findOne({ userId, formId });
    if (existingApiScore) {
      existingApiScore.apiScores.researchAndDevelopmentPartB = totalApiScore;
      await existingApiScore.save();
    } else {
      const newApiScore = new ApiScore({
        userId,
        formId,
        apiScores: { researchAndDevelopmentPartB: totalApiScore },
      });
      await newApiScore.save();
    }
    response.status(200).json({ success_msg: "Successfully Saved" });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/RD/PartB/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { formId } = request.query;
    const researchAndDevelopmentPartBDetails =
      await ResearchAndDevelopmentPartB.findOne({ userId, formId });
    if (researchAndDevelopmentPartBDetails) {
      const filePromises = researchAndDevelopmentPartBDetails.files.map(
        (file) => {
          return new Promise((resolve, reject) => {
            try {
              const fileStream = gfs.openDownloadStream(file.fileId);
              let fileBuffer = Buffer.from([]);
              fileStream.on("data", (chunk) => {
                fileBuffer = Buffer.concat([fileBuffer, chunk]);
              });

              fileStream.on("end", () => {
                resolve({
                  ...file.toObject(),
                  fileContent: fileBuffer.toString("base64"),
                });
              });

              fileStream.on("error", (error) => {
                console.error(
                  `Error downloading file with ID: ${file.fileId}`,
                  error
                );
                reject(error);
              });
            } catch (error) {
              console.error(
                `Error opening download stream for file with ID: ${file.fileId}`,
                error
              );
              reject(error);
            }
          });
        }
      );

      const filesData = await Promise.allSettled(filePromises);
      const successfulFiles = filesData
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
      // console.log(researchAndDevelopmentPartBDetails);
      response.status(200).json({
        phdPartB: {
          presentation_data:
            researchAndDevelopmentPartBDetails.presentation_data,
          files: successfulFiles,
        },
      });
    } else {
      response.status(200).json({
        phdPartB: {
          presentation_data: [
            {
              titleOfThePaper: "",
              titleOfTheme: "",
              organizedBy: "",
              indexedIn: "",
              noOfDays: "",
              apiScore: "",
            },
          ],
          files: [],
        },
      });
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post("/RD/PartC", upload.array("files"), async (request, response) => {
  try {
    const { userId, tableData, formId, totalApiScore } = request.body;
    let { deletedFiles } = request.body;
    const files = request.files;
    let parsedTableData;

    if (typeof tableData === "string") {
      try {
        parsedTableData = JSON.parse(tableData);
      } catch (err) {
        console.error("Error parsing tableData:", err);
        return response
          .status(400)
          .json({ message: "Invalid tableData format" });
      }
    } else {
      parsedTableData = tableData;
    }

    if (deletedFiles && deletedFiles.length > 0) {
      const deletedFilesArray = Array.isArray(deletedFiles)
        ? deletedFiles
        : [deletedFiles];
      for (const fileId of deletedFilesArray) {
        try {
          await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));
        } catch (err) {
          return res.status(500).json({ message: "Error deleting file" });
        }
      }
    }

    const fileUploadPromises = files.map((file) => {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      return new Promise((resolve, reject) => {
        const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        readableStream
          .pipe(uploadStream)
          .on("error", reject)
          .on("finish", () => {
            resolve({
              filename: file.originalname,
              mimetype: file.mimetype,
              fileId: uploadStream.id,
            });
          });
      });
    });

    const fileData = await Promise.all(fileUploadPromises);
    const existingData = await ResearchAndDevelopmentPartC.findOne({
      userId,
      formId,
    });
    if (existingData) {
      existingData.projects_data = parsedTableData;
      if (Array.isArray(deletedFiles)) {
        existingData.files = existingData.files.filter(
          (file) => !deletedFiles.includes(file.fileId.toString())
        );
      }
      existingData.files = existingData.files || [];
      existingData.files.push(...fileData);
      await existingData.save();
    } else {
      const newResearchAndDevelopmentPartC = new ResearchAndDevelopmentPartC({
        userId,
        formId,
        projects_data: parsedTableData,
        files: fileData,
      });
      const res = await newResearchAndDevelopmentPartC.save();
    }

    const existingApiScore = await ApiScore.findOne({ userId, formId });
    if (existingApiScore) {
      existingApiScore.apiScores.researchAndDevelopmentPartC = totalApiScore;
      await existingApiScore.save();
    } else {
      const newApiScore = new ApiScore({
        userId,
        formId,
        apiScores: { researchAndDevelopmentPartC: totalApiScore },
      });
      await newApiScore.save();
    }
    response.status(200).json({ success_msg: "Successfully Saved1" });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/RD/PartC/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { formId } = request.query;
    const researchAndDevelopmentPartCDetails =
      await ResearchAndDevelopmentPartC.findOne({ userId, formId });
    if (researchAndDevelopmentPartCDetails) {
      const filePromises = researchAndDevelopmentPartCDetails.files.map(
        (file) => {
          return new Promise((resolve, reject) => {
            try {
              const fileStream = gfs.openDownloadStream(file.fileId);
              let fileBuffer = Buffer.from([]);
              fileStream.on("data", (chunk) => {
                fileBuffer = Buffer.concat([fileBuffer, chunk]);
              });

              fileStream.on("end", () => {
                resolve({
                  ...file.toObject(),
                  fileContent: fileBuffer.toString("base64"),
                });
              });

              fileStream.on("error", (error) => {
                console.error(
                  `Error downloading file with ID: ${file.fileId}`,
                  error
                );
                reject(error);
              });
            } catch (error) {
              console.error(
                `Error opening download stream for file with ID: ${file.fileId}`,
                error
              );
              reject(error);
            }
          });
        }
      );

      const filesData = await Promise.allSettled(filePromises);
      const successfulFiles = filesData
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
      response.status(200).json({
        phdPartC: {
          projects_data: researchAndDevelopmentPartCDetails.projects_data,
          files: successfulFiles,
        },
      });
    } else {
      response.status(200).json({
        phdPartC: {
          projects_data: [
            {
              titleOfTheFundingProject: "",
              fundingAgencyDetails: "",
              grant: "",
              status: "",
              apiScore: "",
            },
          ],
          files: [],
        },
      });
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post("/RD/PartD", upload.array("files"), async (request, response) => {
  try {
    const { userId, tableData, formId, totalApiScore } = request.body;
    let { deletedFiles } = request.body;
    const files = request.files;
    let parsedTableData;

    if (typeof tableData === "string") {
      try {
        parsedTableData = JSON.parse(tableData);
      } catch (err) {
        console.error("Error parsing tableData:", err);
        return response
          .status(400)
          .json({ message: "Invalid tableData format" });
      }
    } else {
      parsedTableData = tableData;
    }

    if (deletedFiles && deletedFiles.length > 0) {
      const deletedFilesArray = Array.isArray(deletedFiles)
        ? deletedFiles
        : [deletedFiles];
      for (const fileId of deletedFilesArray) {
        try {
          await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));
        } catch (err) {
          return res.status(500).json({ message: "Error deleting file" });
        }
      }
    }

    const fileUploadPromises = files.map((file) => {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      return new Promise((resolve, reject) => {
        const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        readableStream
          .pipe(uploadStream)
          .on("error", reject)
          .on("finish", () => {
            resolve({
              filename: file.originalname,
              mimetype: file.mimetype,
              fileId: uploadStream.id,
            });
          });
      });
    });

    const fileData = await Promise.all(fileUploadPromises);
    const existingData = await ResearchAndDevelopmentPartD.findOne({
      userId,
      formId,
    });
    if (existingData) {
      existingData.certificates_data = parsedTableData;
      if (Array.isArray(deletedFiles)) {
        existingData.files = existingData.files.filter(
          (file) => !deletedFiles.includes(file.fileId.toString())
        );
      }
      existingData.files = existingData.files || [];
      existingData.files.push(...fileData);
      await existingData.save();
    } else {
      const newResearchAndDevelopmentPartD = new ResearchAndDevelopmentPartD({
        userId,
        formId,
        certificates_data: parsedTableData,
        files: fileData,
      });
      const res = await newResearchAndDevelopmentPartD.save();
    }
    const existingApiScore = await ApiScore.findOne({ userId, formId });
    if (existingApiScore) {
      existingApiScore.apiScores.researchAndDevelopmentPartD = totalApiScore;
      await existingApiScore.save();
    } else {
      const newApiScore = new ApiScore({
        userId,
        formId,
        apiScores: { researchAndDevelopmentPartD: totalApiScore },
      });
      await newApiScore.save();
    }
    response.status(200).json({ success_msg: "Successfully Saved1" });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/RD/PartD/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { formId } = request.query;
    const researchAndDevelopmentPartDDetails =
      await ResearchAndDevelopmentPartD.findOne({ userId, formId });
    if (researchAndDevelopmentPartDDetails) {
      const filePromises = researchAndDevelopmentPartDDetails.files.map(
        (file) => {
          return new Promise((resolve, reject) => {
            try {
              const fileStream = gfs.openDownloadStream(file.fileId);
              let fileBuffer = Buffer.from([]);
              fileStream.on("data", (chunk) => {
                fileBuffer = Buffer.concat([fileBuffer, chunk]);
              });

              fileStream.on("end", () => {
                resolve({
                  ...file.toObject(),
                  fileContent: fileBuffer.toString("base64"),
                });
              });

              fileStream.on("error", (error) => {
                console.error(
                  `Error downloading file with ID: ${file.fileId}`,
                  error
                );
                reject(error);
              });
            } catch (error) {
              console.error(
                `Error opening download stream for file with ID: ${file.fileId}`,
                error
              );
              reject(error);
            }
          });
        }
      );

      const filesData = await Promise.allSettled(filePromises);
      const successfulFiles = filesData
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
      response.status(200).json({
        phdPartD: {
          certificates_data:
            researchAndDevelopmentPartDDetails.certificates_data,
          files: successfulFiles,
        },
      });
    } else {
      response.status(200).json({
        phdPartD: {
          certificates_data: [
            {
              nameOfTheCertificate: "",
              organization: "",
              score: "",
              apiScore: "",
            },
          ],
          files: [],
        },
      });
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post(
  "/ContributionToUniversitySchool",
  upload.array("files"),
  async (request, response) => {
    try {
      const { userId, tableData, formId, totalApiScore } = request.body;
      let { deletedFiles } = request.body;
      const files = request.files;
      let parsedTableData;

      if (typeof tableData === "string") {
        try {
          parsedTableData = JSON.parse(tableData);
        } catch (err) {
          console.error("Error parsing tableData:", err);
          return response
            .status(400)
            .json({ message: "Invalid tableData format" });
        }
      } else {
        parsedTableData = tableData;
      }

      if (deletedFiles && deletedFiles.length > 0) {
        const deletedFilesArray = Array.isArray(deletedFiles)
          ? deletedFiles
          : [deletedFiles];
        for (const fileId of deletedFilesArray) {
          try {
            await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));
          } catch (err) {
            return res.status(500).json({ message: "Error deleting file" });
          }
        }
      }

      const fileUploadPromises = files.map((file) => {
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        return new Promise((resolve, reject) => {
          const uploadStream = gridFSBucket.openUploadStream(
            file.originalname,
            {
              contentType: file.mimetype,
            }
          );

          readableStream
            .pipe(uploadStream)
            .on("error", reject)
            .on("finish", () => {
              resolve({
                filename: file.originalname,
                mimetype: file.mimetype,
                fileId: uploadStream.id,
              });
            });
        });
      });

      const fileData = await Promise.all(fileUploadPromises);
      const existingData = await ContributionToUniversitySchool.findOne({
        userId,
        formId,
      });
      if (existingData) {
        existingData.contribution_data = parsedTableData;
        if (Array.isArray(deletedFiles)) {
          existingData.files = existingData.files.filter(
            (file) => !deletedFiles.includes(file.fileId.toString())
          );
        }
        existingData.files = existingData.files || [];
        existingData.files.push(...fileData);
        await existingData.save();
      } else {
        const newContributionToUniversitySchool =
          new ContributionToUniversitySchool({
            userId,
            formId,
            contribution_data: parsedTableData,
            files: fileData,
          });
        const res = await newContributionToUniversitySchool.save();
      }

      const existingApiScore = await ApiScore.findOne({ userId, formId });
      if (existingApiScore) {
        existingApiScore.apiScores.contributionToSchool = totalApiScore;
        await existingApiScore.save();
      } else {
        const newApiScore = new ApiScore({
          userId,
          formId,
          apiScores: { contributionToSchool: totalApiScore },
        });
        await newApiScore.save();
      }
      response.status(200).json({ success_msg: "Successfully Saved1" });
    } catch (error) {
      console.error(error);
      response
        .status(500)
        .json({ error_msg: "Internal Server Error! Please try again later." });
    }
  }
);

app.get(
  "/ContributionToUniversitySchool/:userId",
  async (request, response) => {
    try {
      const { userId } = request.params;
      const { formId } = request.query;
      const contributionToUniversitySchoolDetails =
        await ContributionToUniversitySchool.findOne({ userId, formId });
      if (contributionToUniversitySchoolDetails) {
        const filePromises = contributionToUniversitySchoolDetails.files.map(
          (file) => {
            return new Promise((resolve, reject) => {
              try {
                const fileStream = gfs.openDownloadStream(file.fileId);
                let fileBuffer = Buffer.from([]);
                fileStream.on("data", (chunk) => {
                  fileBuffer = Buffer.concat([fileBuffer, chunk]);
                });

                fileStream.on("end", () => {
                  resolve({
                    ...file.toObject(),
                    fileContent: fileBuffer.toString("base64"),
                  });
                });

                fileStream.on("error", (error) => {
                  console.error(
                    `Error downloading file with ID: ${file.fileId}`,
                    error
                  );
                  reject(error);
                });
              } catch (error) {
                console.error(
                  `Error opening download stream for file with ID: ${file.fileId}`,
                  error
                );
                reject(error);
              }
            });
          }
        );

        const filesData = await Promise.allSettled(filePromises);
        const successfulFiles = filesData
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);
        response.status(200).json({
          contributionToUniversitySchool: {
            contribution_data:
              contributionToUniversitySchoolDetails.contribution_data,
            files: successfulFiles,
          },
        });
      } else {
        response.status(200).json({
          contributionToUniversitySchool: {
            contribution_data: [
              {
                nameOfTheResponsibility: "",
                contribution: "",
                apiScore: "",
              },
            ],
            files: [],
          },
        });
      }
    } catch (error) {
      console.error(error);
      response
        .status(500)
        .json({ error_msg: "Internal Server Error! Please try again later." });
    }
  }
);

app.post(
  "/ContributionToDepartment",
  upload.array("files"),
  async (request, response) => {
    try {
      const { userId, tableData, formId, totalApiScore } = request.body;
      let { deletedFiles } = request.body;
      const files = request.files;
      let parsedTableData;

      if (typeof tableData === "string") {
        try {
          parsedTableData = JSON.parse(tableData);
        } catch (err) {
          console.error("Error parsing tableData:", err);
          return response
            .status(400)
            .json({ message: "Invalid tableData format" });
        }
      } else {
        parsedTableData = tableData;
      }

      if (deletedFiles && deletedFiles.length > 0) {
        const deletedFilesArray = Array.isArray(deletedFiles)
          ? deletedFiles
          : [deletedFiles];
        for (const fileId of deletedFilesArray) {
          try {
            await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));
          } catch (err) {
            return res.status(500).json({ message: "Error deleting file" });
          }
        }
      }

      const fileUploadPromises = files.map((file) => {
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        return new Promise((resolve, reject) => {
          const uploadStream = gridFSBucket.openUploadStream(
            file.originalname,
            {
              contentType: file.mimetype,
            }
          );

          readableStream
            .pipe(uploadStream)
            .on("error", reject)
            .on("finish", () => {
              resolve({
                filename: file.originalname,
                mimetype: file.mimetype,
                fileId: uploadStream.id,
              });
            });
        });
      });

      const fileData = await Promise.all(fileUploadPromises);
      const existingData = await ContributionToDepartment.findOne({
        userId,
        formId,
      });
      if (existingData) {
        existingData.contribution_data = parsedTableData;
        if (Array.isArray(deletedFiles)) {
          existingData.files = existingData.files.filter(
            (file) => !deletedFiles.includes(file.fileId.toString())
          );
        }
        existingData.files = existingData.files || [];
        existingData.files.push(...fileData);
        await existingData.save();
      } else {
        const newContributionToDepartment = new ContributionToDepartment({
          userId,
          formId,
          contribution_data: parsedTableData,
          files: fileData,
        });
        const res = await newContributionToDepartment.save();
      }
      const existingApiScore = await ApiScore.findOne({ userId, formId });
      if (existingApiScore) {
        existingApiScore.apiScores.contributionToDepartment = totalApiScore;
        await existingApiScore.save();
      } else {
        const newApiScore = new ApiScore({
          userId,
          formId,
          apiScores: { contributionToDepartment: totalApiScore },
        });
        await newApiScore.save();
      }
      response.status(200).json({ success_msg: "Successfully Saved1" });
    } catch (error) {
      console.error(error);
      response
        .status(500)
        .json({ error_msg: "Internal Server Error! Please try again later." });
    }
  }
);

app.get("/ContributionToDepartment/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { formId } = request.query;
    const contributionToDepartmentDetails =
      await ContributionToDepartment.findOne({ userId, formId });
    if (contributionToDepartmentDetails) {
      const filePromises = contributionToDepartmentDetails.files.map((file) => {
        return new Promise((resolve, reject) => {
          try {
            const fileStream = gfs.openDownloadStream(file.fileId);
            let fileBuffer = Buffer.from([]);
            fileStream.on("data", (chunk) => {
              fileBuffer = Buffer.concat([fileBuffer, chunk]);
            });

            fileStream.on("end", () => {
              resolve({
                ...file.toObject(),
                fileContent: fileBuffer.toString("base64"),
              });
            });

            fileStream.on("error", (error) => {
              console.error(
                `Error downloading file with ID: ${file.fileId}`,
                error
              );
              reject(error);
            });
          } catch (error) {
            console.error(
              `Error opening download stream for file with ID: ${file.fileId}`,
              error
            );
            reject(error);
          }
        });
      });

      const filesData = await Promise.allSettled(filePromises);
      const successfulFiles = filesData
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
      response.status(200).json({
        contributionToDepartment: {
          contribution_data: contributionToDepartmentDetails.contribution_data,
          files: successfulFiles,
        },
      });
    } else {
      response.status(200).json({
        contributionToDepartment: {
          contribution_data: [
            {
              nameOfTheResponsibility: "",
              contribution: "",
              apiScore: "",
            },
          ],
          files: [],
        },
      });
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post(
  "/ContributionToSociety",
  upload.array("files"),
  async (request, response) => {
    try {
      const { userId, tableData, formId, totalApiScore } = request.body;
      let { deletedFiles } = request.body;
      const files = request.files;
      let parsedTableData;

      if (typeof tableData === "string") {
        try {
          parsedTableData = JSON.parse(tableData);
        } catch (err) {
          console.error("Error parsing tableData:", err);
          return response
            .status(400)
            .json({ message: "Invalid tableData format" });
        }
      } else {
        parsedTableData = tableData;
      }

      if (deletedFiles && deletedFiles.length > 0) {
        const deletedFilesArray = Array.isArray(deletedFiles)
          ? deletedFiles
          : [deletedFiles];
        for (const fileId of deletedFilesArray) {
          try {
            await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));
          } catch (err) {
            return res.status(500).json({ message: "Error deleting file" });
          }
        }
      }

      const fileUploadPromises = files.map((file) => {
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        return new Promise((resolve, reject) => {
          const uploadStream = gridFSBucket.openUploadStream(
            file.originalname,
            {
              contentType: file.mimetype,
            }
          );

          readableStream
            .pipe(uploadStream)
            .on("error", reject)
            .on("finish", () => {
              resolve({
                filename: file.originalname,
                mimetype: file.mimetype,
                fileId: uploadStream.id,
              });
            });
        });
      });

      const fileData = await Promise.all(fileUploadPromises);
      const existingData = await ContributionToSociety.findOne({
        userId,
        formId,
      });
      if (existingData) {
        existingData.contribution_data = parsedTableData;
        if (Array.isArray(deletedFiles)) {
          existingData.files = existingData.files.filter(
            (file) => !deletedFiles.includes(file.fileId.toString())
          );
        }
        existingData.files = existingData.files || [];
        existingData.files.push(...fileData);
        await existingData.save();
      } else {
        const newContributionToSociety = new ContributionToSociety({
          userId,
          formId,
          contribution_data: parsedTableData,
          files: fileData,
        });
        const res = await newContributionToSociety.save();
      }
      const existingApiScore = await ApiScore.findOne({ userId, formId });
      if (existingApiScore) {
        existingApiScore.apiScores.contributionToSociety = totalApiScore;
        await existingApiScore.save();
      } else {
        const newApiScore = new ApiScore({
          userId,
          formId,
          apiScores: { contributionToSociety: totalApiScore },
        });
        await newApiScore.save();
      }
      response.status(200).json({ success_msg: "Successfully Saved1" });
    } catch (error) {
      console.error(error);
      response
        .status(500)
        .json({ error_msg: "Internal Server Error! Please try again later." });
    }
  }
);

app.get("/ContributionToSociety/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { formId } = request.query;
    const contributionToSocietyDetails = await ContributionToSociety.findOne({
      userId,
      formId,
    });
    if (contributionToSocietyDetails) {
      const filePromises = contributionToSocietyDetails.files.map((file) => {
        return new Promise((resolve, reject) => {
          try {
            const fileStream = gfs.openDownloadStream(file.fileId);
            let fileBuffer = Buffer.from([]);
            fileStream.on("data", (chunk) => {
              fileBuffer = Buffer.concat([fileBuffer, chunk]);
            });

            fileStream.on("end", () => {
              resolve({
                ...file.toObject(),
                fileContent: fileBuffer.toString("base64"),
              });
            });

            fileStream.on("error", (error) => {
              console.error(
                `Error downloading file with ID: ${file.fileId}`,
                error
              );
              reject(error);
            });
          } catch (error) {
            console.error(
              `Error opening download stream for file with ID: ${file.fileId}`,
              error
            );
            reject(error);
          }
        });
      });

      const filesData = await Promise.allSettled(filePromises);
      const successfulFiles = filesData
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
      response.status(200).json({
        contributionToSociety: {
          contribution_data: contributionToSocietyDetails.contribution_data,
          files: successfulFiles,
        },
      });
    } else {
      response.status(200).json({
        contributionToSociety: {
          contribution_data: [
            {
              nameOfTheResponsibility: "",
              contribution: "",
              apiScore: "",
            },
          ],
          files: [],
        },
      });
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/teachers/:department", async (req, res) => {
  try {
    const { department } = req.params;
    const teachers = await User.find({
      department,
      designation: { $ne: "HOD" },
    }).select("-password");
    if (teachers.length === 0) {
      return res
        .status(404)
        .json({ message: "No teachers found in this department" });
    }

    res.status(200).json({ teachers });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/faculty/:f_id", async (req, res) => {
  const facultyId = req.params.f_id;
  try {
    const forms = await Form.find({ user_id: facultyId });
    res.json(forms);
  } catch (error) {
    console.log(error);
  }
});

app.get("/faculty/forms/:formId", async (req, res) => {
  const formId = req.params.formId;

  try {
    const academicWorkPartA = await AcademicWorkPartA.findOne({ formId });
    const academicWorkPartB = await AcademicWorkPartB.findOne({ formId });
    const researchAndDevelopmentPartA =
      await ResearchAndDevelopmentPartA.findOne({ formId });
    const researchAndDevelopmentPartB =
      await ResearchAndDevelopmentPartB.findOne({ formId });
    const researchAndDevelopmentPartC =
      await ResearchAndDevelopmentPartC.findOne({ formId });
    const researchAndDevelopmentPartD =
      await ResearchAndDevelopmentPartD.findOne({ formId });
    const phdConformation = await PhdConformation.findOne({ formId });
    const apiScore = await ApiScore.findOne({ formId });
    const contributionToDepartment = await ContributionToDepartment.findOne({
      formId,
    });
    const contributionToSociety = await ContributionToSociety.findOne({
      formId,
    });
    const contributionToUniversitySchool =
      await ContributionToUniversitySchool.findOne({ formId });

    // Check if at least some data is found
    if (
      !academicWorkPartA &&
      !academicWorkPartB &&
      !researchAndDevelopmentPartA &&
      !researchAndDevelopmentPartB &&
      !researchAndDevelopmentPartC &&
      !researchAndDevelopmentPartD &&
      !phdConformation &&
      !apiScore &&
      !contributionToDepartment &&
      !contributionToSociety &&
      !contributionToUniversitySchool
    ) {
      return res
        .status(404)
        .json({ message: "No form data found for this formId" });
    }

    const consolidatedData = {
      academicWorkPartA,
      academicWorkPartB,
      researchAndDevelopmentPartA,
      researchAndDevelopmentPartB,
      researchAndDevelopmentPartC,
      researchAndDevelopmentPartD,
      phdConformation,
      apiScore,
      contributionToDepartment,
      contributionToSociety,
      contributionToUniversitySchool,
    };

    res.json(consolidatedData);
  } catch (error) {
    console.error(`Error fetching data for formId: ${formId}`, error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.patch("/hod/remarks/:f_id", async (req, res) => {
  try {
    const { semesterIndex, courseIndex, hodRemark } = req.body;
    const academicWork = await AcademicWorkPartA.findById(req.params.f_id);
    if (!academicWork) return res.status(404).json({ message: "Not found" });

    academicWork.academic_work_part_a[semesterIndex].courses[
      courseIndex
    ].hodRemark = hodRemark;
    academicWork.status = "reviewed";
    await academicWork.save();

    res.json(academicWork);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// app.post("/functional-head-assessment/:f_id", async (request, response) => {
//   try {
//     const {
//       userId,
//       formId,
//       impression,
//       examination,
//       interpersonal,
//       totalScore,
//     } = request.body;

//     // Optionally recalculate the total score on the backend for verification
//     const calculatedTotalScore = impression + examination + interpersonal;

//     if (calculatedTotalScore !== totalScore) {
//       return response
//         .status(400)
//         .json({ error_msg: "Total score mismatch. Please try again." });
//     }

//     const existingAssessment = await AssessmentOfFunctionalHead.findOne({
//       userId,
//       formId,
//     });

//     if (existingAssessment) {
//       existingAssessment.impression = impression;
//       existingAssessment.examination = examination;
//       existingAssessment.interpersonal = interpersonal;
//       existingAssessment.totalScore = totalScore;
//       await existingAssessment.save();
//     } else {
//       const newAssessment = new AssessmentOfFunctionalHead({
//         userId,
//         formId,
//         impression,
//         examination,
//         interpersonal,
//         totalScore,
//       });
//       await newAssessment.save();
//     }

//     // Update the ApiScore model
//     const existingScore = await assessmentOfFunctionalHead.findOne({ userId, formId });
//     if (existingScore) {
//       existingScore.apiScores.functionalHeadAssessment = totalScore;
//       await existingScore.save();
//     } else {
//       const newApiScore = new ApiScore({
//         userId,
//         formId,
//         apiScores: { functionalHeadAssessment: totalScore },
//       });
//       await newApiScore.save();
//     }

//     response
//       .status(200)
//       .json({ message: "Assessment saved successfully!", totalScore });
//   } catch (error) {
//     console.error(error);
//     response
//       .status(500)
//       .json({ error_msg: "Internal Server Error! Please try again later." });
//   }
// });

app.post("/functional-head-assessment/", async (req, res) => {
  const { f_id } = req.query; // formId passed in the URL
  const { userId, impression, examination, interpersonal, totalScore } =
    req.body;
  console.log(userId, impression, examination, interpersonal, totalScore);

  try {
    // Check if an assessment with the given formId (f_id) already exists
    const existingAssessment = await AssessmentOfFunctionalHead.findOne({
      formId: f_id,
    });

    if (existingAssessment) {
      // If an assessment already exists, return the existing data
      return res.status(200).json({
        message: "Assessment already exists",
        assessment: existingAssessment,
      });
    }

    // If the totalScore does not match the sum of individual scores, return an error
    // const calculatedTotal = impression + examination + interpersonal;

    // if (calculatedTotal !== totalScore) {
    //   return res.status(400).json({
    //     error_msg: "Total score does not match the sum of individual scores",
    //   });
    // }

    // Create a new assessment document
    const newAssessment = new AssessmentOfFunctionalHead({
      formId: f_id,
      userId: userId,
      impression: impression,
      examination: examination,
      interpersonal: interpersonal,
      totalScore: totalScore,
    });

    // Save the assessment document to MongoDB
    await newAssessment.save();

    // Return a success response with the new assessment
    res.status(201).json({
      message: "Assessment saved successfully!",
      assessment: newAssessment,
    });
  } catch (error) {
    console.error("Error saving assessment:", error);

    // Send an error response
    res.status(500).json({
      error_msg: "Failed to save assessment. Internal server error.",
    });
  }
});
