import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { TiDelete } from "react-icons/ti";
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
  FileContainer,
  StyledDropzone,
  UnorderedList,
  ListItems,
  SpanEle,
  DeleteButton,
  InputFile,
} from "./StyledComponents";
import Header from "../../Header";
import Back from "../../Back";
import EditableValue from "../../EditableValue";
import failure from "../../Images/failure view.png";

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
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [tableData, setTableData] = useState([
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
        if (response.ok) {
          const data = await response.json();
          setYear(data.academic_year);
          const response2 = await fetch(`${api}/RD/PartB/${userId}`);
          const data2 = await response2.json();
          if (data2.phdPartB.presentation_data) {
            setTableData(data2.phdPartB.presentation_data);
            setFiles(data2.phdPartB.files || []);
          }
          setApiStatus(apiStatusConstants.success);
        } else {
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.error(error);
        setDisabled(false);
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchYear();
  }, []);

  const calculateApiScore = (value1, value2) => {
    if (value1 === "wos" || value1 === "scopus") {
      return value2 >= 5 ? 5 : 2.5;
    } else if (value1 === "none") {
      return value2 >= 5 ? 2.5 : 0;
    }
    return 0;
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) }),
      ),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "*",
    maxSize: 50000000,
  });

  const handleOpenInNewTab = async (fileId) => {
    try {
      const response = await fetch(
        `${"http://localhost:5000"}/files/${fileId}`,
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        window.URL.revokeObjectURL(url);
      } else {
        toast.error("Failed to open file: " + (await response.json()).message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error opening file:", error);
      toast.error(
        "An error occurred while opening the file. Please try again.",
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
        },
      );
    }
  };

  const handleDeleteFile = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.fileId !== fileId));
    setDeletedFiles((prevDeletedFiles) => [...prevDeletedFiles, fileId]);
  };

  const handleEditPresentation = (articleIndex, updatedArticle) => {
    updatedArticle.apiScore = calculateApiScore(
      updatedArticle.indexedIn,
      updatedArticle.noOfDays,
    );
    const updatedState = tableData.map((eachArticle, aIndex) =>
      aIndex === articleIndex ? updatedArticle : eachArticle,
    );
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
    const newTableData = tableData.slice(0, -1);
    setTableData(newTableData);
  };

  const submitRDPartB = async () => {
    try {
      const isEmpty = tableData.some((row) =>
        Object.values(row).some((value) => value === ""),
      );
      if (!isEmpty) {
        setDisabled(true);
        const userId = Cookies.get("user_id");
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("tableData", JSON.stringify(tableData));
        files.forEach((file) => {
          if (!file.fileId) {
            formData.append("files", file);
          }
        });
        deletedFiles.forEach((fileId) => {
          formData.append("deletedFiles", fileId);
        });
        const api = "http://localhost:5000";
        const response = await fetch(`${api}/RD/PartB`, {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          setDisabled(false);
          navigate("/research-and-development/partC");
        } else {
          setDisabled(false);
          toast.error("Internal Server Error! Please try again Later", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: true,
          });
        }
      } else {
        setDisabled(false);
        toast.error("Please fill all the fields before submitting", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      setDisabled(false);
      console.error(error);
      toast.error("Internal Server Error! Please try again Later", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
      });
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

  const renderSuccessView = () => (
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
          Springer, ACM or any other reputed professional bodies shall be given
          weightage. Each presentation in such conferences which are indexed in
          WoS or Scopus carries 2.5 points; FDP  5 Days carries 2.5 points.
          Furnish the documentary evidence of your claims.
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
            {tableData.map((paper, paperIndex) => (
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
            ))}
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
            onClick={handleDeletePresentation}
            className="btn btn-danger mt-3"
          >
            Delete Last Presentation
          </SaveNextButton>
        )}
      </TableContainer>
      <FileContainer className="mt-4">
        <SubSectionHeading>
          Submit the documentary evidences below
        </SubSectionHeading>
        <StyledDropzone {...getRootProps({ isDragActive })}>
          <InputFile {...getInputProps()} />
          {isDragActive ? (
            <>
              <Paragraph>Drop the files here...</Paragraph>
              <Paragraph>(Max File size is 50mb)</Paragraph>
            </>
          ) : (
            <>
              <Paragraph>
                Drag or drop some files here, or click to select files
              </Paragraph>
              <Paragraph>(Max File size is 50mb)</Paragraph>
            </>
          )}
        </StyledDropzone>
        <UnorderedList className="mt-3">
          {files.map((file, index) => (
            <ListItems key={index}>
              <SpanEle onClick={() => handleOpenInNewTab(file.fileId)}>
                {file.filename || file.name}
              </SpanEle>
              <DeleteButton onClick={() => handleDeleteFile(file.fileId)}>
                <TiDelete />
              </DeleteButton>
            </ListItems>
          ))}
        </UnorderedList>
      </FileContainer>
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

  const renderFailureView = () => (
    <FailureContainer>
      <FailureImage src={failure} />
      <SubSectionHeading className="mt-4">
        Failed to load Data. Retry Again!
      </SubSectionHeading>
    </FailureContainer>
  );

  const renderRDPartBPage = () => {
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
