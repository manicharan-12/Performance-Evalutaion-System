import Back from "../Back";
import React, { useEffect, useState, useCallback } from "react";
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

const ContributionToSociety = (props) => {
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

  // useEffect(() => {
  //   const getFormIdFromSearchParams = () => {
  //     try {
  //       const formId = searchParams.get("f_id");
  //       return formId;
  //     } catch (error) {
  //       console.error("Error fetching form ID from search params:", error);
  //       navigate("/home");
  //     }
  //   };

  //   const fetchContributionToSociety = async (id) => {
  //     try {
  //       setApiStatus(apiStatusConstants.inProgress);
  //       const userId = Cookies.get("user_id");
  //       const api = "http://localhost:6969";

  //       const response = await fetch(
  //         `${api}/ContributionToSociety/${userId}/?formId=${id}`
  //       );
  //       const data = await response.json();

  //       if (data.contributionToSociety.contribution_data) {
  //         const transformedData =
  //           data.contributionToSociety.contribution_data.map((item) => ({
  //             nameOfTheResponsibility: item.nameOfTheResponsibility,
  //             contribution: item.contribution,
  //             apiScore: item.apiScore,
  //             hodRemark: item.hodRemark,
  //           }));
  //         setTableData(transformedData);
  //         setFiles(data.contributionToSociety.files || []);
  //       }

  //       setDisabled(false);
  //       setApiStatus(apiStatusConstants.success);
  //     } catch (error) {
  //       console.error("Error fetching contribution data:", error);
  //       setDisabled(false);
  //       setApiStatus(apiStatusConstants.failure);
  //     }
  //   };

  //   const formId = getFormIdFromSearchParams();
  //   if (formId) {
  //     setFormId(formId);

  //     if (!isReview) {
  //       fetchContributionToSociety(formId);
  //     } else {
  //       setApiStatus(apiStatusConstants.inProgress);
  //       const { contribution_data, files } = props.data;
  //       setTableData(contribution_data);
  //       setFiles(files);
  //       setApiStatus(apiStatusConstants.success);
  //     }
  //   }
  // }, [isReview, searchParams, props.data]);


  useEffect(() => {
    // Updated getFormIdFromSearchParams to return formId and userId
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

    const fetchContributionToSociety = async (id, uid) => {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        const api = "http://localhost:6969";

        // Use formId and userId in the API request
        const response = await fetch(`${api}/ContributionToSociety/${uid}/?formId=${id}`);
        const data = await response.json();

        if (data.contributionToSociety.contribution_data) {
          const transformedData = data.contributionToSociety.contribution_data.map((item) => ({
            nameOfTheResponsibility: item.nameOfTheResponsibility,
            contribution: item.contribution,
            apiScore: item.apiScore,
            hodRemark: item.hodRemark,
          }));
          setTableData(transformedData);
          setFiles(data.contributionToSociety.files || []);
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
        fetchContributionToSociety(fId, uId); // Pass formId and userId to fetch function
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
          apiScore: allFieldsFilled ? 2 : eachContribution.apiScore,
        };
      }
      return eachContribution;
    });
    setTableData(updatedState);
  };

  const handleAddContribution = () => {
    const newContribution = {
      nameOfTheResponsibility: "",
      contribution: "",
      apiScore: "",
      hodRemark: "",
    };
    setTableData([...tableData, newContribution]);
  };

  const handleDeleteContribution = () => {
    const articleIndex = tableData.length - 1;
    const newTableData = tableData.filter((_, index) => index !== articleIndex);
    setTableData(newTableData);
  };

  const calculateTotalApiScore = (data) => {
    const score = data.reduce(
      (total, item) => total + (parseFloat(item.apiScore) || 0),
      0
    );
    return score >= 5 ? 5 : score;
  };

  const submitContributionToSociety = async () => {
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
      formData.append("userId", userId);
      formData.append("formId", formId);
      formData.append("totalApiScore", totalApiScore);
      formData.append("tableData", JSON.stringify(tableData));
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
      const response = await fetch(`${api}/ContributionToSociety`, option);

      !isReview && navigate(`/summary/?fac_id=${userId}&f_id=${formId}`);
    } catch (error) {
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
                <TableHead>
                  Reviewer Remark <br /> (Max. 5)
                </TableHead>
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
                    {isReview && (
                      <TableData>
                        <EditableValue
                          value={contribution.reviewerScore || ""}
                          onValueChange={(newValue) =>
                            handleEditContribution(contributionIndex, {
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
                );
              })}
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
              Add Certificate
            </SaveNextButton>
          )}
          {tableData.length > 1 && (
            <SaveNextButton
              onClick={() => handleDeleteContribution(tableData.length - 1)}
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
              onClick={submitContributionToSociety}
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
              onClick={submitContributionToSociety}
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
                <option>Contribution To University School</option>
                <option>Contribution To Department</option>
                <option selected>Contribution To Society</option>
              </select>
            )}
          </div>
        </div>
        {renderContributionToSocietyPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default ContributionToSociety;
