import { useState } from "react";
import validator from "validator";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import {
  ErrorMessage,
  FormHeading,
  HyperLinkButton,
  InputContainer,
  InputElement,
  LabelElement,
  LoginButtonContainer,
  LoginForm,
  LoginRegisterButton,
  LoginRegisterButtonContainer,
  OptionInput,
  SelectInput,
  SpanElement,
  UsernamePasswordErrMsg,
} from "../Styling/StyledComponents";

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
  const [conformPassword, setConformPassword] = useState("");

  const [usernameErr, setUsernameErr] = useState(false);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  const onSubmitRegisterUser = async (event) => {
    event.preventDefault();
    try {
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
            if (password !== conformPassword) {
              setErrorMsg("Password Doesn't Match! Please Check");
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
                setUsernameErrorMsg("");
                setPasswordErrorMsg("");
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

  const onChangeConformPassword = (event) => {
    setConformPassword(event.target.value);
  };

  const options = [
    "CSE",
    "IT",
    "AI",
    "AIML",
    "DS",
    "CS",
    "MECH",
    "CIVIL",
    "ECE",
    "EEE",
  ];
  const designations = ["HOD", "ASS PROF", "PROF"];

  const passwordColor =
    passwordErr === true ? { color: "#ff3333" } : { color: "#5dac51" };
  const usernameColor =
    usernameErr === false ? { color: "#ff3333" } : { color: "#5dac51" };

  return (
    <>
      <LoginForm className="mt-5 mb-5 shadow" onSubmit={onSubmitRegisterUser}>
        <FormHeading className="mb-3">Create Your Account</FormHeading>
        <InputContainer className="mb-3">
          <LabelElement htmlFor="name">Name:</LabelElement>
          <InputElement
            className="form-control mt-1"
            type="text"
            id="name"
            value={name}
            onChange={onChangeName}
          />
        </InputContainer>
        <InputContainer className="mb-3">
          <LabelElement htmlFor="email">Email:</LabelElement>
          <InputElement
            className="form-control mt-1"
            type="text"
            id="email"
            value={email}
            onChange={onChangeEmail}
          />
        </InputContainer>
        <InputContainer className="mb-3">
          <LabelElement htmlFor="designation">Designation:</LabelElement>
          <SelectInput
            className="form-control mt-1"
            id="designation"
            value={designation}
            onChange={onChangeDesignation}
          >
            {designations.map((eachDesignation) => {
              return (
                <OptionInput value={eachDesignation} key={eachDesignation}>
                  {eachDesignation}
                </OptionInput>
              );
            })}
          </SelectInput>
        </InputContainer>
        <InputContainer className="mb-3">
          <LabelElement htmlFor="department">Department:</LabelElement>
          <SelectInput
            className="form-control mt-1"
            id="department"
            value={department}
            onChange={onChangeDepartment}
          >
            <OptionInput disabled>Select Your Department</OptionInput>
            {options.map((eachOption) => {
              return (
                <OptionInput value={eachOption} key={eachOption}>
                  {eachOption}
                </OptionInput>
              );
            })}
          </SelectInput>
        </InputContainer>
        <InputContainer className="">
          <LabelElement htmlFor="username">Username</LabelElement>
          <InputElement
            className="form-control mt-1"
            type="text"
            id="username"
            value={username}
            onChange={onChangeUsername}
          />
          <UsernamePasswordErrMsg style={usernameColor} className="mt-1">
            {usernameErrorMsg}
          </UsernamePasswordErrMsg>
        </InputContainer>
        <InputContainer className="">
          <LabelElement htmlFor="password">Password:</LabelElement>
          <InputElement
            className="form-control mt-1"
            type="text"
            id="password"
            value={password}
            onChange={onChangePassword}
          />
          <UsernamePasswordErrMsg style={passwordColor} className="mt-1">
            {passwordErrorMsg}
          </UsernamePasswordErrMsg>
        </InputContainer>
        <InputContainer className="mb-3">
          <LabelElement htmlFor="con-password">Conform Password:</LabelElement>
          <InputElement
            className="form-control mt-1"
            type="text"
            id="con-password"
            value={conformPassword}
            onChange={onChangeConformPassword}
          />
        </InputContainer>
        <LoginButtonContainer>
          <LoginRegisterButton
            type="submit"
            className="btn btn-primary"
            disabled={disabled}
          >
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
          </LoginRegisterButton>
        </LoginButtonContainer>
        <ErrorMessage className="mt-3">{errorMsg}</ErrorMessage>
        <LoginRegisterButtonContainer>
          <HyperLinkButton
            type="button"
            onClick={() => {
              changeLoginRegister("L");
            }}
            className="hyper-button"
          >
            Already Registered? <SpanElement>Login Here</SpanElement>
          </HyperLinkButton>
        </LoginRegisterButtonContainer>
      </LoginForm>
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
