import { useNavigate, useLocation } from "react-router-dom";
import { BackButton, BackButtonContainer } from "./StyledComponents";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const Back = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSummaryPath = location.pathname.startsWith('/summary');

  return (
    <>
    {!isSummaryPath && (
      <BackButtonContainer className="mb-4">
      <BackButton
        style={{ fontSize: "24px" }}
        onClick={() => {
          navigate(-1);
        }}
      >
        <MdOutlineKeyboardBackspace />
      </BackButton>
    </BackButtonContainer>
    )}
    </>
  );
};

export default Back;
