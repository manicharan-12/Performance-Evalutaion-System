import { useState } from "react";
import logo from "../Images/AU LOGO.png";
import Login from "../Login";
import Register from "../Register";
import ForgotPassword from "../ForgotPassword";
import {
  MainContainerLoginRegister,
  NavContainer,
  NavImage,
  ContainerLoginRegister,
} from "../Styling/StyledComponents";

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
      <MainContainerLoginRegister>
        <NavContainer className="shadow">
          <NavImage src={logo} alt="logo" />
        </NavContainer>
        <ContainerLoginRegister>
          {isButtonClicked ? (
            <ForgotPassword changeButtonClicked={changeButtonClicked} />
          ) : (
            renderLoginRegister()
          )}
        </ContainerLoginRegister>
      </MainContainerLoginRegister>
    </>
  );
};

export default LoginRegister;
