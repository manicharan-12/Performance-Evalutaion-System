import { useEffect, useState } from "react";
import logo from "../Images/AU LOGO.png";
import validator from "validator";
import {
  ErrorMessage,
  ExpiredImage,
  ExpiredMessage,
  ExpiredTokenContainer,
  FormHeading,
  InputContainer,
  InputElement,
  LabelElement,
  LoginButtonContainer,
  LoginForm,
  LoginRegisterButton,
  MainContainerLoginRegister,
  NavContainer,
  NavImage,
  ResetPasswordContainer,
} from "../Styling/StyledComponents";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import expired from "../Images/token expired.png";
import { Oval } from "react-loader-spinner";

const ResetPassword = () => {
  const [isValid, setIsValid] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(false);
  const { token } = useParams();

  useEffect(() => {
    try {
      axios
        .post(`http://localhost:5000/check/${token}`)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            setIsValid(true);
            setIsTimedOut(false);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 400) {
            setIsValid(false);
          } else if (error.response.status === 408) {
            setIsTimedOut(true);
          } else {
            toast.error(`Internal Server Error`, {
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
    } catch (error) {
      toast.error(`Internal Server Error`, {
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
  }, [token]);

  const onSubmitResetPassword = async (event) => {
    try {
      event.preventDefault();
      setDisabled(true);
      if (password !== conPassword) {
        setErrorMsg("PassWord Doesn't Match");
        setDisabled(false);
      } else {
        if (
          validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
        ) {
          setErrorMsg("");
          const api = "http://localhost:5000";
          const postData = { email, password };
          const option = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          };
          const response = await fetch(`${api}/resetPassword/${token}`, option);
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
            setConPassword("");
            setPassword("");
            setEmail("");
            setDisabled(false);
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
        } else {
          setErrorMsg("Not a Strong Password");
          setDisabled(false);
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

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onChangeConPassword = (event) => {
    setConPassword(event.target.value);
  };

  return (
    <>
      {isValid ? (
        <MainContainerLoginRegister>
          <NavContainer className="shadow">
            <NavImage src={logo} alt="logo" />
          </NavContainer>
          <ResetPasswordContainer>
            {isTimedOut ? (
              ""
            ) : (
              <LoginForm
                className="shadow pb-4"
                onSubmit={onSubmitResetPassword}
              >
                <FormHeading className="mb-3">
                  Complete Password Reset
                </FormHeading>
                <InputContainer className="mt-2 mb-3">
                  <LabelElement htmlFor="email">Email Id:</LabelElement>
                  <InputElement
                    className="form-control mt-1"
                    type="text"
                    onChange={onChangeEmail}
                    value={email}
                    id="email"
                  />
                  <InputContainer />
                </InputContainer>
                <InputContainer className="mb-3">
                  <LabelElement htmlFor="pass">New Password:</LabelElement>
                  <InputElement
                    className="form-control mt-1"
                    type="text"
                    onChange={onChangePassword}
                    value={password}
                    id="pass"
                  />
                </InputContainer>
                <InputContainer className="mb-3">
                  <LabelElement htmlFor="conPass">
                    Confirm Password:
                  </LabelElement>
                  <InputElement
                    className="form-control mt-1"
                    type="text"
                    onChange={onChangeConPassword}
                    value={conPassword}
                    id="conPass"
                  />
                </InputContainer>
                <LoginButtonContainer className="mb-2">
                  <LoginRegisterButton disabled={disabled}>
                    {disabled === true ? (
                      <Oval
                        visible={true}
                        height="25"
                        width="25"
                        color="#ffffff"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        className="text-center"
                      />
                    ) : (
                      "Reset"
                    )}
                  </LoginRegisterButton>
                </LoginButtonContainer>
                <ErrorMessage className="mb-0">{errorMsg}</ErrorMessage>
              </LoginForm>
            )}
          </ResetPasswordContainer>
        </MainContainerLoginRegister>
      ) : (
        <ExpiredTokenContainer>
          <ExpiredImage src={expired} alt="token expired" />
          <ExpiredMessage>
            This link is expired! Request a new One
          </ExpiredMessage>
        </ExpiredTokenContainer>
      )}

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

export default ResetPassword;
