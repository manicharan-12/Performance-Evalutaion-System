import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import { TiDelete } from "react-icons/ti";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Back from "../../Back";
import Header from "../../Header";
import failureImage from "../../Images/failure view.png";
import EditableValue from "../../EditableValue";
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

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const RDPartA = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [year, setYear] = useState("");
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [tableData, setTableData] = useState([
    {
      articleTitle: "",
      journalName: "",
      indexedIn: "",
      dateOfPublication: "",
      oneOrCorrespondingAuthor: "",
      apiScore: "",
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchYear = async () => {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        const userId = Cookies.get("user_id");
        const response = await fetch(`http://localhost:5000/year/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setYear(data.academic_year);
          setApiStatus(apiStatusConstants.success);
        } else {
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.error(error);
        setApiStatus(apiStatusConstants.failure);
      }
    };

    fetchYear();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) =>
      prevFiles.concat(
        acceptedFiles.map((file) => ({
          ...file,
          preview: URL.createObjectURL(file),
        })),
      ),
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "*",
    maxSize: 50000000,
  });

  const handleOpenInNewTab = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:5000/files/${fileId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        alert(`Failed to open file: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error opening file:", error);
      toast.error(
        "An error occurred while opening the file. Please try again.",
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        },
      );
    }
  };

  const handleDeleteFile = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.fileId !== fileId));
    setDeletedFiles((prevDeletedFiles) => prevDeletedFiles.concat(fileId));
  };

  const handleEditArticle = (articleIndex, updatedArticle) => {
    setTableData((prevData) =>
      prevData.map((article, index) =>
        index === articleIndex ? updatedArticle : article,
      ),
    );
  };

  const handleSelectOption = (event, articleIndex) => {
    const { value } = event.target;
    setTableData((prevData) =>
      prevData.map((article, index) =>
        index === articleIndex ? { ...article, indexedIn: value } : article,
      ),
    );
  };

  const handleAddArticle = () => {
    setTableData((prevData) => [
      ...prevData,
      {
        articleTitle: "",
        journalName: "",
        indexedIn: "",
        dateOfPublication: "",
        oneOrCorrespondingAuthor: "",
        apiScore: "",
      },
    ]);
  };

  const handleDeleteArticle = () => {
    setTableData((prevData) => prevData.slice(0, -1));
  };

  const submitRDPartA = async () => {
    try {
      const formData = new FormData();
      const userId = Cookies.get("user_id");
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
      navigate("/research-and-development/partB");
    } catch (error) {
      console.error("Error submitting RD Part A:", error);
      toast.error("An error occurred during submission. Please try again.", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
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
      />
    </LoaderContainer>
  );

  const renderSuccessView = () => (
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
          Chapter carries one point, Book publication carries two points, Patent
          Grant carries four points and Patent publication carries two points.
          Furnish the documentary evidence (Proof of index in WoS / Scopus /
          Patent / Book Chapter) of your claims.
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
            {tableData.map((article, index) => (
              <TableRow key={index}>
                <TableData>
                  <EditableValue
                    value={article.articleTitle || ""}
                    onValueChange={(newValue) =>
                      handleEditArticle(index, {
                        ...article,
                        articleTitle: newValue,
                      })
                    }
                    validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                    type="text"
                  />
                </TableData>
                <TableData>
                  <EditableValue
                    value={article.journalName || ""}
                    onValueChange={(newValue) =>
                      handleEditArticle(index, {
                        ...article,
                        journalName: newValue,
                      })
                    }
                    validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                    type="text"
                  />
                </TableData>
                <TableData>
                  <SelectEle
                    value={article.indexedIn || ""}
                    onChange={(event) => handleSelectOption(event, index)}
                  >
                    <OptionEle value="">Select an Option</OptionEle>
                    <OptionEle value="wos">WoS</OptionEle>
                    <OptionEle value="scopus">Scopus</OptionEle>
                    <OptionEle value="ugc">UGC</OptionEle>
                  </SelectEle>
                </TableData>
                <TableData>
                  <EditableValue
                    value={article.dateOfPublication || ""}
                    onValueChange={(newValue) =>
                      handleEditArticle(index, {
                        ...article,
                        dateOfPublication: newValue,
                      })
                    }
                    validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                    type="text"
                  />
                </TableData>
                <TableData>
                  <EditableValue
                    value={article.oneOrCorrespondingAuthor || ""}
                    onValueChange={(newValue) =>
                      handleEditArticle(index, {
                        ...article,
                        oneOrCorrespondingAuthor: newValue,
                      })
                    }
                    validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                    type="text"
                  />
                </TableData>
                <TableData>{article.apiScore}</TableData>
              </TableRow>
            ))}
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
            onClick={handleDeleteArticle}
            className="btn btn-danger mt-3"
          >
            Delete Last Article
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
        <SaveNextButton className="btn btn-primary" onClick={submitRDPartA}>
          Save & Next
        </SaveNextButton>
      </SaveNextButtonContainer>
    </>
  );

  const renderFailureView = () => (
    <FailureContainer>
      <FailureImage src={failureImage} alt="failure" />
      <SubSectionHeading className="mt-4">
        Failed to load Data. Retry Again!
      </SubSectionHeading>
    </FailureContainer>
  );

  const renderRDPartAPage = () => {
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
        {renderRDPartAPage()}
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

export default RDPartA;
