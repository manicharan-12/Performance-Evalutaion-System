import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LoginButtonContainer,
  MainNavContainer,
  NavImage,
  ProfileButton,
  ProfileIcon,
  Dropdown,
  DropdownList,
  DropdownItem,
  ButtonContainer,
} from "./StyledComponents";
import logo from "../Images/AU LOGO.png";

const Header = () => {
  const navigate = useNavigate();
  const isHod = Cookies.get("role") === "HOD";
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleProfileClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleOutsideClick = (e) => {
    if (e.target.closest(".dropdown-container")) return;
    setIsDropdownVisible(false);
  };

  const getfacid = () => {
    const fac_id = searchParams.get("fac_id");
    return fac_id;
  };

  useEffect(() => {
    const fac = getfacid();
    setUserId(fac);
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
    Cookies.remove("user_id");
    Cookies.remove("role");
    navigate("/");
  };

  const onClickProfile = () => {
    navigate("/profile");
  };

  const onClickImage = () => {
    navigate(`/home?fac_id=${userId}`);
  };

  const handleNavigate = () => {
    navigate("/hod-dashboard");
  };

  return (
    <MainNavContainer className="shadow">
      <NavImage src={logo} alt="Anurag University" onClick={onClickImage} />
      {/* {isHod && (

        <button
          onClick={handleNavigate}
          style={{
            // Update Here
            height: "60px",
            padding: "4px",
            borderRadius: "8px",
            backgroundImage:
              "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
            color: "#fff",
            border: "none",
          }}
        >
          Dashboard
        </button>
      )} */}
      <LoginButtonContainer className="dropdown-container">
        <ProfileButton onClick={handleProfileClick}>
          <ProfileIcon />
        </ProfileButton>
        {isDropdownVisible && (
          <Dropdown>
            <DropdownList>
              <DropdownItem onClick={onClickProfile}>Profile</DropdownItem>
              <DropdownItem onClick={onClickLogout}>Logout</DropdownItem>
            </DropdownList>
          </Dropdown>
        )}
      </LoginButtonContainer>
    </MainNavContainer>
  );
};

export default Header;
