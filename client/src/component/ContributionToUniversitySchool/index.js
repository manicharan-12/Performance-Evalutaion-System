import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Back from "../Back";
import Header from "../Header";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import failure from "../Images/failure view.png";
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
  FileContainer,
  StyledDropzone,
  UnorderedList,
  ListItems,
  SpanEle,
  DeleteButton,
  InputFile,
} from "./StyledComponents";
import EditableValue from "../EditableValue";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const ContributionToUniversity = (props) => {
  const location = useLocation();
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [tableData, setTableData] = useState([
    {
      nameOfTheResponsibility: "",
      contribution: "",
      apiScore: "",
      reviewerScore: "",
    },
  ]);
  const [formId, setFormId] = useState("");
  const [userId, setUserId] = useState("");
  const [disabled, setDisabled] = useState(false);
  const isSummaryPath =
    location.pathname.startsWith("/summary") ||
    location.pathname.startsWith("/review");
  const isReview = location.pathname.startsWith("/review");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { updateReviewerApiScores } = props;

  useEffect(() => {
    // Updated getFormIdFromSearchParams to return both formId and userId
    const getFormIdFromSearchParams = () => {
      try {
        const formId = searchParams.get("f_id");
        const userId = searchParams.get("fac_id"); // Fetch userId as well
        return [formId, userId];
      } catch (error) {
        console.error("Error fetching form ID from search params:", error);
        navigate("/home");
      }
    };

    const fetchContributionToUniversitySchool = async (id, uid) => {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        const api = "http://localhost:6969";

        // Use formId and userId in the API request
        const response = await fetch(
          `${api}/ContributionToUniversitySchool/${uid}/?formId=${id}`
        );
        const data = await response.json();

        if (data.contributionToUniversitySchool.contribution_data) {
          const transformedData =
            data.contributionToUniversitySchool.contribution_data.map(
              (item) => ({
                nameOfTheResponsibility: item.nameOfTheResponsibility,
                contribution: item.contribution,
                apiScore: item.apiScore,
                hodRemark: item.hodRemark,
              })
            );
          setTableData(transformedData);
          setFiles(data.contributionToUniversitySchool.files || []);
        }

        setDisabled(false);
        setApiStatus(apiStatusConstants.success);
      } catch (error) {
        console.error("Error fetching contribution data:", error);
        setDisabled(false);
        setApiStatus(apiStatusConstants.failure);
      }
    };

    // Get formId and userId from search params
    const [fId, uId] = getFormIdFromSearchParams();
    if (fId && uId) {
      setFormId(fId);
      setUserId(uId);

      if (!isReview) {
        fetchContributionToUniversitySchool(fId, uId); // Pass formId and userId to fetch function
      } else {
        setApiStatus(apiStatusConstants.inProgress);
        const { contribution_data, files } = props.data;
        setTableData(contribution_data);
        setFiles(files);
        setApiStatus(apiStatusConstants.success);
      }
    }
  }, [isReview, searchParams, props.data]);

  const handleEditContribution = (contributionIndex, updatedContribution) => {
    const updatedState = tableData.map((eachContribution, cIndex) => {
      if (cIndex === contributionIndex) {
        const { nameOfTheResponsibility, contribution } = updatedContribution;
        const allFieldsFilled =
          nameOfTheResponsibility.trim() !== "" && contribution.trim() !== "";
        return {
          ...updatedContribution,
          apiScore: allFieldsFilled ? 2.5 : eachContribution.apiScore,
        };
      }
      return eachContribution;
    });
    setTableData(updatedState);
  };

  const handleAddContribution = () => {
    setTableData((prevData) => [
      ...prevData,
      {
        nameOfTheResponsibility: "",
        contribution: "",
        apiScore: "",
        hodRemark: "",
      },
    ]);
  };

  const handleDeleteContribution = () => {
    setTableData((prevData) => prevData.slice(0, -1));
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

  const handleReviewerScoreChange = (newValue) => {
    {
      isReview &&
        updateReviewerApiScores({
          contributionToSchool: parseInt(newValue, 10) || 0,
        });
    }
  };

  const submitContributionToUniversity = async () => {
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
      (contribution) =>
        contribution.nameOfTheResponsibility.trim() !== "" &&
        contribution.contribution.trim() !== ""
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
      const option = {
        method: "POST",
        body: formData,
      };
      const response = await fetch(
        `${api}/ContributionToUniversitySchool`,
        option
      );
      handleReviewerScoreChange(totalReviewerScore);
      !isReview &&
        navigate(
          `/contribution-to-department/?fac_id=${userId}&f_id=${formId}`
        );
    } catch (error) {
      console.error(error);
      setDisabled(false);
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
      <HeadingContainer>
        <SectionHeading>Contribution to the School / University</SectionHeading>
        <MarksHeading>(Max. Score: 5)</MarksHeading>
      </HeadingContainer>
      <ParagraphContainer className="mt-3">
        <Paragraph>
          This section summarizes all the responsibilities assigned by the
          authorities of the university to the candidate during the academic
          year under consideration through a proper office order. This may
          include responsibilities like Head of Department, Training and
          Placement Officer, Coordinator, Committee member, Examination Officer,
          Warden, etc. The candidate will earn up to a maximum of five points
          for such additional responsibility. In case of major activities/events
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
              {isReview && (
                <TableHead>
                  Reviewer Remark <br /> (Max. 5)
                </TableHead>
              )}
            </TableRow>
          </TableMainHead>
          <TableBody>
            {tableData.map((contribution, index) => (
              <TableRow key={index}>
                <TableData>
                  <EditableValue
                    value={contribution.nameOfTheResponsibility}
                    onValueChange={(newValue) =>
                      handleEditContribution(index, {
                        ...contribution,
                        nameOfTheResponsibility: newValue,
                      })
                    }
                    validate={(input) => /^[A-Za-z\s\S]+$/.test(input)}
                    type="text"
                    disabled={false}
                  />
                </TableData>
                <TableData>
                  <EditableValue
                    value={contribution.contribution}
                    onValueChange={(newValue) =>
                      handleEditContribution(index, {
                        ...contribution,
                        contribution: newValue,
                      })
                    }
                    validate={(input) => /^[A-Za-z\s\S]+$/.test(input)}
                    type="text"
                    disabled={false}
                  />
                </TableData>
                <TableData>{contribution.apiScore}</TableData>
                {isReview && (
                  <TableData>
                    <EditableValue
                      value={contribution.reviewerScore || ""}
                      onValueChange={(newValue) =>
                        handleEditContribution(index, {
                          ...contribution,
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
            onClick={handleAddContribution}
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
            Add Contribution
          </SaveNextButton>
        )}
        {tableData.length > 1 && !isSummaryPath && (
          <SaveNextButton
            onClick={handleDeleteContribution}
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
            Delete Contribution
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
            onClick={submitContributionToUniversity}
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
            onClick={submitContributionToUniversity}
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

  const renderContributionToUniversityPage = () => {
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
                <option>R&D Part A</option>
                <option>R&D Part B</option>
                <option>R&D Part C</option>
                <option>R&D Part D</option>
                <option selected>Contribution To University School</option>
                <option>Contribution To Department</option>
                <option>Contribution To Society</option>
              </select>
            )}
          </div>
        </div>
        {renderContributionToUniversityPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default ContributionToUniversity;
