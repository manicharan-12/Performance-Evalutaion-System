import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
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

const RDPartB = (props) => {
  const location = useLocation();
  const [userId, setUserId] = useState("");
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
      reviewerScore: "",
    },
  ]);
  const [formId, setFormId] = useState("");
  const isSummaryPath =
    location.pathname.startsWith("/summary") ||
    location.pathname.startsWith("/review");
  const isReview = location.pathname.startsWith("/review");
  const [totalApiScore, setTotalApiScore] = useState(0);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

    const fetchYear = async (userId, id) => {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        const api = "http://localhost:6969";

        const response = await fetch(`${api}/year/${userId}/?formId=${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("asdfgh", data.academic_year);
          setYear(data.academic_year);

          const response2 = await fetch(
            `${api}/RD/PartB/${userId}/?formId=${id}`
          );
          const data2 = await response2.json();

          if (data2.phdPartB.presentation_data) {
            const presentation_data = data2.phdPartB.presentation_data.map(
              (item) => ({
                titleOfThePaper: item.titleOfThePaper,
                titleOfTheme: item.titleOfTheme,
                organizedBy: item.organizedBy,
                indexedIn: item.indexedIn,
                noOfDays: item.noOfDays,
                apiScore: item.apiScore,
                hodRemark: item.hodRemark,
              })
            );
            setTableData(presentation_data);
            setFiles(data2.phdPartB.files || []);
          }

          setApiStatus(apiStatusConstants.success);
        } else {
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.error("Error fetching year data:", error);
        setApiStatus(apiStatusConstants.failure);
        setDisabled(false);
      }
    };

    const [fId, uId] = getFormIdFromSearchParams();
    if (fId) {
      setFormId(fId);
      setUserId(uId);
      if (!isReview) {
        fetchYear(uId, fId);
      } else {
        setApiStatus(apiStatusConstants.inProgress);
        const { projects_data, files } = props.data;
        setTableData(projects_data);
        setFiles(files);
        setApiStatus(apiStatusConstants.success);
      }
    }
  }, [isReview, searchParams, props.data]);

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
    // if (!navigator.onLine) {
    //   await toast.error(
    //     "You are offline. Please connect to the internet and try again.",
    //     {
    //       position: "bottom-center",
    //       autoClose: 6969,
    //       hideProgressBar: true,
    //       closeOnClick: true,
    //       pauseOnHover: false,
    //       draggable: true,
    //     }
    //   );
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

  const handleEditPresentation = (articleIndex, updatedArticle) => {
    updatedArticle.apiScore = calculateApiScore(
      updatedArticle.indexedIn,
      updatedArticle.noOfDays
    );
    const updatedState = tableData.map((eachArticle, aIndex) =>
      aIndex === articleIndex ? updatedArticle : eachArticle
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
        Object.values(row).some((value) => value === "")
      );
      if (!isEmpty) {
        setDisabled(true);
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("formId", formId);
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
        const response = await fetch(`${api}/RD/PartB`, {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          setDisabled(false);
          !isReview &&
            navigate(`/research-and-development/partC/?f_id=${formId}&fac_id=${userId}`);
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
      } else {
        setDisabled(false);
        toast.error("Please fill all the fields before submitting", {
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
          WoS or Scopus carries 2.5 points; FDP &#8805; 5 Days carries 2.5
          points. Furnish the documentary evidence of your claims.
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
        {!isSummaryPath && (
          <SaveNextButton
            onClick={handleAddPresentation}
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
            Add Presentation
          </SaveNextButton>
        )}
        {tableData.length > 1 && !isSummaryPath && (
          <SaveNextButton
            onClick={handleDeletePresentation}
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
            Delete Presentation
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
            className="btn btn-primary"
            type="submit"
            onClick={submitRDPartB}
            disabled={disabled}
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
                <option selected>R&D Part B</option>
                <option>R&D Part C</option>
                <option>R&D Part D</option>
                <option>Contribution To University School</option>
                <option>Contribution To Department</option>
                <option>Contribution To Society</option>
              </select>
            )}
          </div>
        </div>
        {renderRDPartBPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default RDPartB;
