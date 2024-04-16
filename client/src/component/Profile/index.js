import { useEffect, useState } from "react";
import Header from "../Header";
import {
  HeadingContainer,
  HomeMainContainer,
  InputContainerMain,
  InputElement,
  LabelElement,
  MainContainer,
  ProfileForm,
  SaveNextButton,
  SaveNextButtonContainer,
  SectionHeading,
  LoaderContainer,
  FailureContainer,
  FailureImage,
  SubSectionHeading,
  ErrorMessage,
} from "../Styling/StyledComponents";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import failure from "../Images/failure view.png";
import { useNavigate } from "react-router-dom";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const ProfilePage = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [doj, setDoj] = useState("");
  const [teachingExperience, setTeachingExperience] = useState(Number(""));
  const [industryExperience, setIndustryExperience] = useState(Number(""));
  const [totalExperience, setTotalExperience] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const onSubmitProfile = async (event) => {
    try {
      event.preventDefault();
      const userId = Cookies.get("user_id");
      if (
        doj === "" ||
        industryExperience === "" ||
        teachingExperience === ""
      ) {
        setErrorMsg("All Fields are mandatory to be filled");
      } else {
        setErrorMsg("");
        const api = "http://localhost:5000";
        const postData = {
          userId,
          doj,
          teachingExperience,
          industryExperience,
          totalExperience,
        };
        console.log(postData);
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        };
        await fetch(`${api}/update/profile`, option);
        navigate("/academicWork-I");
      }
    } catch (error) {}
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setApiStatus(apiStatusConstants.loading);

        const userId = Cookies.get("user_id");
        const api = "http://localhost:5000";
        const response = await fetch(`${api}/profile/details/${userId}`);
        if (response.ok === true) {
          const data = await response.json();

          setName(data.name);
          setDesignation(data.designation);
          setDepartment(data.department);
          setDoj(data.doj || "");
          setTeachingExperience(data.teaching_experience || "");
          setIndustryExperience(data.industry_experience || "");
          setTotalExperience(data.total_experience || "");
          setApiStatus(apiStatusConstants.success);
        } else {
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setTotalExperience(Number(teachingExperience) + Number(industryExperience));
  }, [teachingExperience, industryExperience]);

  const onChangeDate = (event) => {
    setDoj(event.target.value);
  };

  const onChangeTeaching = (event) => {
    setTeachingExperience(event.target.value);
  };

  const onChangeIndustry = (event) => {
    setIndustryExperience(event.target.value);
  };

  const renderLoadingView = () => {
    return (
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
  };

  const renderSuccessView = () => {
    return (
      <>
        <HeadingContainer>
          <SectionHeading>Profile Details</SectionHeading>
        </HeadingContainer>
        <ProfileForm onSubmit={onSubmitProfile}>
          <InputContainerMain className="mb-3 mt-3">
            <LabelElement htmlFor="name">Name:</LabelElement>
            <InputElement
              type="text"
              value={name}
              id="name"
              disabled
              className="form-control text-center"
              style={{
                width: "40%",
                backgroundColor: "#fff",
                cursor: "not-allowed",
              }}
            />
          </InputContainerMain>
          <InputContainerMain className="mb-3">
            <LabelElement htmlFor="dep">Department:</LabelElement>
            <InputElement
              type="text"
              value={department}
              id="dep"
              disabled
              className="form-control text-center"
              style={{
                width: "40%",
                backgroundColor: "#fff",
                cursor: "not-allowed",
              }}
            />
          </InputContainerMain>
          <InputContainerMain className="mb-3">
            <LabelElement htmlFor="des">Designation:</LabelElement>
            <InputElement
              type="text"
              value={designation}
              id="des"
              disabled
              className="form-control text-center"
              style={{
                width: "40%",
                backgroundColor: "#fff",
                cursor: "not-allowed",
              }}
            />
          </InputContainerMain>
          <InputContainerMain className="mb-3">
            <LabelElement htmlFor="DOJ">Date of Joining:</LabelElement>
            <InputElement
              type="date"
              value={doj}
              id="DOJ"
              className="form-control text-center"
              style={{ width: "40%" }}
              onChange={onChangeDate}
            />
          </InputContainerMain>
          <InputContainerMain className="mb-3">
            <LabelElement htmlFor="teach">Teaching Experience:</LabelElement>
            <InputElement
              type="text"
              value={teachingExperience}
              id="teach"
              className="form-control text-center"
              onChange={onChangeTeaching}
              style={{ width: "40%" }}
            />
          </InputContainerMain>
          <InputContainerMain className="mb-3">
            <LabelElement htmlFor="ind">Industry Experience:</LabelElement>
            <InputElement
              type="text"
              value={industryExperience}
              id="ind"
              className="form-control text-center"
              onChange={onChangeIndustry}
              style={{ width: "40%" }}
            />
          </InputContainerMain>
          <InputContainerMain className="mb-3">
            <LabelElement htmlFor="name">Total Experience:</LabelElement>
            <InputElement
              type="text"
              value={totalExperience}
              id="exp"
              className="form-control text-center"
              disabled
              style={{
                width: "40%",
                backgroundColor: "#fff",
                cursor: "not-allowed",
              }}
            />
          </InputContainerMain>
          <SaveNextButtonContainer>
            <SaveNextButton className="btn btn-primary" type="submit">
              Save & Next
            </SaveNextButton>
          </SaveNextButtonContainer>
          <ErrorMessage className="text-center mt-3">{errorMsg}</ErrorMessage>
        </ProfileForm>
      </>
    );
  };

  const renderFailureView = () => {
    return (
      <>
        <FailureContainer>
          <FailureImage src={failure} />
          <SubSectionHeading className="mt-4">
            Failed to load Data. Retry Again!
          </SubSectionHeading>
        </FailureContainer>
      </>
    );
  };

  const renderProfilePage = () => {
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return renderLoadingView();

      case apiStatusConstants.success:
        return renderSuccessView();

      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        break;
    }
  };

  return (
    <HomeMainContainer>
      <Header />
      <MainContainer className="mt-5 center">
        {renderProfilePage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default ProfilePage;
