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
const crypto = require("crypto");

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
      const token = crypto.randomBytes(32).toString("hex");
      console.log("Token:", token);
      const expires_at = new Date();
      expires_at.setMinutes(expires_at.getMinutes() + 5);
      console.log("Expires at:", expires_at);

      const insertTokenQuery = `INSERT INTO tokens (email, token, expires_at) VALUES (?, ?, ?)`;
      try {
        await db.run(insertTokenQuery, [email, token, expires_at]);
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
            response.status(200);
            response.send({
              success_msg: "Please check your email for the reset link",
              token,
            });
          }
        });
      } catch (error) {
        response.status(403);
        response.send({ error_msg: "A mail has already sent! Please Check" });
        console.error("Query error:", error.message);
      }
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

app.post("/check/:token", async (request, response) => {
  try {
    const { token } = request.params;
    const checkTokenExistQuery = `select * from tokens where token=?`;
    const checkTokenExist = await db.get(checkTokenExistQuery, [token]);
    if (checkTokenExist !== undefined) {
      const expires_at = checkTokenExist.expires_at;
      if (new Date() < expires_at) {
        response.status(200);
        response.send("Success");
      } else {
        response.status(408);
        response.send("TimedOUt");
      }
    } else {
      response.status(400);
      response.send("Invalid URl");
    }
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

app.post("/resetPassword/:token", async (request, response) => {
  try {
    const { token } = request.params;
    const { email, password } = request.body;
    const checkMailQuery = `select * from tokens where email=?`;
    const checkMail = await db.get(checkMailQuery, [email]);
    if (checkMail !== undefined) {
      const expires_at = new Date(checkMail.expires_at);
      console.log("Expires at:", expires_at);

      if (new Date() < expires_at) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatePasswordQuery = `update user set password=? where email=?`;
        await db.run(updatePasswordQuery, [hashedPassword, email]);
        response.send({ success_msg: "Password Successfully Updated" });

        const deleteTokenQuery = `delete from tokens where email=?`;
        await db.run(deleteTokenQuery, [email]);
        console.log("Token Successfully deleted");
      } else {
        response.status(402);
        const deleteExpireTokenQuery = `delete from tokens where email = ?`;
        const deleteExpireToken = await db.run(deleteExpireTokenQuery, [email]);
        response.send({
          error_msg: "The link is expired! Request for a new link",
        });
      }
    } else {
      response.status(401);
      response.send({
        error_msg: "The email is Invalid. Enter the correct mail id",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500);
    response.send({
      error_msg: "Internal Server Error! Please Try again Later",
    });
  }
});

setInterval(async () => {
  const now = new Date();
  const deleteExpireTokenQuery = `delete from tokens where expires_at <= ?`;
  await db.run(deleteExpireTokenQuery, [now]);
}, 60000);
