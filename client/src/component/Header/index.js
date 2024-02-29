import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/");
  };

  return (
    <div>
      <button onClick={onClickLogout}>Logout</button>
    </div>
  );
};

export default Header;
