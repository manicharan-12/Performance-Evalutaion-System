import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  LoginButtonContainer,
  MainNavContainer,
  NavImage,
  ProfileButton,
  ProfileIcon,
  Dropdown,
  DropdownList,
  DropdownItem,
} from "./StyledComponents";
import logo from "../Images/AU LOGO.png";

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleProfileClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleOutsideClick = (e) => {
    if (e.target.closest(".dropdown-container")) return;
    setIsDropdownVisible(false);
  };

  useEffect(() => {
    if (isDropdownVisible) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isDropdownVisible]);

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/");
  };

  return (
    <MainNavContainer className="shadow">
      <NavImage src={logo} alt="Anurag University" />
      <LoginButtonContainer className="dropdown-container">
        <ProfileButton onClick={handleProfileClick}>
          <ProfileIcon />
        </ProfileButton>
        {isDropdownVisible && (
          <Dropdown>
            <DropdownList>
              <DropdownItem>Profile</DropdownItem>
              <DropdownItem onClick={onClickLogout}>Logout</DropdownItem>
            </DropdownList>
          </Dropdown>
        )}
      </LoginButtonContainer>
    </MainNavContainer>
  );
};

export default Header;
