import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import {
  LoginForm,
  InputContainer,
  LabelElement,
  InputElement,
  LoginButtonContainer,
  LoginRegisterButton,
  ErrorMessage,
  LoginRegisterButtonContainer,
  HyperLinkButton,
  SpanElement,
  FormHeading,
} from "./StyledComponents";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();

  const onSubmitSuccess = (jwtToken, userId, role) => {
    Cookies.set("jwt_token", jwtToken, { expires: 1, path: "/" });
    Cookies.set("user_id", userId, { expires: 1, path: "/" });
    Cookies.set("role", role, { expires: 1, path: "/" });
    console.log(role);

    navigate(`/home?fac_id=${userId}`);
    // if (role === "HOD") {
    //   navigate("/hod-dashboard");  // Redirect to the HOD Dashboard
    // } else {
    //   navigate("/home");  // Redirect to the Home page
    // }
  };

  const onSubmitLogin = async (event) => {
    event.preventDefault();
    // if (!navigator.onLine) {
    //   await toast.error(
    //     "You are offline. Please connect to the internet and try again.",
    //     {
    //       position: "bottom-center",
    //       autoClose: 6969,
    //       hideProgressBar: true,
    //       closeOnClick: true,
    //       pauseOnHover: false,
    //       draggable: true,
    //     }
    //   );
    //   return;
    // }
    try {
      setDisabled(true);
      if (username === "" || password === "") {
        setErrorMsg("All Fields are Mandatory to be Filled");
        setDisabled(false);
      } else {
        setErrorMsg("");
        const api = "http://localhost:6969";
        const postData = { username, password };
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        };
        const response = await fetch(`${api}/login/`, option);
        if (response.ok === true) {
          const data = await response.json();
          onSubmitSuccess(data.jwt_token, data.id, data.role);
          setDisabled(false);
        } else {
          const data = await response.json();
          const errorMsg = data.error_msg;
          toast.error(`${errorMsg}`, {
            position: "bottom-center",
            autoClose: 6969,
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
    } catch (error) {
      console.log(error);
      toast.error(`Internal Server Error! Please try again Later`, {
        position: "bottom-center",
        autoClose: 6969,
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

  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const { changeLoginRegister, changeButtonClicked } = props;

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    const userId=Cookies.get("user_id")
    return <Navigate to={`/home?fac_id=${userId}`} />;
  }
  return (
    <>
      <LoginForm onSubmit={onSubmitLogin} className="shadow">
        <FormHeading className="mb-3">Welcome Back!</FormHeading>
        <InputContainer className="mt-2 mb-3">
          <LabelElement htmlFor="username">Username:</LabelElement>
          <InputElement
            className="form-control mt-1"
            onChange={onChangeUsername}
            value={username}
            type="text"
            id="username"
            placeholder="Enter Your Username"
          />
        </InputContainer>
        <InputContainer className="mt-2 mb-3">
          <LabelElement htmlFor="username">Password:</LabelElement>
          <InputElement
            className="form-control mt-1"
            onChange={onChangePassword}
            value={password}
            type="password"
            id="password"
            placeholder="Enter Your Password"
          />
        </InputContainer>
        <LoginButtonContainer className="mb-3">
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
              "Login"
            )}
          </LoginRegisterButton>
        </LoginButtonContainer>
        <ErrorMessage>{errorMsg}</ErrorMessage>
        <LoginRegisterButtonContainer>
          <HyperLinkButton
            onClick={() => {
              changeButtonClicked();
            }}
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Forgot Password
          </HyperLinkButton>
          <HyperLinkButton
            className="hyper-button"
            onClick={() => {
              changeLoginRegister("R");
            }}
          >
            Not a Registered User? <SpanElement>Sign in</SpanElement>
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

export default Login;
