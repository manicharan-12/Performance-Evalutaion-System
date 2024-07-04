import Back from "../Back";
import React, { useEffect, useState, useCallback } from "react";
import Header from "../Header";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import failure from "../Images/failure view.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HomeMainContainer,
  MainContainer,
  LoaderContainer,
  SubSectionHeading,
  FailureImage,
  FailureContainer,
  TableContainer,
  Table,
  TableMainHead,
  TableRow,
  TableHead,
  TableBody,
  TableData,
  SaveNextButton,
  SaveNextButtonContainer,
  HeadingContainer,
  SectionHeading,
  MarksHeading,
} from "./StyledComponents";
import EditableValue from "../EditableValue";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const AssessmentOfFunctionalHead = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [formId, setFormId] = useState("");
  const [tableData, setTableData] = useState({
    impression: "",
    examination: "",
    interpersonal: "",
    apiScore: "",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let id;
    async function fetchYear() {
      try {
        const formId = await searchParams.get("f_id");
        id = formId;
        await setFormId(id);
        setApiStatus(apiStatusConstants.inProgress);
        const userId = Cookies.get("user_id");
        const api = "http://localhost:5000";

        setApiStatus(apiStatusConstants.success);
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchYear();
  }, []);

  const calculateTotalScore = (data) => {
    const { impression, examination, interpersonal } = data;
    const total = [impression, examination, interpersonal]
      .map((value) => parseInt(value, 10) || 0)
      .reduce((acc, score) => acc + score, 0);
    return total;
  };

  const handleValueChange = (field, value) => {
    setTableData((prevState) => {
      const updatedData = { ...prevState, [field]: value };
      return { ...updatedData, apiScore: calculateTotalScore(updatedData) };
    });
  };

  const submitAssessmentOfFunctionalHead = () => {
    try {
      // Handle form submission
    } catch (error) {
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
          <SectionHeading>
            Assessment of the Faculty by the functional head / HoD
          </SectionHeading>
          <MarksHeading>(Max. Score: 15)</MarksHeading>
        </HeadingContainer>
        <TableContainer className="mt-3">
          <Table>
            <TableMainHead>
              <TableRow>
                <TableHead>Items to be considered</TableHead>
                <TableHead>Maximum API Score</TableHead>
                <TableHead>API Score attained</TableHead>
                <TableHead>Total Score (Max 15)</TableHead>
              </TableRow>
            </TableMainHead>
            <TableBody>
              <TableRow>
                <TableData>Impression about the teaching work </TableData>
                <TableData>5</TableData>
                <TableData>
                  <EditableValue
                    value={tableData.impression}
                    onValueChange={(value) =>
                      handleValueChange("impression", value)
                    }
                    validate={(input) => /^[0-9]+$/.test(input)}
                    type="text"
                    disabled={false}
                  />
                </TableData>
                <TableData rowSpan="3">{tableData.apiScore}</TableData>
              </TableRow>
              <TableRow>
                <TableData>Examination duties</TableData>
                <TableData>5</TableData>
                <TableData>
                  <EditableValue
                    value={tableData.examination}
                    onValueChange={(value) =>
                      handleValueChange("examination", value)
                    }
                    validate={(input) => /^[0-9]+$/.test(input)}
                    type="text"
                    disabled={false}
                  />
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>
                  Interpersonal Relationships and teamwork, Professional ethics,
                  values and commitment
                </TableData>
                <TableData>5</TableData>
                <TableData>
                  <EditableValue
                    value={tableData.interpersonal}
                    onValueChange={(value) =>
                      handleValueChange("interpersonal", value)
                    }
                    validate={(input) => /^[0-9]+$/.test(input)}
                    type="text"
                    disabled={false}
                  />
                </TableData>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            type="submit"
            onClick={submitAssessmentOfFunctionalHead}
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundImage:
                "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
              color: "#fff",
              border: "none",
            }}
          >
            Save & Next
          </SaveNextButton>
        </SaveNextButtonContainer>
      </>
    );
  };

  const renderFailureView = () => {
    return (
      <FailureContainer>
        <FailureImage src={failure} />
        <SubSectionHeading className="mt-4">
          Failed to load Data. Retry Again!
        </SubSectionHeading>
      </FailureContainer>
    );
  };

  const renderAssessmentOfFunctionalHeadPage = () => {
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

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;

    switch (selectedOption) {
      case "AcademicWork I":
        navigate(`/academicWork/part-a/?f_id=${formId}`);
        break;
      case "AcademicWork II":
        navigate(`/academicWork/part-b/?f_id=${formId}`);
        break;
      case "R&D Conformation":
        navigate(`/research-and-development/conformation/?f_id=${formId}`);
        break;
      case "R&D Part A":
        navigate(`/research-and-development/partA/?f_id=${formId}`);
        break;
      case "R&D Part B":
        navigate(`/research-and-development/partB/?f_id=${formId}`);
        break;
      case "R&D Part C":
        navigate(`/research-and-development/partC/?f_id=${formId}`);
        break;
      case "R&D Part D":
        navigate(`/research-and-development/partD/?f_id=${formId}`);
        break;
      case "Contribution To University School":
        navigate(`/contribution-to-university-school/?f_id=${formId}`);
        break;
      case "Contribution To Department":
        navigate(`/contribution-to-department/?f_id=${formId}`);
        break;
      case "Contribution To Society":
        navigate(`/contribution-to-society/?f_id=${formId}`);
        break;
      default:
        break;
    }
  };

  return (
    <HomeMainContainer>
      <Header />
      <MainContainer className="mt-5 mb-5">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "18px",
          }}
        >
          <Back />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
            }}
          >
            <p style={{ marginRight: "10px", marginTop: "10px" }}>
              Navigate to
            </p>
            <select
              style={{
                border: "1px solid #000",
                borderRadius: "5px",
                padding: "5px",
              }}
              onChange={handleSelectChange}
            >
              <option>AcademicWork I</option>
              <option>AcademicWork II</option>
              <option>R&D Conformation</option>
              <option>R&D Part A</option>
              <option>R&D Part B</option>
              <option>R&D Part C</option>
              <option>R&D Part D</option>
              <option>Contribution To University School</option>
              <option>Contribution To Department</option>
              <option selected>Contribution To Society</option>
            </select>
          </div>
        </div>
        {renderAssessmentOfFunctionalHeadPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default AssessmentOfFunctionalHead;
