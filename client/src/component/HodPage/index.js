import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import failure from "../Images/failure view.png";
import Cookies from "js-cookie";
import {
  LoaderContainer,
  FailureContainer,
  FailureImage,
  SubSectionHeading,
  HomeMainContainer,
  MainContainer,
} from "../Home/StyledComponents";
import { TeacherCard, TeacherCardContainer } from "./StyledComponents";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const HodDashboard = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [userName, setUserName] = useState("");
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setApiStatus(apiStatusConstants.inProgress);
      const userId = Cookies.get("user_id");
      const api = "http://localhost:6969";

      try {
        const profileResponse = await fetch(`${api}/profile/details/${userId}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserName(profileData.name);

          const department = profileData.department;
          const teachersResponse = await fetch(`${api}/teachers/${department}`);

          if (teachersResponse.ok) {
            const { teachers } = await teachersResponse.json();
            setTeachers(teachers);
            setApiStatus(apiStatusConstants.success);
          } else {
            throw new Error("Failed to fetch teachers");
          }
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error(error);
        setApiStatus(apiStatusConstants.failure);
        toast.error(error.message, {
          position: "bottom-center",
          autoClose: 6969,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      }
    }
    fetchData();
  }, []);

  const renderHomePage = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();

      case apiStatusConstants.success:
        return renderSuccessView();

      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  const renderLoadingView = () => (
    <LoaderContainer data-testid="loader">
      <ThreeDots
        visible={true}
        height="50"
        width="50"
        color="#0b69ff"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </LoaderContainer>
  );

  const renderFailureView = () => (
    <>
      <FailureContainer>
        <FailureImage src={failure} />
        <SubSectionHeading className="mt-4">
          Failed to load Data. Retry Again!
        </SubSectionHeading>
      </FailureContainer>
    </>
  );

  const renderSuccessView = () => (
    <>
      <h1>Welcome to your Dashboard, {userName}!</h1>
      <TeacherCardContainer>
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher._id}
            onClick={() => navigate(`/user-detail/?fac_id=${teacher._id}`)}
          >
            {teacher.name}: 
            {teacher._id}
          </TeacherCard>
        ))}
      </TeacherCardContainer>
    </>
  );

  return (
    <HomeMainContainer className="mb-5">
      <MainContainer className="mt-5">{renderHomePage()}</MainContainer>
    </HomeMainContainer>
  );
};

export default HodDashboard;
