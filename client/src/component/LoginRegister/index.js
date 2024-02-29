import { useState } from "react";
import login from "../Images/login.png";
import "../ResponsiveDevice/index.css";
import Login from "../Login";
import Register from "../Register";
import ForgotPassword from "../ForgotPassword";

import { MdOutlineKeyboardBackspace } from "react-icons/md";

const LoginRegister = () => {
  const [loginRegister, setLoginRegister] = useState("L");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const renderLoginRegister = () => {
    switch (loginRegister) {
      case "L":
        return (
          <Login
            changeLoginRegister={changeLoginRegister}
            changeButtonClicked={changeButtonClicked}
          />
        );

      case "R":
        return <Register changeLoginRegister={changeLoginRegister} />;
      default:
        break;
    }
  };
  const changeLoginRegister = (value) => {
    setLoginRegister(value);
  };

  const changeButtonClicked = () => {
    setIsButtonClicked(!isButtonClicked);
  };

  return (
    <>
      <div className="main-container">
        {isButtonClicked ? (
          <ForgotPassword changeButtonClicked={changeButtonClicked} />
        ) : (
          <div className="div-container">
            {loginRegister === "R" ? (
              <div className="div-container-forgot">
                <div className="back-button-container">
                  <button
                    style={{ fontWeight: "bolder" }}
                    className="back-button"
                    onClick={() => {
                      changeLoginRegister("L");
                    }}
                  >
                    <MdOutlineKeyboardBackspace className="icon-back" />
                    Back
                  </button>
                </div>
                <div
                  className="image-container"
                  style={{ height: "-webkit-fill-available", width: "100%" }}
                >
                  <div className="w-100 image-login-register">
                    <img src={login} alt="" className="w-100" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="image-container">
                <div className="w-100">
                  <img src={login} alt="" className="w-100" />
                </div>
              </div>
            )}

            <div className="login-register-container">
              {renderLoginRegister()}
            </div>
            <div></div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginRegister;
