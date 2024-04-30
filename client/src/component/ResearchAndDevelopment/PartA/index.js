import Back from "../../Back";
import React, { useEffect, useState } from "react";
import Header from "../../Header";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import failure from "../../Images/failure view.png";
import { useNavigate } from "react-router-dom";
import {
  HomeMainContainer,
  MainContainer,
  LoaderContainer,
  SubSectionHeading,
  FailureImage,
  FailureContainer,
  SubSectionHeadingContainer,
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
  SelectEle,
  OptionEle,
} from "./StyledComponents";
import EditableValue from "../../EditableValue";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const RDPartA = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [year, setYear] = useState("");
  const [tableData, setTableData] = useState([
    {
      articleTitle: "Hello World",
      journalName: "",
      indexedIn: "",
      dateOfPublication: "",
      OneOrCorrespondingAuthor: "",
      apiScore: "",
    },
    {
      articleTitle: "",
      indexedIn: "",
      dateOfPublication: "",
      OneOrCorrespondingAuthor: "",
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
        const response = await fetch(`${api}/year/${userId}`);
        if (response.ok === true) {
          const data = await response.json();
          setYear(data.academic_year);
          setApiStatus(apiStatusConstants.success);
        } else {
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchYear();
  }, []);

  const handleEditArticle = (articleIndex, updatedArticle) => {
    const updatedState = tableData.map((eachArticle, aIndex) => {
      if (aIndex === articleIndex) {
        return updatedArticle;
      }
      return eachArticle;
    });
    setTableData(updatedState);
  };

  const handleSelectOption = (event, articles, articlesIndex) => {
    const updatedTableData = [...tableData];
    updatedTableData[articlesIndex].indexedIn = event.target.value;
    setTableData(updatedTableData);
  };

  const handleAddArticle = () => {
    const newArticle = {
      articleTitle: "",
      indexedIn: "",
      dateOfPublication: "",
      OneOrCorrespondingAuthor: "",
      apiScore: "",
    };
    setTableData([...tableData, newArticle]);
  };

  const handleDeleteArticle = () => {
    const articleIndex = tableData.length - 1;
    const newTableData = tableData.filter((_, index) => index !== articleIndex);
    setTableData(newTableData);
  };

  const submitRDPartA = () => {
    try {
      navigate("/research-and-development/partB");
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
        <SubSectionHeadingContainer>
          <SubSectionHeading>
            a. Details of Research Publications (Articles/Book
            chapters/Books/Patents) in {year}:
          </SubSectionHeading>
        </SubSectionHeadingContainer>
        <ParagraphContainer className="mt-3">
          <Paragraph>
            The section summarizes the Research Publications of the candidate
            which will earn up to a maximum of ten points. For each article
            publication indexed in Web of Science (WoS) carries five points,
            Scopus carries three points, UGC publication carries one point, Book
            Chapter carries one point, Book publication carries two points,
            Patent Grant carries four points and Patent publication carries two
            points. Furnish the documentary evidence (Proof of index in WoS /
            Scopus / Patent / Book Chapter) of your claims.
          </Paragraph>
        </ParagraphContainer>
        <TableContainer className="mt-3">
          <Table>
            <TableMainHead>
              <TableRow>
                <TableHead>Article title</TableHead>
                <TableHead>Journal name with ISSN/ISBN No.</TableHead>
                <TableHead>Indexed in? (WoS, Scopus, UGC approved)</TableHead>
                <TableHead>Date of Publication</TableHead>
                <TableHead>
                  Whether you are the 1st or corresponding author?
                </TableHead>
                <TableHead>API Score (Max.15)</TableHead>
              </TableRow>
            </TableMainHead>
            <TableBody>
              {tableData.map((articles, articlesIndex) => {
                return (
                  <TableRow key={articlesIndex}>
                    <TableData>
                      <EditableValue
                        value={articles.articleTitle || ""}
                        onValueChange={(newValue) =>
                          handleEditArticle(articlesIndex, {
                            ...articles,
                            articleTitle: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={articles.journalName || ""}
                        onValueChange={(newValue) =>
                          handleEditArticle(articlesIndex, {
                            ...articles,
                            journalName: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <SelectEle
                        defaultValue={articles.indexedIn || ""}
                        onChange={(event) =>
                          handleSelectOption(event, articles, articlesIndex)
                        }
                        validate={(input) => true}
                        className="form-control w-100"
                      >
                        <OptionEle value="">Select an Option</OptionEle>
                        <OptionEle value="wos">WoS</OptionEle>
                        <OptionEle value="scopus">Scopus</OptionEle>
                        <OptionEle value="ugc">UGC</OptionEle>
                      </SelectEle>
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={articles.dateOfPublication || ""}
                        onValueChange={(newValue) =>
                          handleEditArticle(articlesIndex, {
                            ...articles,
                            dateOfPublication: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={articles.OneOrCorrespondingAuthor || ""}
                        onValueChange={(newValue) =>
                          handleEditArticle(articlesIndex, {
                            ...articles,
                            OneOrCorrespondingAuthor: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>{articles.apiScore}</TableData>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <SaveNextButton
            onClick={handleAddArticle}
            className="btn btn-primary mt-3 mr-3"
          >
            Add Article
          </SaveNextButton>
          {tableData.length > 1 && (
            <SaveNextButton
              onClick={() => handleDeleteArticle(tableData.length - 1)}
              className="btn btn-danger mt-3"
            >
              Delete Last Article
            </SaveNextButton>
          )}
        </TableContainer>
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            className="btn btn-primary"
            type="submit"
            onClick={submitRDPartA}
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
  const renderRDPartAPage = () => {
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
        {renderRDPartAPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default RDPartA;
