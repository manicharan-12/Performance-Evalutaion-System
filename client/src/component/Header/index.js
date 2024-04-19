import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  LoginButtonContainer,
  LogoutButton,
  MainNavContainer,
  NavImage,
} from "./StyledComponents";
import logo from "../Images/AU LOGO.png";

const Header = () => {
  const navigate = useNavigate();

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/");
  };

  return (
    <MainNavContainer className="shadow">
      <NavImage src={logo} alt="Anurag University" />
      <LoginButtonContainer>
        <LogoutButton onClick={onClickLogout} className="btn btn-secondary">
          Logout
        </LogoutButton>
      </LoginButtonContainer>
    </MainNavContainer>
  );
};

export default Header;
