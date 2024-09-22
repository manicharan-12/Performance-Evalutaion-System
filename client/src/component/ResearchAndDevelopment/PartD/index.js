import Back from "../../Back";
import React, { useEffect, useState, useCallback } from "react";
import Header from "../../Header";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import failure from "../../Images/failure view.png";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
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

const RDPartD = (props) => {
  const location = useLocation();
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [tableData, setTableData] = useState([
    {
      nameOfTheCertificate: "",
      organization: "",
      score: "",
      apiScore: "",
      reviewerScore: "",
    },
  ]);
  const [formId, setFormId] = useState("");
  const [disabled, setDisabled] = useState(false);
  const isSummaryPath =
    location.pathname.startsWith("/summary") ||
    location.pathname.startsWith("/review");
  const isReview = location.pathname.startsWith("/review");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const getFormIdFromSearchParams = () => {
      try {
        const formId = searchParams.get("f_id");
        return formId;
      } catch (error) {
        console.error("Error fetching form ID from search params:", error);
        navigate("/home");
      }
    };

    const fetchCertificates = async (id) => {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        const userId = Cookies.get("user_id");
        const api = "http://localhost:6969";

        const response = await fetch(`${api}/RD/PartD/${userId}/?formId=${id}`);
        const data = await response.json();

        if (data.phdPartD.certificates_data) {
          const transformedData = data.phdPartD.certificates_data.map(
            (item) => ({
              nameOfTheCertificate: item.nameOfTheCertificate,
              organization: item.organization,
              score: item.score,
              apiScore: item.apiScore,
              hodRemark: item.hodRemark,
            })
          );
          setTableData(transformedData);
          setFiles(data.phdPartD.files || []);
        }

        setDisabled(false);
        setApiStatus(apiStatusConstants.success);
      } catch (error) {
        console.error("Error fetching certificates data:", error);
        setDisabled(false);
        setApiStatus(apiStatusConstants.failure);
      }
    };

    const formId = getFormIdFromSearchParams();
    if (formId) {
      setFormId(formId);

      if (!isReview) {
        fetchCertificates(formId);
      } else {
        setApiStatus(apiStatusConstants.inProgress);
        const { certificates_data, files } = props.data;
        setTableData(certificates_data);
        setFiles(files);
        setApiStatus(apiStatusConstants.success);
      }
    }
  }, [isReview, searchParams, props.data]);

  const handleEditCertificate = (certificateIndex, updatedCertificate) => {
    const updatedState = tableData.map((eachCertificate, aIndex) => {
      if (aIndex === certificateIndex) {
        const { nameOfTheCertificate, organization, score } =
          updatedCertificate;
        const allFieldsFilled =
          nameOfTheCertificate.trim() !== "" &&
          organization.trim() !== "" &&
          score.trim() !== "";
        return {
          ...updatedCertificate,
          apiScore: allFieldsFilled ? 2 : eachCertificate.apiScore,
        };
      }
      return eachCertificate;
    });
    setTableData(updatedState);
  };

  const handleAddCertificate = () => {
    const newArticle = {
      nameOfTheCertificate: "",
      organization: "",
      score: "",
      apiScore: "",
      hodRemark: "",
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
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "*",
    maxSize: 69690000,
  });

  const handleOpenInNewTab = async (file) => {
    // if(!navigator.onLine){
    //   await toast.error("You are offline. Please connect to the internet and try again.", {
    //     position: "bottom-center",
    //     autoClose: 6969,
    //     hideProgressBar: true,
    //     closeOnClick: true,
    //     pauseOnHover: false,
    //     draggable: true,
    //   });
    //   return;
    // }
    if (file.fileId) {
      try {
        const response = await fetch(
          `http://localhost:6969/files/${file.fileId}`
        );
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");
          window.URL.revokeObjectURL(url);
        } else {
          toast.error(
            "Failed to open file: " + (await response.json()).message,
            {
              position: "bottom-center",
              autoClose: 6969,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }
      } catch (error) {
        console.error("Error opening file:", error);
        toast.error(
          "An error occurred while opening the file. Please try again.",
          {
            position: "bottom-center",
            autoClose: 6969,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
    } else {
      const url = file.preview;
      window.open(url, "_blank");
    }
  };

  const handleDeleteFile = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.fileId !== fileId));
    setDeletedFiles((prevDeletedFiles) => [...prevDeletedFiles, fileId]);
  };

  const calculateTotalApiScore = (data) => {
    const score = data.reduce(
      (total, item) => total + (parseFloat(item.apiScore) || 0),
      0
    );
    return score >= 5 ? 5 : score;
  };

  const submitRDPartD = async () => {
    // if(!navigator.onLine){
    //   await toast.error("You are offline. Please connect to the internet and try again.", {
    //     position: "bottom-center",
    //     autoClose: 6969,
    //     hideProgressBar: true,
    //     closeOnClick: true,
    //     pauseOnHover: false,
    //     draggable: true,
    //   });
    //   return;
    // }
    const allFieldsFilled = tableData.every(
      (article) =>
        article.nameOfTheCertificate.trim() !== "" &&
        article.organization.trim() !== "" &&
        article.score.trim() !== ""
    );

    if (!allFieldsFilled) {
      await toast.error(`All fields are required to be filled!`, {
        position: "bottom-center",
        autoClose: 6969,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    try {
      setDisabled(true);
      const userId = Cookies.get("user_id");
      const formData = new FormData();
      const totalApiScore = calculateTotalApiScore(tableData);
      formData.append("userId", userId);
      formData.append("formId", formId);
      formData.append("tableData", JSON.stringify(tableData));
      formData.append("totalApiScore", totalApiScore);
      files.forEach((file) => {
        if (!file.fileId) {
          formData.append("files", file);
        }
      });
      deletedFiles.forEach((fileId) => {
        formData.append("deletedFiles", fileId);
      });
      const api = "http://localhost:6969";
      const option = {
        method: "POST",
        body: formData,
      };
      const response = await fetch(`${api}/RD/PartD`, option);
      !isReview &&
        navigate(`/contribution-to-university-school/?f_id=${formId}`);
    } catch (error) {
      setDisabled(false);
      console.error(error);
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
    } finally {
      setDisabled(false);
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
              {isReview && (
                <TableHead>
                  Reviewer Remark <br /> (Max. 5)
                </TableHead>
              )}
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
                {isReview && (
                  <TableData>
                    <EditableValue
                      value={certificate.reviewerScore || ""}
                      onValueChange={(newValue) =>
                        handleEditCertificate(certificateIndex, {
                          ...certificate,
                          reviewerScore: newValue,
                        })
                      }
                      validate={(input) => /^[0-5]+$/.test(input)}
                      type="text"
                      disabled={false}
                    />
                  </TableData>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isSummaryPath && (
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
        )}
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
        {!isSummaryPath && (
          <>
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
          </>
        )}

        <UnorderedList className="mt-3">
          {files.map((file, index) => (
            <ListItems key={index}>
              <SpanEle onClick={() => handleOpenInNewTab(file)}>
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
        {!isSummaryPath && (
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
        )}
        {isReview && (
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
              "Save"
            )}
          </SaveNextButton>
        )}
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
            {!isSummaryPath && (
              <p style={{ marginRight: "10px", marginTop: "10px" }}>
                Navigate to
              </p>
            )}
            {!isSummaryPath && (
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
                <option selected>R&D Part D</option>
                <option>Contribution To University School</option>
                <option>Contribution To Department</option>
                <option>Contribution To Society</option>
              </select>
            )}
          </div>
        </div>
        {renderRDPartDPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default RDPartD;
