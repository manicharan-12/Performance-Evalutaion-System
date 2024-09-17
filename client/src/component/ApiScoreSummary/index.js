import Back from "../Back";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import failure from "../Images/failure view.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import EditableText from "./textArea";
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
} from "./StyledComponents";
import EditableValue from "../EditableValue";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const ApiScoreSummary = (props) => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [formId, setFormId] = useState("");
  const [tableData, setTableData] = useState({
    academicWorkPartA: "",
    academicWorkPartB: "",
    researchAndDevelopmentPartA: "",
    researchAndDevelopmentPartB: "",
    researchAndDevelopmentPartC: "",
    researchAndDevelopmentPartD: "",
    contributionToSchool: "",
    contributionToDepartment: "",
    contributionToSociety: "",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setApiStatus(apiStatusConstants.inProgress);
    const { apiScores } = props.data;
    setTableData(apiScores);
    setApiStatus(apiStatusConstants.success);
  }, []);

  const submitApiScoreSummary = () => {
    try {
    } catch (error) {
      toast.error("Internal Server Error! Please try again Later", {
        position: "bottom-center",
        autoClose: 6969,
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
            Summary of API Scores (to be filled by the functional head):
          </SectionHeading>
        </HeadingContainer>
        <TableContainer className="mt-3">
          <Table>
            <TableMainHead>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Maximum API Score</TableHead>
                <TableHead>API Score attained</TableHead>
                <TableHead>Remarks of the functional head</TableHead>
              </TableRow>
            </TableMainHead>
            <TableBody>
              <TableRow>
                <TableData>I</TableData>
                <TableData>Academic Work (a+b)</TableData>
                <TableData>45</TableData>
                <TableData>
                  {tableData.academicWorkPartA + tableData.academicWorkPartB}
                </TableData>
                <TableData
                  rowSpan="6"
                  style={{
                    verticalAlign: "top",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <EditableText value="" />
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>II</TableData>
                <TableData>Research work (a+b+c) or (a+b+d)</TableData>
                <TableData>25</TableData>
                <TableData>
                  {tableData.researchAndDevelopmentPartB +
                    tableData.researchAndDevelopmentPartC +
                    tableData.researchAndDevelopmentPartD +
                    5}
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>III</TableData>
                <TableData>Contribution to the University </TableData>
                <TableData>5</TableData>
                <TableData>{tableData.contributionToSchool}</TableData>
              </TableRow>
              <TableRow>
                <TableData>IV</TableData>
                <TableData>Contribution to the Department</TableData>
                <TableData>5</TableData>
                <TableData>{tableData.contributionToDepartment}</TableData>
              </TableRow>
              <TableRow>
                <TableData>V</TableData>
                <TableData>Contribution to Society</TableData>
                <TableData>5</TableData>
                <TableData>{tableData.contributionToSociety}</TableData>
              </TableRow>
              <TableRow>
                <TableData>I</TableData>
                <TableData>Assessment by functional head </TableData>
                <TableData>15</TableData>
                <TableData>
                  {tableData.academicWorkPartA +
                    tableData.academicWorkPartB +
                    tableData.researchAndDevelopmentPartB +
                    tableData.researchAndDevelopmentPartC +
                    tableData.researchAndDevelopmentPartD +
                    5 +
                    tableData.contributionToSchool +
                    tableData.contributionToDepartment +
                    tableData.contributionToSociety}
                </TableData>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            type="submit"
            onClick={submitApiScoreSummary}
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundImage:
                "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
              color: "#fff",
              border: "none",
            }}
          >
            Save
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

  return (
    <HomeMainContainer>
      <MainContainer className="mt-5 mb-5">
        {renderAssessmentOfFunctionalHeadPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default ApiScoreSummary;
