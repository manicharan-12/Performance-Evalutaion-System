import { useEffect, useState } from "react";
import Header from "../Header";
import validator from "validator";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import failure from "../Images/failure view.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
} from "./StyledComponents";

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
  const [teachingExperience, setTeachingExperience] = useState("");
  const [industryExperience, setIndustryExperience] = useState("");
  const [totalExperience, setTotalExperience] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();

  const isNumeric = (value) => validator.isNumeric(String(value));

  const onSubmitProfile = async (event) => {
    event.preventDefault();
    if (!isNumeric(teachingExperience) || !isNumeric(industryExperience)) {
      setErrorMsg("Teaching and Industry Experience must be numeric.");
      return;
    }
    setErrorMsg("");
    setDisabled(true);
    const userId = Cookies.get("user_id");
    const postData = {
      userId,
      doj,
      teachingExperience,
      industryExperience,
      totalExperience,
    };
    try {
      const api = "http://localhost:5000";
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      };
      await fetch(`${api}/update/profile`, option);
      setDisabled(false);
      toast.success("Profile Updated Successfully", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error(error);
      toast.error("Internal Server Error! Please try again Later", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        setDisabled(true);
        const userId = Cookies.get("user_id");
        const api = "http://localhost:5000";
        const response = await fetch(`${api}/profile/details/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setDesignation(data.designation);
          setDepartment(data.department);
          setDoj(data.doj || new Date());
          setTeachingExperience(data.teaching_experience || "");
          setIndustryExperience(data.industry_experience || "");
          setTotalExperience(data.total_experience || "");
          setDisabled(false);
          setApiStatus(apiStatusConstants.success);
        } else {
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (isNumeric(teachingExperience) && isNumeric(industryExperience)) {
      setTotalExperience(
        Number(teachingExperience) + Number(industryExperience),
      );
    } else {
      setTotalExperience(0);
    }
  }, [teachingExperience, industryExperience]);

  const onChangeDate = (event) => {
    setDoj(event.target.value);
  };

  const onChangeTeaching = (event) => {
    const newTeachingExperience = event.target.value;
    if (
      newTeachingExperience !== "" &&
      !validator.isNumeric(String(newTeachingExperience))
    ) {
      setErrorMsg("Please enter a valid number for Teaching Experience.");
      setTeachingExperience("");
    } else {
      setErrorMsg("");
      setTeachingExperience(newTeachingExperience);
    }
  };

  const onChangeIndustry = (event) => {
    const newIndustryExperience = event.target.value;
    if (
      newIndustryExperience !== "" &&
      !validator.isNumeric(String(newIndustryExperience))
    ) {
      setErrorMsg("Please enter a valid number for Industry Experience.");
      setIndustryExperience("");
    } else {
      setErrorMsg("");
      setIndustryExperience(newIndustryExperience);
    }
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
    const dojDate = new Date(doj);
    const isoString = dojDate.toISOString();
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
              value={isoString.split("T")[0]}
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
            <SaveNextButton
              className="btn btn-primary"
              type="submit"
              disabled={disabled}
            >
              {disabled === true ? (
                <Oval
                  visible={true}
                  height="25"
                  width="25"
                  color="#ffffff"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  className="text-center"
                />
              ) : (
                "Save"
              )}
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
      case apiStatusConstants.inProgress:
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
      <MainContainer className="mt-5 mb-5 center">
        {renderProfilePage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default ProfilePage;
