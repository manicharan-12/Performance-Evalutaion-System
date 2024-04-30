import Back from "../../Back";
import React, { useEffect, useState } from "react";
import Header from "../../Header";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import failure from "../../Images/failure view.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const RDPartB = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [year, setYear] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [tableData, setTableData] = useState([
    {
      titleOfThePaper: "",
      titleOfTheme: "",
      organizedBy: "",
      indexedIn: "",
      noOfDays: "",
      apiScore: "",
    },
    {
      titleOfThePaper: "",
      titleOfTheme: "",
      organizedBy: "",
      indexedIn: "",
      noOfDays: "",
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
          const response2 = await fetch(`${api}/RD/PartB/${userId}`);
          const data2 = await response2.json();
          if (data2.presentation_data) {
            setTableData(data2.presentation_data);
          }
          setApiStatus(apiStatusConstants.success);
        } else {
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.log(error);
        setDisabled(false);
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchYear();
  }, []);

  const calculateApiScore = (value1, value2) => {
    if (value1 === "wos" || value1 === "scopus") {
      if (value2 >= 5) {
        return 5;
      } else {
        return 2.5;
      }
    } else if (value1 === "none") {
      if (value2 >= 5) {
        return 2.5;
      } else {
        return 0;
      }
    }
    return;
  };

  const handleEditPresentation = (articleIndex, updatedArticle) => {
    updatedArticle.apiScore = calculateApiScore(
      updatedArticle.indexedIn,
      updatedArticle.noOfDays,
    );
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

  const handleAddPresentation = () => {
    const newArticle = {
      titleOfThePaper: "",
      titleOfTheme: "",
      organizedBy: "",
      indexedIn: "",
      noOfDays: "",
      apiScore: "",
    };
    setTableData([...tableData, newArticle]);
  };

  const handleDeletePresentation = () => {
    const articleIndex = tableData.length - 1;
    const newTableData = tableData.filter((_, index) => index !== articleIndex);
    setTableData(newTableData);
  };

  const submitRDPartB = async () => {
    try {
      const isEmpty = tableData.some((row) =>
        Object.values(row).some((value) => value !== ""),
      );
      if (isEmpty) {
        setDisabled(true);
        const userId = Cookies.get("user_id");
        const api = "http://localhost:5000";
        const postData = {
          userId,
          tableData,
        };
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        };
        const response = await fetch(`${api}/RD/PartB`, option);
        if (response.ok === true) {
          setDisabled(false);
          navigate("/research-and-development/partC");
        } else {
          setDisabled(false);
          toast.error(`Internal Server Error! Please try again Later`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } else {
        setDisabled(false);
        toast.error(`Please fill all the fields before submitting`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      setDisabled(false);
      console.log(error);
      toast.error(`Internal Server Error! Please try again Later`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
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
        <SubSectionHeadingContainer>
          <SubSectionHeading>
            b. Presentation in International Conference/Symposia OR attended
            FDP/STTP in {year}:
          </SubSectionHeading>
        </SubSectionHeadingContainer>
        <ParagraphContainer className="mt-3">
          <Paragraph>
            In this section, the candidate summarizes the details of paper
            presentation in conferences/symposia or attended FDP/STTP that will
            earn up to a maximum of five points. Conference organized by IEEE,
            Springer, ACM or any other reputed professional bodies shall be
            given weightage. Each presentation in such conferences which are
            indexed in WoS or Scopus carries 2.5 points; FDP  5 Days carries
            2.5 points. Furnish the documentary evidence of your claims.
          </Paragraph>
        </ParagraphContainer>
        <TableContainer className="mt-3">
          <Table>
            <TableMainHead>
              <TableRow>
                <TableHead>Title of the paper presented</TableHead>
                <TableHead>
                  Title / Theme of Conference/ Symposia/ FDP/ STTP
                </TableHead>
                <TableHead>Organized by</TableHead>
                <TableHead>Indexed in? (WoS/Scopus)</TableHead>
                <TableHead>No. of days</TableHead>
                <TableHead>Score (Max. 5)</TableHead>
              </TableRow>
            </TableMainHead>
            <TableBody>
              {tableData.map((paper, paperIndex) => {
                return (
                  <TableRow key={paperIndex}>
                    <TableData>
                      <EditableValue
                        value={paper.titleOfThePaper || ""}
                        onValueChange={(newValue) =>
                          handleEditPresentation(paperIndex, {
                            ...paper,
                            titleOfThePaper: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={paper.titleOfTheme || ""}
                        onValueChange={(newValue) =>
                          handleEditPresentation(paperIndex, {
                            ...paper,
                            titleOfTheme: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={paper.organizedBy || ""}
                        onValueChange={(newValue) =>
                          handleEditPresentation(paperIndex, {
                            ...paper,
                            organizedBy: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <SelectEle
                        defaultValue={paper.indexedIn || ""}
                        onChange={(event) =>
                          handleSelectOption(event, paper, paperIndex)
                        }
                        validate={(input) => true}
                        className="form-control w-100 text-center"
                      >
                        <OptionEle value="">Select an Option</OptionEle>
                        <OptionEle value="wos">WoS</OptionEle>
                        <OptionEle value="scopus">Scopus</OptionEle>
                        <OptionEle value="none">None</OptionEle>
                      </SelectEle>
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={paper.noOfDays || ""}
                        onValueChange={(newValue) =>
                          handleEditPresentation(paperIndex, {
                            ...paper,
                            noOfDays: newValue,
                          })
                        }
                        validate={(input) => /^[0-9]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>{paper.apiScore}</TableData>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <SaveNextButton
            onClick={handleAddPresentation}
            className="btn btn-primary mt-3 mr-3"
          >
            Add Presentation
          </SaveNextButton>
          {tableData.length > 1 && (
            <SaveNextButton
              onClick={() => handleDeletePresentation(tableData.length - 1)}
              className="btn btn-danger mt-3"
            >
              Delete Last Presentation
            </SaveNextButton>
          )}
        </TableContainer>
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            className="btn btn-primary"
            type="submit"
            onClick={submitRDPartB}
            disabled={disabled}
          >
            {disabled ? (
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
              "Save & Next"
            )}
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
  const renderRDPartBPage = () => {
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
        {renderRDPartBPage()}
      </MainContainer>
      <ToastContainer
        position="bottom-center"
        autoClose={7000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </HomeMainContainer>
  );
};

export default RDPartB;
