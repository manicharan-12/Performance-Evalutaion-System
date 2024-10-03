import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import EditableText from "./textArea";
import failure from "../Images/failure view.png";
import {
  HomeMainContainer,
  MainContainer,
  LoaderContainer,
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
  FailureImage,
  FailureContainer,
  SubSectionHeading,
} from "./StyledComponents";

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
    apiScores: {
      academicWorkPartA: 0,
      academicWorkPartB: 0,
      researchAndDevelopmentPartA: 0,
      researchAndDevelopmentPartB: 0,
      researchAndDevelopmentPartC: 0,
      researchAndDevelopmentPartD: 0,
      contributionToSchool: 0,
      contributionToDepartment: 0,
      contributionToSociety: 0,
    },
    reviewerApiScores: {
      academicWorkPartA: 0,
      academicWorkPartB: 0,
      researchAndDevelopmentPartA: 0,
      researchAndDevelopmentPartB: 0,
      researchAndDevelopmentPartC: 0,
      researchAndDevelopmentPartD: 0,
      contributionToSchool: 0,
      contributionToDepartment: 0,
      contributionToSociety: 0,
      functionalHeadAssessment: 0,
    },
  });

  useEffect(() => {
    setApiStatus(apiStatusConstants.inProgress);
    const { apiScores, reviewerApiScores } = props;
    setTableData({
      apiScores,
      reviewerApiScores,
    });
    setApiStatus(apiStatusConstants.success);
  }, [props]);

  const submitApiScoreSummary = () => {
    try {
      // Submission logic here
    } catch (error) {
      toast.error("Internal Server Error! Please try again later", {
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

  const renderSuccessView = () => {
    const { apiScores, reviewerApiScores } = tableData;

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
                <TableHead style={{ width: "5%" }}>S.No</TableHead>
                <TableHead style={{ width: "20%" }}>Criteria</TableHead>
                <TableHead style={{ width: "14%" }}>
                  Maximum API Score
                </TableHead>
                <TableHead style={{ width: "14%" }}>
                  API Score Attained
                </TableHead>
                <TableHead style={{ width: "14%" }}>
                  Reviewer Score Attained
                </TableHead>
                <TableHead style={{ width: "33%" }}>
                  Remarks of the functional head
                </TableHead>
              </TableRow>
            </TableMainHead>
            <TableBody>
              <TableRow>
                <TableData>I</TableData>
                <TableData>Academic Work (a+b)</TableData>
                <TableData>45</TableData>
                <TableData>
                  {apiScores.academicWorkPartA + (apiScores.academicWorkPartB)}
                </TableData>
                <TableData>
                  {reviewerApiScores.academicWorkPartA +
                    reviewerApiScores.academicWorkPartB}
                </TableData>
                <TableData
                  rowSpan="6"
                  style={{
                    verticalAlign: "top",
                    wordWrap: "break-word",
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
                  {apiScores.researchAndDevelopmentPartA +
                    (apiScores.researchAndDevelopmentPartB || 5) +
                    (apiScores.researchAndDevelopmentPartC || 5)}
                </TableData>
                <TableData>
                  {reviewerApiScores.researchAndDevelopmentPartA +
                    reviewerApiScores.researchAndDevelopmentPartB +
                    reviewerApiScores.researchAndDevelopmentPartC}
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>III</TableData>
                <TableData>Contribution to the University</TableData>
                <TableData>5</TableData>
                <TableData>{apiScores.contributionToSchool}</TableData>
                <TableData>{reviewerApiScores.contributionToSchool}</TableData>
              </TableRow>
              <TableRow>
                <TableData>IV</TableData>
                <TableData>Contribution to the Department</TableData>
                <TableData>5</TableData>
                <TableData>{apiScores.contributionToDepartment}</TableData>
                <TableData>
                  {reviewerApiScores.contributionToDepartment}
                </TableData>
              </TableRow>
              <TableRow>
                <TableData>V</TableData>
                <TableData>Contribution to Society</TableData>
                <TableData>5</TableData>
                <TableData>{apiScores.contributionToSociety}</TableData>
                <TableData>{reviewerApiScores.contributionToSociety}</TableData>
              </TableRow>
              <TableRow>
                <TableData>I</TableData>
                <TableData>Assessment by functional head</TableData>
                <TableData>15</TableData>
                <TableData>
                  {0}
                </TableData>
                <TableData>
                  {reviewerApiScores.functionalHeadAssessment}
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

  const renderFailureView = () => (
    <FailureContainer>
      <FailureImage src={failure} />
      <SubSectionHeading className="mt-4">
        Failed to load Data. Retry Again!
      </SubSectionHeading>
    </FailureContainer>
  );

  const renderAssessmentOfFunctionalHeadPage = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <LoaderContainer data-testid="loader">
            <ThreeDots
              visible={true}
              height="50"
              width="50"
              color="#0b69ff"
              radius="9"
            />
          </LoaderContainer>
        );
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
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
