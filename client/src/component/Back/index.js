// Back.js
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const Back = () => {
  // get the navigate and location hooks
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="back-button-container">
      <button
        style={{ fontWeight: "bolder" }}
        className="back-button"
        // use the navigate function to go back
        onClick={() => navigate(-1)}
      >
        <MdOutlineKeyboardBackspace className="icon-back" />
        Back
      </button>
    </div>
  );
};

export default Back;
