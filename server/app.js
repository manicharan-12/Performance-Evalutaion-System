require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
const AcademicWorkPartA = require("./models/Academic Work/partA");
const AcademicWorkPartB = require("./models/Academic Work/partB");
const PhdConformation = require("./models/Research And Development/rdConformation");
const ResearchAndDevelopmentPartB = require("./models/Research And Development/partB");
const ResearchAndDevelopmentPartC = require("./models/Research And Development/partC");

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
    fileSize: 50 * 1024 * 1024, // Limit file size to 50MB
    fieldSize: 10 * 1024 * 1024, // Limit field size to 10MB
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
    const PORT = process.env.PORT || 5000;
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
        checkUsername.password,
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
      },
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
    const getYear = await AcademicWorkPartA.findOne(
      { userId },
      { academic_year: 1 },
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
    console.error(error);
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
    console.error(error);
    response
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.post("/academic-work-2", upload.array("files"), async (req, res) => {
  const { userId, editorContent, deletedFiles } = req.body;
  const files = req.files;

  try {
    let academicWork = await AcademicWorkPartB.findOne({ userId });

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
      if (Array.isArray(deletedFiles)) {
        academicWork.files = academicWork.files.filter(
          (file) => !deletedFiles.includes(file.fileId.toString()),
        );
      }
      academicWork.files.push(...fileData);
      await academicWork.save();
    } else {
      academicWork = new AcademicWorkPartB({
        userId,
        editorContent,
        files: fileData,
      });
      await academicWork.save();
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
    const academicWork = await AcademicWorkPartB.findOne({ userId });

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
                error,
              );
              reject(error);
            });
          } catch (error) {
            console.error(
              `Error opening download stream for file with ID: ${file.fileId}`,
              error,
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
      new mongoose.Types.ObjectId(fileId),
    );
    readStream.pipe(res);
  } catch (error) {
    console.error(`Error retrieving file with ID: ${fileId}`, error);
    res.status(500).json({ message: "Error retrieving file" });
  }
});

app.post("/rdConfo", upload.array("files"), async (req, res) => {
  try {
    const { userId, possesPhD, registerPhD, receivedPhd, tableData } = req.body;
    let { deletedFiles } = req.body;
    const files = req.files;
    let parsedTableData;
    if (typeof tableData === "string") {
      try {
        parsedTableData = JSON.parse(tableData);
      } catch (err) {
        console.error("Error parsing tableData:", err);
        return res.status(400).json({ message: "Invalid tableData format" });
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

    const existingData = await PhdConformation.findOne({ userId });
    if (existingData) {
      existingData.possesPhD = possesPhD;
      existingData.registerPhD = registerPhD;
      existingData.receivedPhd = receivedPhd;
      existingData.phDDetails = parsedTableData;
      if (Array.isArray(deletedFiles)) {
        existingData.files = existingData.files.filter(
          (file) => !deletedFiles.includes(file.fileId.toString()),
        );
      }
      existingData.files.push(...fileData);
      await existingData.save();
    } else {
      const newPhdConformationData = new PhdConformation({
        userId,
        possesPhD,
        registerPhD,
        receivedPhd,
        phDDetails: parsedTableData,
        files: fileData,
      });
      await newPhdConformationData.save();
    }

    res.json({ message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error_msg: "Internal Server Error! Please try again later." });
  }
});

app.get("/rdConfo/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const getPhdConformationDetails = await PhdConformation.findOne({ userId });

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
                error,
              );
              reject(error);
            });
          } catch (error) {
            console.error(
              `Error opening download stream for file with ID: ${file.fileId}`,
              error,
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
          phDDetails: getPhdConformationDetails.phDDetails,
          possesPhD: getPhdConformationDetails.possesPhD,
          receivedPhd: getPhdConformationDetails.receivedPhd,
          registerPhD: getPhdConformationDetails.registerPhD,
          files: successfulFiles,
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
    const { userId, tableData } = request.body;
    let { deletedFiles } = request.body;
    const files = request.files;
    let parsedTableData;

    // Parse tableData if it is a string
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
    const existingData = await ResearchAndDevelopmentPartB.findOne({ userId });

    if (existingData) {
      existingData.presentation_data = parsedTableData; // Use parsed table data
      if (Array.isArray(deletedFiles)) {
        existingData.files = existingData.files.filter(
          (file) => !deletedFiles.includes(file.fileId.toString()),
        );
      }
      existingData.files = existingData.files || [];
      existingData.files.push(...fileData);
      await existingData.save();
    } else {
      const newResearchAndDevelopmentPartB = new ResearchAndDevelopmentPartB({
        userId,
        presentation_data: parsedTableData, // Use parsed table data
        files: fileData,
      });
      await newResearchAndDevelopmentPartB.save();
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
    const researchAndDevelopmentPartBDetails =
      await ResearchAndDevelopmentPartB.findOne({ userId });
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
                  error,
                );
                reject(error);
              });
            } catch (error) {
              console.error(
                `Error opening download stream for file with ID: ${file.fileId}`,
                error,
              );
              reject(error);
            }
          });
        },
      );

      const filesData = await Promise.allSettled(filePromises);
      const successfulFiles = filesData
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

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
          presentation_data:
            researchAndDevelopmentPartBDetails.presentation_data,
          files: successfulFiles,
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
    const { userId, tableData } = request.body;
    let { deletedFiles } = request.body;
    const files = request.files;
    let parsedTableData;

    // Parse tableData if it is a string
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
    const existingData = await ResearchAndDevelopmentPartC.findOne({ userId });
    if (existingData) {
      existingData.projects_data = parsedTableData;
      if (Array.isArray(deletedFiles)) {
        existingData.files = existingData.files.filter(
          (file) => !deletedFiles.includes(file.fileId.toString()),
        );
      }
      existingData.files = existingData.files || [];
      existingData.files.push(...fileData);
      await existingData.save();
    } else {
      const newResearchAndDevelopmentPartC = new ResearchAndDevelopmentPartC({
        userId,
        projects_data: parsedTableData, // Use parsed table data
        files: fileData,
      });
      const res = await newResearchAndDevelopmentPartC.save();
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
    const researchAndDevelopmentPartCDetails =
      await ResearchAndDevelopmentPartC.findOne({ userId });
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
                  error,
                );
                reject(error);
              });
            } catch (error) {
              console.error(
                `Error opening download stream for file with ID: ${file.fileId}`,
                error,
              );
              reject(error);
            }
          });
        },
      );

      const filesData = await Promise.allSettled(filePromises);
      const successfulFiles = filesData
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      response.status(200).json({
        phdPartB: {
          projects_data: researchAndDevelopmentPartCDetails.projects_data,
          files: successfulFiles,
        },
      });
    } else {
      response.status(200).json({
        phdPartB: {
          projects_data: researchAndDevelopmentPartCDetails.projects_data,
          files: successfulFiles,
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
