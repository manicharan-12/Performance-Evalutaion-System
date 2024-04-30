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

const ContributionToSociety = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [tableData, setTableData] = useState([
    {
      nameOfTheResponsibility: "",
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

  const submitContributionToSociety = () => {
    try {
      navigate("/");
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
            Contribution to Society/Academic/Co-Curricular/Extra
            Curricular/Social Contribution/NSS/NCC
          </SectionHeading>
          <MarksHeading>(Max. Score: 5)</MarksHeading>
        </HeadingContainer>
        <ParagraphContainer className="mt-3">
          <Paragraph>
            The candidate involved in different initiatives by
            University/Department or NSS/NCC units. The candidate will earn a
            maximum of five points. Each completed responsibility carries two
            points and on-going activity carries one point. The claim should be
            supported by an office order/ official communication from Head of
            the Institute/concerned.
          </Paragraph>
        </ParagraphContainer>
        <TableContainer className="mt-3">
          <Table>
            <TableMainHead>
              <TableRow>
                <TableHead>Responsibilities assigned</TableHead>
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
            onClick={submitContributionToSociety}
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
  const renderContributionToSocietyPage = () => {
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
        {renderContributionToSocietyPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default ContributionToSociety;
