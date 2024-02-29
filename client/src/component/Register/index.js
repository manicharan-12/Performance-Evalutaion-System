import { useState } from "react";
import "../ResponsiveDevice/index.css";
import validator from "validator";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";

const Register = (props) => {
  const { changeLoginRegister } = props;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("cse");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [usernameErr, setUsernameErr] = useState(false);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  const onSubmitRegisterUser = async (event) => {
    try {
      event.preventDefault();
      setDisabled(true);
      if (
        name === "" ||
        email === "" ||
        designation === "" ||
        department === "" ||
        username === "" ||
        password === ""
      ) {
        setErrorMsg("All Fields are Mandatory to be Filled");
        setDisabled(false);
      } else {
        if (usernameErr === false) {
          setErrorMsg("Username Already Exists! Please check");
          setDisabled(false);
        } else {
          if (passwordErr === true) {
            setErrorMsg(
              "Password is not Strong! We suggest you to choose Strong Password",
            );
            setDisabled(false);
          } else {
            setErrorMsg("");

            const api = "http://localhost:5000";
            const postData = {
              name,
              email,
              designation,
              dept: department,
              username,
              password,
            };
            const option = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(postData),
            };
            const response = await fetch(`${api}/register/`, option);
            if (response.ok === true) {
              const data = await response.json();
              const successMsg = data.success_msg;
              toast.success(`${successMsg}`, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setName("");
              setEmail("");
              setDepartment("cse");
              setDesignation("");
              setUsername("");
              setPassword("");
              setDisabled(false);
              setUsernameErrorMsg('')
              setPasswordErrorMsg('')
            } else {
              const data = await response.json();
              const errorMsg = data.error_msg;
              toast.error(`${errorMsg}`, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setDisabled(false);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(`Internal Server Error! Please try again Later`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setDisabled(false);
    }
  };

  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangeDesignation = (event) => {
    setDesignation(event.target.value);
  };
  const onChangeDepartment = (event) => {
    setDepartment(event.target.value);
  };

  const onChangeUsername = async (event) => {
    try {
      setUsername(event.target.value);
      await axios
        .post("http://localhost:5000/check-username", {
          username: event.target.value,
        })
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
            setUsernameErr(data.status);
            if (data.status === false) {
              setUsernameErrorMsg(`${event.target.value} Already Exists!`);
            } else {
              setUsernameErrorMsg(`${event.target.value} Available!`);
            }
          } else {
            toast.error(`${response.data.error_msg}`, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        });

      if (event.target.value === "") {
        setUsernameErrorMsg("");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Server Error! Cannot check the Username. Please Try again later",
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        },
      );
    }
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
    if (
      validator.isStrongPassword(event.target.value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setPasswordErrorMsg("Strong Password");
      setPasswordErr(false);
    } else {
      setPasswordErrorMsg("Not a Strong Password");
      setPasswordErr(true);
    }
    if (event.target.value === "") {
      setPasswordErrorMsg("");
      setPasswordErr(false);
    }
  };

  const passwordColor =
    passwordErr === true
      ? { color: "#ff3333", fontWeight: "Bolder" }
      : { color: "#5dac51", fontWeight: "Bolder" };
  const usernameColor =
    usernameErr === false
      ? { color: "#ff3333", fontWeight: "Bolder" }
      : { color: "#5dac51", fontWeight: "Bolder" };

  return (
    <>
      <form onSubmit={onSubmitRegisterUser}>
        <h1 className="main-heading-form">Register</h1>
        <div className="mb-3">
          <label htmlFor="name">Name:</label>
          <input
            className="form-control mt-1"
            type="text"
            id="name"
            value={name}
            onChange={onChangeName}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email">Email:</label>
          <input
            className="form-control mt-1"
            type="text"
            id="email"
            value={email}
            onChange={onChangeEmail}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="designation">Designation:</label>
          <input
            className="form-control mt-1"
            type="text"
            id="designation"
            value={designation}
            onChange={onChangeDesignation}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="department">Department:</label>
          <select
            className="form-control mt-1"
            id="department"
            value={department}
            onChange={onChangeDepartment}
          >
            <option disabled>Select Your Department</option>
            <option value="cse">CSE</option>
            <option value="it">IT</option>
            <option value="ai">AI</option>
            <option value="mech">MECH</option>
            <option value="chem">CHEM</option>
            <option value="civil">CIVIL</option>
            <option value="ece">ECE</option>
            <option value="eee">EEE</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="username">Username:</label>
          <input
            className="form-control mt-1"
            type="text"
            id="username"
            value={username}
            onChange={onChangeUsername}
          />
          <p style={usernameColor}>{usernameErrorMsg}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="password">Password:</label>
          <input
            className="form-control mt-1"
            type="text"
            id="password"
            value={password}
            onChange={onChangePassword}
          />
          <p style={passwordColor}>{passwordErrorMsg}</p>
        </div>
        <div className="mb-3">
          <button className="btn btn-primary" disabled={disabled}>
            {disabled === true ? (
              <Oval
                visible={true}
                height="25"
                width="25"
                color="#ffffff"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              "Register"
            )}
          </button>
        </div>
        <p style={{ color: "#ff3333", fontWeight: "Bolder" }}>{errorMsg}</p>
        <div>
          <button
            onClick={() => {
              changeLoginRegister("L");
            }}
            className="hyper-button"
            style={{color:"blue",textDecoration:"underline"}}
          >
            Login as a User
          </button>
        </div>
      </form>
      <ToastContainer
        position="bottom-center"
        autoClose={7000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
};

export default Register;
