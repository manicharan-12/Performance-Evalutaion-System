import { useState } from "react";
import "../ResponsiveDevice/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, { expires: 30, path: "/" });
    navigate("/home");
  };

  const onSubmitLogin = async (event) => {
    event.preventDefault();
    try {
      setDisabled(true);
      if (username === "" || password === "") {
        setErrorMsg("All Fields are Mandatory to be Filled");
        setDisabled(false);
      } else {
        setErrorMsg("");
        const api = "http://localhost:5000";
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
          onSubmitSuccess(data.jwt_token);
          setDisabled(false);
        } else {
          console.log(response);
          const data = await response.json();
          console.log(data);
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

  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const { changeLoginRegister, changeButtonClicked } = props;

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/home" />;
  }
  return (
    <>
      <form onSubmit={onSubmitLogin}>
        <h1 className="main-heading-form">Welcome Back!</h1>
        <div className="mt-2 mb-3">
          <label htmlFor="username">Username:</label>
          <input
            className="form-control mt-1"
            onChange={onChangeUsername}
            value={username}
            type="text"
            id="username"
            placeholder="Enter Your Username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">Password:</label>
          <input
            className="form-control mt-1"
            onChange={onChangePassword}
            value={password}
            type="password"
            id="password"
            placeholder="Enter Your Password"
          />
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
              "Login"
            )}
          </button>
        </div>
        <p style={{ color: "#ff3333", fontWeight: "Bolder" }}>{errorMsg}</p>
      </form>
      <div>
        <button
          className="hyper-button m-2"
          onClick={() => {
            changeButtonClicked();
          }}
          style={{color:"blue",textDecoration:"underline"}}
        >
          Forgot Password
        </button>
        <button
          className="hyper-button"
          onClick={() => {
            changeLoginRegister("R");
          }}
        >
        
          Not a Registered User? <span style={{color:"blue",textDecoration:"underline"}}>Sign in</span>
        </button>
      </div>
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
