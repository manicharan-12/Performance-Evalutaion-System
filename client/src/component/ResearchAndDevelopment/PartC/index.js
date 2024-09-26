import Back from "../../Back";
import React, { useEffect, useState, useCallback } from "react";
import Header from "../../Header";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import failure from "../../Images/failure view.png";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
import EditableValue from "../../EditableValue";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const RDPartC = (props) => {
  const location = useLocation();
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [year, setYear] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [tableData, setTableData] = useState([
    {
      titleOfTheFundingProject: "",
      fundingAgencyDetails: "",
      grant: "",
      status: "",
      apiScore: "",
      reviewerScore: "",
    },
  ]);
  const [formId, setFormId] = useState("");
  const [userId, setUserId] = useState("");

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

  //   const fetchYear = async (id) => {
  //     try {
  //       setApiStatus(apiStatusConstants.inProgress);
  //       setDisabled(true);
  //       const userId = Cookies.get("user_id");
  //       const api = "http://localhost:6969";

  //       const response = await fetch(`${api}/year/${userId}/?formId=${id}`);
  //       if (response.ok) {
  //         const data = await response.json();
  //         setYear(data.academic_year);

  //         const response2 = await fetch(
  //           `${api}/RD/PartC/${userId}/?formId=${id}`
  //         );
  //         const data2 = await response2.json();

  //         if (data2.phdPartC.projects_data) {
  //           const transformedData = data2.phdPartC.projects_data.map(
  //             (item) => ({
  //               titleOfTheFundingProject: item.titleOfTheFundingProject,
  //               fundingAgencyDetails: item.fundingAgencyDetails,
  //               grant: item.grant,
  //               status: item.status,
  //               apiScore: item.apiScore,
  //               hodRemark: item.hodRemark,
  //             })
  //           );
  //           setTableData(transformedData);
  //           setFiles(data2.phdPartC.files || []);
  //         }

  //         setDisabled(false);
  //         setApiStatus(apiStatusConstants.success);
  //       } else {
  //         setDisabled(false);
  //         setApiStatus(apiStatusConstants.failure);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setDisabled(false);
  //       setApiStatus(apiStatusConstants.failure);
  //     }
  //   };

  //   const formId = getFormIdFromSearchParams();
  //   if (formId) {
  //     setFormId(formId);
  //     if (!isReview) {
  //       fetchYear(formId);
  //     } else {
  //       setApiStatus(apiStatusConstants.inProgress);
  //       const { projects_data, files } = props.data;
  //       setTableData(projects_data);
  //       setFiles(files);
  //       setApiStatus(apiStatusConstants.success);
  //     }
  //   }
  // }, [isReview, searchParams, props.data]);

  useEffect(() => {
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

    const fetchYear = async (id) => {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        setDisabled(true);
        const userIdFromCookie = Cookies.get("user_id");
        const api = "http://localhost:6969";

        const response = await fetch(`${api}/year/${userIdFromCookie}/?formId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setYear(data.academic_year);

          const response2 = await fetch(`${api}/RD/PartC/${userIdFromCookie}/?formId=${id}`);
          const data2 = await response2.json();

          if (data2.phdPartC.projects_data) {
            const transformedData = data2.phdPartC.projects_data.map(
              (item) => ({
                titleOfTheFundingProject: item.titleOfTheFundingProject,
                fundingAgencyDetails: item.fundingAgencyDetails,
                grant: item.grant,
                status: item.status,
                apiScore: item.apiScore,
                hodRemark: item.hodRemark,
              })
            );
            setTableData(transformedData);
            setFiles(data2.phdPartC.files || []);
          }

          setDisabled(false);
          setApiStatus(apiStatusConstants.success);
        } else {
          setDisabled(false);
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setDisabled(false);
        setApiStatus(apiStatusConstants.failure);
      }
    };

    // Retrieve formId and userId from searchParams and set state
    const [fId, uId] = getFormIdFromSearchParams();
    if (fId) {
      setFormId(fId);
      setUserId(uId);
      if (!isReview) {
        fetchYear(fId);
      } else {
        setApiStatus(apiStatusConstants.inProgress);
        const { projects_data, files } = props.data;
        setTableData(projects_data);
        setFiles(files);
        setApiStatus(apiStatusConstants.success);
      }
    }
  }, [isReview, searchParams, props.data]);

  const calculateApiScore = (value) => {
    if (value === "sanctioned") {
      return 5;
    } else {
      return 1;
    }
  };

  const handleEditSanctionProject = (projectIndex, updatedProject) => {
    const updatedState = tableData.map((eachArticle, aIndex) => {
      if (aIndex === projectIndex) {
        return updatedProject;
      }
      return eachArticle;
    });
    setTableData(updatedState);
  };

  const handleSelectOption = (event, updatedProject, projectIndex) => {
    const updatedTableData = [...tableData];
    updatedTableData[projectIndex].status = event.target.value;
    updatedProject.apiScore = calculateApiScore(updatedProject.status);
    setTableData(updatedTableData);
  };

  const handleAddSanctionProject = () => {
    const newArticle = {
      titleOfTheFundingProject: "",
      fundingAgencyDetails: "",
      grant: "",
      status: "",
      apiScore: "",
      hodRemark: "",
    };
    setTableData([...tableData, newArticle]);
  };

  const handleDeleteSanctionProject = () => {
    const articleIndex = tableData.length - 1;
    const newTableData = tableData.filter((_, index) => index !== articleIndex);
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
    if (file.fileId) {
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

  const submitRDPartC = async () => {
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
      const isEmpty = tableData.some((row) =>
        Object.values(row).some((value) => value !== "")
      );
      if (isEmpty) {
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
        const response = await fetch(`${api}/RD/PartC`, option);
        if (response.ok === true) {
          setDisabled(false);
          !isReview &&
            navigate(`/research-and-development/partD/?f_id=${formId}`);
        } else {
          setDisabled(false);
          toast.error(`Failed to save data! Please try again Later`, {
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
      } else {
        setDisabled(false);
        toast.error(`Please fill all the fields before submitting`, {
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
      setDisabled(false);
      console.error(error);
      toast.error(`Internal Server Error! Please try again Later`, {
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
            c. Sanction of funded projects and projects applied in {year}:
          </SubSectionHeading>
        </SubSectionHeadingContainer>
        <ParagraphContainer className="mt-3">
          <Paragraph>
            The candidate will earn up to a maximum of five points in this
            section. Each sanctioned project carries five points and project
            applied carry one point. Furnish the documentary evidence of your
            claims.
          </Paragraph>
        </ParagraphContainer>
        <TableContainer className="mt-3">
          <Table>
            <TableMainHead>
              <TableRow>
                <TableHead>
                  Title of the funding proposal, give details
                </TableHead>
                <TableHead>Details of Funding agency</TableHead>
                <TableHead>Grant (in Rs.)</TableHead>
                <TableHead>Status (Sanctioned/ Submitted)</TableHead>
                <TableHead>Score (Max. 5)</TableHead>
                {isReview && (
                  <TableHead>
                    Reviewer Remark <br /> (Max. 5)
                  </TableHead>
                )}
              </TableRow>
            </TableMainHead>
            <TableBody>
              {tableData.map((project, projectIndex) => {
                return (
                  <TableRow key={projectIndex}>
                    <TableData>
                      <EditableValue
                        value={project.titleOfTheFundingProject || ""}
                        onValueChange={(newValue) =>
                          handleEditSanctionProject(projectIndex, {
                            ...project,
                            titleOfTheFundingProject: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={project.fundingAgencyDetails || ""}
                        onValueChange={(newValue) =>
                          handleEditSanctionProject(projectIndex, {
                            ...project,
                            fundingAgencyDetails: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={project.grant || ""}
                        onValueChange={(newValue) =>
                          handleEditSanctionProject(projectIndex, {
                            ...project,
                            grant: newValue,
                          })
                        }
                        validate={(input) => /^[0-9]*(\.[0-9]+)?$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <SelectEle
                        defaultValue={project.status || ""}
                        onChange={(event) =>
                          handleSelectOption(event, project, projectIndex)
                        }
                        validate={(input) => true}
                        className="form-control w-100 text-center"
                      >
                        <OptionEle value="">Select an Option</OptionEle>
                        <OptionEle value="sanctioned">Sanctioned</OptionEle>
                        <OptionEle value="submitted">Submitted</OptionEle>
                      </SelectEle>
                    </TableData>

                    <TableData>{project.apiScore}</TableData>

                    {isReview && (
                      <TableData>
                        <EditableValue
                          value={project.reviewerScore || ""}
                          onValueChange={(newValue) =>
                            handleEditSanctionProject(projectIndex, {
                              ...project,
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
              onClick={handleAddSanctionProject}
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
              Add Project
            </SaveNextButton>
          )}
          {tableData.length > 1 && !isSummaryPath && (
            <SaveNextButton
              onClick={() => handleDeleteSanctionProject(tableData.length - 1)}
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
              Delete Project
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
              onClick={submitRDPartC}
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
              onClick={submitRDPartC}
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
  const renderRDPartCPage = () => {
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
                <option selected>R&D Part C</option>
                <option>R&D Part D</option>
                <option>Contribution To University School</option>
                <option>Contribution To Department</option>
                <option>Contribution To Society</option>
              </select>
            )}
          </div>
        </div>
        {renderRDPartCPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default RDPartC;
