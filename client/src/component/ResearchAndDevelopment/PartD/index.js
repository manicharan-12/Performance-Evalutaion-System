import Back from "../../Back";
import React, { useEffect, useState, useCallback } from "react";
import Header from "../../Header";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import failure from "../../Images/failure view.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";
import { TiDelete } from "react-icons/ti";
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
  FileContainer,
  StyledDropzone,
  UnorderedList,
  ListItems,
  SpanEle,
  DeleteButton,
  InputFile,
} from "./StyledComponents";
import EditableValue from "../../EditableValue";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const RDPartD = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [tableData, setTableData] = useState([
    {
      nameOfTheCertificate: "",
      organization: "",
      score: "",
      apiScore: "",
    },
  ]);
  const [formId, setFormId] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let id;
    async function fetchYear() {
      try {
        const formId = await searchParams.get("f_id");
        id = formId;
        await setFormId(id);
      } catch (error) {
        console.error(error);
        navigate("/home");
      }
      try {
        setApiStatus(apiStatusConstants.inProgress);
        const userId = Cookies.get("user_id");

        setApiStatus(apiStatusConstants.success);
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchYear();
  }, []);

  const handleEditCertificate = (articleIndex, updatedArticle) => {
    const updatedState = tableData.map((eachArticle, aIndex) => {
      if (aIndex === articleIndex) {
        return updatedArticle;
      }
      return eachArticle;
    });
    setTableData(updatedState);
  };

  const handleAddCertificate = () => {
    const newArticle = {
      nameOfTheCertificate: "",
      organization: "",
      score: "",
      apiScore: "",
    };
    setTableData([...tableData, newArticle]);
  };

  const handleDeleteCertificate = () => {
    const newTableData = tableData.slice(0, -1);
    setTableData(newTableData);
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
      const response = await fetch(`http://localhost:5000/files/${fileId}`);
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
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
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
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        },
      );
    }
  };

  const handleDeleteFile = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.fileId !== fileId));
    setDeletedFiles((prevDeletedFiles) => [...prevDeletedFiles, fileId]);
  };

  const submitRDPartD = () => {
    try {
      navigate(`/contribution-to-university-school/?f_id=${formId}`);
    } catch (error) {
      console.error("Navigation error:", error);
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
      />
    </LoaderContainer>
  );

  const renderSuccessView = () => (
    <>
      <SubSectionHeadingContainer>
        <SubSectionHeading>
          d. Certifications from reputed Professional
          Bodies/NPTEL/SWAYAM/Industry/other notable certification agencies:
        </SubSectionHeading>
      </SubSectionHeadingContainer>
      <ParagraphContainer className="mt-3">
        <Paragraph>
          The candidate will earn up to a maximum of five points. Each
          certification carries two points. Furnish the documentary evidence of
          each certification.
        </Paragraph>
      </ParagraphContainer>
      <TableContainer className="mt-3">
        <Table>
          <TableMainHead>
            <TableRow>
              <TableHead>Name of the Certification</TableHead>
              <TableHead>Organization from which it is acquired</TableHead>
              <TableHead>Score / Grade</TableHead>
              <TableHead>Score (Max. 5)</TableHead>
            </TableRow>
          </TableMainHead>
          <TableBody>
            {tableData.map((certificate, certificateIndex) => (
              <TableRow key={certificateIndex}>
                <TableData>
                  <EditableValue
                    value={certificate.nameOfTheCertificate || ""}
                    onValueChange={(newValue) =>
                      handleEditCertificate(certificateIndex, {
                        ...certificate,
                        nameOfTheCertificate: newValue,
                      })
                    }
                    validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                    type="text"
                  />
                </TableData>
                <TableData>
                  <EditableValue
                    value={certificate.organization || ""}
                    onValueChange={(newValue) =>
                      handleEditCertificate(certificateIndex, {
                        ...certificate,
                        organization: newValue,
                      })
                    }
                    validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                    type="text"
                  />
                </TableData>
                <TableData>
                  <EditableValue
                    value={certificate.score || ""}
                    onValueChange={(newValue) =>
                      handleEditCertificate(certificateIndex, {
                        ...certificate,
                        score: newValue,
                      })
                    }
                    validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                    type="text"
                  />
                </TableData>
                <TableData>{certificate.apiScore}</TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <SaveNextButton
          onClick={handleAddCertificate}
          className="mt-3 mr-3"
          style={{
            padding: "12px",
            borderRadius: "8px",
            backgroundImage:
              "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
            color: "#fff",
            border: "none",
          }}
        >
          Add Certificate
        </SaveNextButton>
        {tableData.length > 1 && (
          <SaveNextButton
            onClick={handleDeleteCertificate}
            className="mt-3"
            style={{
              marginLeft: "12px",
              padding: "12px",
              borderRadius: "8px",
              backgroundImage:
                "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
              color: "#fff",
              border: "none",
            }}
          >
            Delete Certificate
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
          type="submit"
          onClick={submitRDPartD}
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

  const renderFailureView = () => (
    <FailureContainer>
      <FailureImage src={failure} />
      <SubSectionHeading className="mt-4">
        Failed to load Data. Retry Again!
      </SubSectionHeading>
    </FailureContainer>
  );

  const renderRDPartDPage = () => {
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
      <MainContainer className="mt-5 mb-5">
        <Back />
        {renderRDPartDPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default RDPartD;
