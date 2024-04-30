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

const RDPartC = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [year, setYear] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [tableData, setTableData] = useState([
    {
      titleOfTheFundingProject: "",
      fundingAgencyDetails: "",
      grant: "",
      status: "",
      apiScore: "",
    },
    {
      titleOfTheFundingProject: "",
      fundingAgencyDetails: "",
      grant: "",
      status: "",
      apiScore: "",
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchYear() {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        setDisabled(true);
        const userId = Cookies.get("user_id");
        const api = "http://localhost:5000";
        const response = await fetch(`${api}/year/${userId}`);
        if (response.ok === true) {
          const data = await response.json();
          setYear(data.academic_year);
          const response2 = await fetch(`${api}/RD/PartC/${userId}`);
          const data2 = await response2.json();
          if (data2.projects_data) {
            setTableData(data2.projects_data);
          }
          setDisabled(false);
          setApiStatus(apiStatusConstants.success);
        } else {
          setDisabled(false);
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchYear();
  }, []);

  const calculateApiScore = (value) => {
    console.log(value);
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
    };
    setTableData([...tableData, newArticle]);
  };

  const handleDeleteSanctionProject = () => {
    const articleIndex = tableData.length - 1;
    const newTableData = tableData.filter((_, index) => index !== articleIndex);
    setTableData(newTableData);
  };

  const submitRDPartC = async () => {
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
        const response = await fetch(`${api}/RD/PartC`, option);
        if (response.ok === true) {
          setDisabled(false);
          navigate("/research-and-development/partD");
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <SaveNextButton
            onClick={handleAddSanctionProject}
            className="btn btn-primary mt-3 mr-3"
          >
            Add Project
          </SaveNextButton>
          {tableData.length > 1 && (
            <SaveNextButton
              onClick={() => handleDeleteSanctionProject(tableData.length - 1)}
              className="btn btn-danger mt-3"
            >
              Delete Last Project
            </SaveNextButton>
          )}
        </TableContainer>
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            className="btn btn-primary"
            type="submit"
            onClick={submitRDPartC}
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

  return (
    <HomeMainContainer>
      <Header />
      <MainContainer className="mt-5">
        <Back />
        {renderRDPartCPage()}
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

export default RDPartC;
