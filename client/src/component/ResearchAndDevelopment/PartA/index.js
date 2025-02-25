import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import { TiDelete } from "react-icons/ti";
import { toast } from "react-toastify";
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

const RDPartA = (props) => {
  const location = useLocation();
  const [userId, setUserId] = useState();
  const [disabled, setDisabled] = useState(false);
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
      apiScore: 0,
      reviewerScore: 0,
    },
  ]);
  const [formId, setFormId] = useState("");
  const [reviewerScore, setReviewerScore] = useState(0);
  const isSummaryPath =
    location.pathname.startsWith("/summary") ||
    location.pathname.startsWith("/review");
  const isReview = location.pathname.startsWith("/review");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { reviewerApiScores, updateReviewerApiScores } = props;

  const getFormIdFromSearchParams = () => {
    try {
      const formId = searchParams.get("f_id");
      const userId = searchParams.get("fac_id");
      return [formId, userId];
    } catch (error) {
      console.error("Error fetching form ID from search params:", error);
      navigate("/home");
    }
  };

  useEffect(() => {
    const fetchYear = async () => {
      try {
        const [formId, userId] = getFormIdFromSearchParams();

        if (formId) {
          setFormId(formId);
          setUserId(userId);
        }

        setApiStatus(apiStatusConstants.inProgress);

        if (!isReview) {
          const response = await fetch(
            `http://localhost:6969/RD/PartA/${userId}/?formId=${formId}`
          );

          if (response.ok) {
            const data = await response.json();
            console.log(data.phdPartA.presentation_data);

            if (data.phdPartA.presentation_data) {
              const presentation_data = data.phdPartA.presentation_data.map(
                (item) => ({
                  articleTitle: item.articleTitle,
                  journalName: item.journalName,
                  dateOfPublication: item.dateOfPublication,
                  indexedIn: item.indexedIn,
                  oneOrCorrespondingAuthor: item.oneOrCorrespondingAuthor,
                  apiScore: item.apiScore,
                  hodRemark: item.hodRemark,
                })
              );
              setTableData(presentation_data);
              setFiles(data.phdPartA.files || []);
              setYear(data.academic_year);
              setApiStatus(apiStatusConstants.success);
            } else {
              setApiStatus(apiStatusConstants.failure);
            }
          } else {
            setApiStatus(apiStatusConstants.failure);
          }
        } else {
          setApiStatus(apiStatusConstants.inProgress);
          const { presentation_data, files } = props.data || {};
          setTableData(presentation_data || []);
          setFiles(files || []);
          setYear(props.data.academic_year);
          setApiStatus(apiStatusConstants.success);
        }
      } catch (error) {
        console.error(error);
        setApiStatus(apiStatusConstants.failure);
      }
    };

    fetchYear();
  }, [isReview, searchParams, props.data]);

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
    setDeletedFiles((prevDeletedFiles) => prevDeletedFiles.concat(fileId));
  };

  const handleEditArticle = (articleIndex, updatedArticle) => {
    setTableData((prevData) =>
      prevData.map((article, index) =>
        index === articleIndex ? updatedArticle : article
      )
    );
  };

  const calculateApiScore = (indexedIn) => {
    switch (indexedIn) {
      case "wos":
        return 5;
      case "scopus":
        return 3;
      case "ugc":
        return 2;
      default:
        return 0;
    }
  };

  const handleSelectOption = (event, articleIndex) => {
    const { value } = event.target;
    const apiScore = calculateApiScore(value);
    setTableData((prevData) =>
      prevData.map((article, index) =>
        index === articleIndex
          ? { ...article, indexedIn: value, apiScore: apiScore.toString() }
          : article
      )
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

  const handleReviewerScoreChange = (newValue) => {
    setReviewerScore(newValue);
    {
      isReview &&
        updateReviewerApiScores({
          researchAndDevelopmentPartA: parseInt(newValue, 10) || 0,
        });
    }
  };

  const calculateTotalApiScore = (data) => {
    const score = data.reduce(
      (total, item) => total + (parseFloat(item.apiScore) || 0),
      0
    );
    return score >= 5 ? 5 : score;
  };

  const calculateReviewerScore = (data) => {
    const score = data.reduce(
      (total, item) => total + (parseFloat(item.reviewerScore) || 0),
      0
    );
    return score >= 5 ? 5 : score;
  };

  const submitRDPartA = async () => {
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

    try {
      setDisabled(true);
      const formData = new FormData();
      const totalApiScore = calculateTotalApiScore(tableData);
      const totalReviewerScore = calculateReviewerScore(tableData);
      formData.append("userId", userId);
      formData.append("formId", formId);
      formData.append("tableData", JSON.stringify(tableData));
      formData.append("totalApiScore", totalApiScore);
      formData.append("reviewerScore", totalReviewerScore);
      files.forEach((file) => {
        if (!file.fileId) {
          formData.append("files", file);
        }
      });
      deletedFiles.forEach((fileId) => {
        formData.append("deletedFiles", fileId);
      });
      const api = "http://localhost:6969";
      const response = await fetch(`${api}/RD/PartA`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setDisabled(false);
        handleReviewerScoreChange(totalReviewerScore);
        !isReview &&
          navigate(
            `/research-and-development/partB/?fac_id=${userId}&f_id=${formId}`
          );
      } else {
        setDisabled(false);
        toast.error("Error while saving the data! Please try again Later", {
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
    } catch (error) {
      console.error("Error submitting RD Part A:", error);
      toast.error("An error occurred during submission. Please try again.", {
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
              {isReview && (
                <TableHead>
                  Reviewer Remark <br /> (Max. 5)
                </TableHead>
              )}
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
                    validate={(input) => /^[A-Za-z0-9\s]+$/.test(input)}
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
                {isReview && (
                  <TableData>
                    <EditableValue
                      value={article.reviewerScore || ""}
                      onValueChange={(newValue) =>
                        handleEditArticle(index, {
                          ...article,
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
            onClick={handleAddArticle}
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
            Add Article
          </SaveNextButton>
        )}
        {tableData.length > 1 && (
          <SaveNextButton
            onClick={handleDeleteArticle}
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
            Delete Article
          </SaveNextButton>
        )}
      </TableContainer>
      {!isSummaryPath && (
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
                <SpanEle onClick={() => handleOpenInNewTab(file)}>
                  {file.filename || file.name}
                  {console.log(files)}
                </SpanEle>
                <DeleteButton onClick={() => handleDeleteFile(file.fileId)}>
                  <TiDelete />
                </DeleteButton>
              </ListItems>
            ))}
          </UnorderedList>
        </FileContainer>
      )}
      {!isSummaryPath && (
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            onClick={submitRDPartA}
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
      )}
      {isReview && (
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            onClick={submitRDPartA}
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
        </SaveNextButtonContainer>
      )}
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

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;

    switch (selectedOption) {
      case "AcademicWork I":
        navigate(`/academicWork/part-a/?fac_id=${userId}&f_id=${formId}`);
        break;
      case "AcademicWork II":
        navigate(`/academicWork/part-b/?fac_id=${userId}&f_id=${formId}`);
        break;
      case "R&D Conformation":
        navigate(
          `/research-and-development/conformation/?fac_id=${userId}&f_id=${formId}`
        );
        break;
      case "R&D Part A":
        navigate(
          `/research-and-development/partA/?fac_id=${userId}&f_id=${formId}`
        );
        break;
      case "R&D Part B":
        navigate(
          `/research-and-development/partB/?fac_id=${userId}&f_id=${formId}`
        );
        break;
      case "R&D Part C":
        navigate(
          `/research-and-development/partC/?fac_id=${userId}&f_id=${formId}`
        );
        break;
      case "R&D Part D":
        navigate(
          `/research-and-development/partD/?fac_id=${userId}&f_id=${formId}`
        );
        break;
      case "Contribution To University School":
        navigate(
          `/contribution-to-university-school/?fac_id=${userId}&f_id=${formId}`
        );
        break;
      case "Contribution To Department":
        navigate(
          `/contribution-to-department/?fac_id=${userId}&f_id=${formId}`
        );
        break;
      case "Contribution To Society":
        navigate(`/contribution-to-society/?fac_id=${userId}&f_id=${formId}`);
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
          {!isSummaryPath && <Back />}
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
                <option selected>R&D Part A</option>
                <option>R&D Part B</option>
                <option>R&D Part C</option>
                <option>R&D Part D</option>
                <option>Contribution To University School</option>
                <option>Contribution To Department</option>
                <option>Contribution To Society</option>
              </select>
            )}
          </div>
        </div>
        {renderRDPartAPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default RDPartA;
