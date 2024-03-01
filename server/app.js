const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { v4: uuidv4 } = require("uuid");
const app = express();
const nodemailer = require("nodemailer");
const { log } = require("console");

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "faculty.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(5000, () => {
      console.log("Server Running at http://localhost:5000");
    });

    await db.run(`PRAGMA foreign_keys=1;`);
  } catch (e) {
    console.log(`DataBase Error ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.post("/check-username", async (request, response) => {
  try {
    const { username } = request.body;

    const checkUsernameQuery = `select * from user where username='${username}'`;
    const checkUsername = await db.get(checkUsernameQuery);
    if (checkUsername === undefined) {
      response.send({ status: true });
    } else {
      response.send({ status: false });
    }
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.post("/register/", async (request, response) => {
  try {
    const { name, email, designation, dept, username, password } = request.body;

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkEmailExistQuery = `select * from user where email='${email}'`;
    const checkEmailExist = await db.get(checkEmailExistQuery);
    if (checkEmailExist === undefined) {
      const addUserQuery = `insert into user(id,name,email,designation,department,username,password) values('${id}','${name}','${email}','${designation}','${dept}','${username}','${hashedPassword}')`;
      const addUser = await db.run(addUserQuery);
      response.send({ success_msg: "User Registered Successfully" });
    } else {
      response.status(400);
      response.send({ error_msg: "Email Already Exists! Try Choosing Other" });
    }
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.post("/login", async (request, response) => {
  try {
    const { username, password } = request.body;

    const checkUsernameQuery = `select * from user where username='${username}'`;
    const checkUsername = await db.get(checkUsernameQuery);
    if (checkUsername !== undefined) {
      const checkPassword = await bcrypt.compare(
        password,
        checkUsername.password,
      );
      if (checkPassword === true) {
        const payload = { username: checkUsername.username };
        const jwt_token = jwt.sign(payload, "Anurag University");
        response.send({ jwt_token });
      } else {
        response.status(401);
        response.send({ error_msg: "Incorrect Password" });
      }
    } else {
      response.status(401);
      response.send({ error_msg: "Username Doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.post("/forgot-password", async (request, response) => {
  try {
    const { email } = request.body;
    const checkEmailExistQuery = `select * from user where email='${email}'`;
    const checkEmailExist = await db.get(checkEmailExistQuery);
    if (checkEmailExist !== undefined) {
      const newPassword = Math.floor(Math.random() * 100000000);
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
        subject: "Password Updated",
        text: `Your account password is been updated to ${newPassword}`,
      };

      transporter.sendMail(options, async (error, info) => {
        if (error) {
          console.log(error);
        } else {
          const hashedPassword = await bcrypt.hash(`${newPassword}`, 10);
          const updatePasswordQuery = `update user set password='${hashedPassword}' where email='${email}'`;
          await db.run(updatePasswordQuery);
          response.send({
            success_msg: "A new Password Sent to mail. Please Check",
          });
        }
      });
    } else {
      response.status(404);
      response.send({ error_msg: "Email Doesn't Exist! Please Check" });
    }
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});
