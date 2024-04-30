import Back from "../Back";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import failure from "../Images/failure view.png";
import { useNavigate } from "react-router-dom";
import {
  HomeMainContainer,
  MainContainer,
  LoaderContainer,
  SubSectionHeading,
  FailureImage,
  FailureContainer,
  ParagraphContainer,
  Paragraph,
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

const ContributionToUniversity = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [tableData, setTableData] = useState([
    {
      nameOfTheResponsibility: "Hello World",
      contribution: "",
      apiScore: "",
    },
    {
      nameOfTheResponsibility: "",
      contribution: "",
      apiScore: "",
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchYear() {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        const userId = Cookies.get("user_id");
        const api = "http://localhost:5000";
        // const response = await fetch(`${api}/year/${userId}`);
        // if (response.ok === true) {
        //   const data = await response.json();
        //   setYear(data.academic_year);
        //   setApiStatus(apiStatusConstants.success);
        // } else {
        //   setApiStatus(apiStatusConstants.failure);
        // }
        setApiStatus(apiStatusConstants.success);
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchYear();
  }, []);

  const handleEditContribution = (articleIndex, updatedArticle) => {
    const updatedState = tableData.map((eachArticle, aIndex) => {
      if (aIndex === articleIndex) {
        return updatedArticle;
      }
      return eachArticle;
    });
    setTableData(updatedState);
  };

  const handleAddContribution = () => {
    const newArticle = {
      nameOfTheResponsibility: "",
      contribution: "",
      apiScore: "",
    };
    setTableData([...tableData, newArticle]);
  };

  const handleDeleteContribution = () => {
    const articleIndex = tableData.length - 1;
    const newTableData = tableData.filter((_, index) => index !== articleIndex);
    setTableData(newTableData);
  };

  const submitContributionToUniversity = () => {
    try {
      navigate("/contribution-to-department");
    } catch (error) {}
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
            Contribution to the School / University
          </SectionHeading>
          <MarksHeading>(Max. Score: 5)</MarksHeading>
        </HeadingContainer>
        <ParagraphContainer className="mt-3">
          <Paragraph>
            This section summaries all the responsibilities assigned by the
            authorities of the university to the candidate during academic year
            under consideration through a proper office order. This may include
            responsibilities like Head of Department, Training and Placement
            Officer, Coordinator, Committee member, Examination Officer, Warden,
            etc. The candidate will earn up to a maximum of five points for such
            additional responsibility. In case of major activities/events
            conducted, each of such activity carries 2.5 points.
          </Paragraph>
        </ParagraphContainer>
        <TableContainer className="mt-3">
          <Table>
            <TableMainHead>
              <TableRow>
                <TableHead>
                  Name of the Responsibility / Activity organized
                </TableHead>
                <TableHead>Contribution(s)</TableHead>
                <TableHead>Score (Max. 5)</TableHead>
              </TableRow>
            </TableMainHead>
            <TableBody>
              {tableData.map((contribution, contributionIndex) => {
                return (
                  <TableRow key={contributionIndex}>
                    <TableData>
                      <EditableValue
                        value={contribution.nameOfTheResponsibility || ""}
                        onValueChange={(newValue) =>
                          handleEditContribution(contributionIndex, {
                            ...contribution,
                            nameOfTheResponsibility: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={contribution.contribution || ""}
                        onValueChange={(newValue) =>
                          handleEditContribution(contributionIndex, {
                            ...contribution,
                            contribution: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>{contribution.apiScore}</TableData>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <SaveNextButton
            onClick={handleAddContribution}
            className="btn btn-primary mt-3 mr-3"
          >
            Add Certificate
          </SaveNextButton>
          {tableData.length > 1 && (
            <SaveNextButton
              onClick={() => handleDeleteContribution(tableData.length - 1)}
              className="btn btn-danger mt-3"
            >
              Delete Last Certificate
            </SaveNextButton>
          )}
        </TableContainer>
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            className="btn btn-primary"
            type="submit"
            onClick={submitContributionToUniversity}
          >
            Save & Next
          </SaveNextButton>
        </SaveNextButtonContainer>
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
  const renderContributionToUniversityPage = () => {
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
      <MainContainer className="mt-5">
        <Back />
        {renderContributionToUniversityPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default ContributionToUniversity;
