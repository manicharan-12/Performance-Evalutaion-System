import { useEffect, useState, useCallback } from "react";
import Back from "../../Back";
import Header from "../../Header";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import failure from "../../Images/failure view.png";
import { useDropzone } from "react-dropzone";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { TiDelete } from "react-icons/ti";
import EditableValue from "../../EditableValue";
import {
  HomeMainContainer,
  MainContainer,
  HeadingContainer,
  SectionHeading,
  MarksHeading,
  ParagraphContainer,
  Paragraph,
  LoaderContainer,
  FailureContainer,
  FailureImage,
  SubSectionHeading,
  SelectForm,
  OptionSelectForm,
  SaveNextButtonContainer,
  SaveNextButton,
  ErrorMessage,
  TableContainer,
  Table,
  TableMainHead,
  TableRow,
  TableHead,
  TableBody,
  TableData,
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

const Conformation = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [year, setYear] = useState("");
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [errorMsg1, setErrorMessage1] = useState("");
  const [errorMsg2, setErrorMessage2] = useState("");
  const [errorMsg3, setErrorMessage3] = useState("");
  const [onClick1, setOnClick1] = useState(false);
  const [onClick2, setOnClick2] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [tableData, setTableData] = useState({
    nameOfTheUniversity: {
      registered: "",
      received: "",
    },
    dateOfRegistration: {
      registered: "",
      received: "",
    },
    supervisorAndCoSupervisorName: {
      registered: "",
      received: "",
    },
    prePhDCompletionDate: {
      registered: "",
      received: "",
    },
    noOfResearchReviewsCompleted: {
      registered: "",
      received: "",
    },
    dateOfCompletionOfPhD: {
      registered: "",
      received: "",
    },
  });
  const [formId, setFormId] = useState("");
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

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
        setDisabled(true);
        const userId = Cookies.get("user_id");
        const api = "http://localhost:5000";
        const response = await fetch(`${api}/year/${userId}/?formId=${id}`);
        if (response.ok === true) {
          const data = await response.json();
          setYear(data.academic_year);
          const response2 = await fetch(
            `${api}/rdConfo/${userId}/?formId=${id}`,
          );
          if (response2.ok === true) {
            const data2 = await response2.json();
            if (data2 === null) {
              setApiStatus(apiStatusConstants.success);
            } else {
              setValue1(data2.phdConformation.possesPhD || "");
              setValue2(data2.phdConformation.registerPhD || "");
              setValue3(data2.phdConformation.receivedPhd || "");
              if (data2.phdConformation.possesPhD === "yes") {
                setOnClick1(true);
              }
              if (
                data2.phdConformation.registerPhD &&
                data2.phdConformation.receivedPhd
              ) {
                setOnClick2(true);
                if (data2.phdConformation.phDDetails !== null) {
                  const phDDetails = data2.phdConformation.phDDetails;
                  const transformedData = {
                    nameOfTheUniversity: {
                      registered:
                        phDDetails.nameOfTheUniversity.registered || "",
                      received: phDDetails.nameOfTheUniversity.received || "",
                    },
                    dateOfRegistration: {
                      registered:
                        phDDetails.dateOfRegistration.registered || "",
                      received: phDDetails.dateOfRegistration.received || "",
                    },
                    supervisorAndCoSupervisorName: {
                      registered:
                        phDDetails.supervisorAndCoSupervisorName.registered ||
                        "",
                      received:
                        phDDetails.supervisorAndCoSupervisorName.received || "",
                    },
                    prePhDCompletionDate: {
                      registered:
                        phDDetails.prePhDCompletionDate.registered || "",
                      received: phDDetails.prePhDCompletionDate.received || "",
                    },
                    noOfResearchReviewsCompleted: {
                      registered:
                        phDDetails.noOfResearchReviewsCompleted.registered ||
                        "",
                      received:
                        phDDetails.noOfResearchReviewsCompleted.received || "",
                    },
                    dateOfCompletionOfPhD: {
                      registered:
                        phDDetails.dateOfCompletionOfPhD.registered || "",
                      received: phDDetails.dateOfCompletionOfPhD.received || "",
                    },
                  };

                  setTableData(transformedData);
                  setFiles(data2.phdConformation.files || []);
                }
              }
            }
          } else {
            setApiStatus(apiStatusConstants.failure);
          }
          setDisabled(false);
          setApiStatus(apiStatusConstants.success);
        } else {
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchYear();
  }, []);

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

  const handleOpenInNewTab = async (file) => {
    if (file.fileId) {
      try {
        const response = await fetch(`http://localhost:5000/files/${file.fileId}`);
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
            theme: "colored",
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

  const handleSelectOption1 = (event) => {
    setValue1(event.target.value);
  };
  const handleSelectOption2 = (event) => {
    setValue2(event.target.value);
  };

  const handleSelectOption3 = (event) => {
    setValue3(event.target.value);
  };

  const handleTableDataChange = (field, type, newValue) => {
    console.log(newValue);
    setTableData((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        [type]: newValue,
      },
    }));
  };

  const submitConformation = async () => {
    if (value1 === "") {
      setErrorMessage1("Please Choose an Option");
    } else if (value1 === "yes") {
      try {
        setErrorMessage1("");
        const userId = Cookies.get("user_id");
        const postData = {
          userId,
          formId,
          possesPhD: value1,
        };
        const api = "http://localhost:5000";
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        };
        const response = await fetch(`${api}/rdConfo`, option);
        if (response.ok === true) {
          setOnClick1(true);
        }
      } catch (error) {
        toast.error(`Internal Server Error! Please try again Later`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      setErrorMessage1("");
    }
  };

  const submitConformation2 = async () => {
    if (value2 === "" && value3 === "") {
      setErrorMessage2("Please Select an Option");
      setErrorMessage3("Please Select an Option");
    } else {
      if (value2 === "") {
        setErrorMessage3("");
        setErrorMessage2("Please Select an Option");
      }
      if (value3 === "") {
        setErrorMessage2("");
        setErrorMessage3("Please Select an Option");
      }
      if (value2 !== "" && value3 !== "") {
        setErrorMessage2("");
        setErrorMessage3("");
        try {
          const userId = Cookies.get("user_id");
          const postData = {
            userId,
            formId,
            possesPhD: value1,
            registerPhD: value2,
            receivedPhd: value3,
            tableData: [], // If you have table data, include it here
            deletedFiles: [],
          };
          const api = "http://localhost:5000";
          const option = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          };
          const response = await fetch(`${api}/rdConfo`, option);
          if (response.ok === true) {
            setOnClick2(true);
          }
        } catch (error) {
          toast.error(`Internal Server Error! Please try again Later`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      }
    }
  };

  const validateFields = () => {
    for (const field in tableData) {
      if (value2 === "yes" && !tableData[field].registered) {
        return false;
      }
      if (value3 === "yes") {
        if (
          field !== "noOfResearchReviewsCompleted" &&
          !tableData[field].received
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const submitConformation3 = async () => {
    try {
      if (validateFields()) {
        setDisabled(true);
        const userId = Cookies.get("user_id");
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("formId", formId);
        formData.append("possesPhD", value1);
        formData.append("registerPhD", value2);
        formData.append("receivedPhd", value3);
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
        const option = {
          method: "POST",
          body: formData,
        };
        const response = await fetch(`${api}/rdConfo`, option);
        if (response.ok === true) {
          setDisabled(false);
          navigate(`/research-and-development/partA/?f_id=${formId}`);
        }
      } else {
        setDisabled(false);
        toast.error(`All fields need to be filled`, {
          position: "bottom-center",
          autoClose: 5000,
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
      console.log(error);
      toast.error(`Internal Server Error! Please try again Later`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const subPartConformation = () => {
    return (
      <>
        <TableContainer>
          <Table>
            <TableMainHead>
              <TableRow>
                <TableHead></TableHead>
                {value2 === "yes" ? (
                  <TableHead>Registered Ph. D. in {year} </TableHead>
                ) : (
                  ""
                )}
                {value3 === "yes" ? (
                  <TableHead>Received Ph. D. in {year}</TableHead>
                ) : (
                  ""
                )}
              </TableRow>
            </TableMainHead>
            <TableBody>
              <TableRow></TableRow>
              <TableRow>
                <TableData>Name of the University</TableData>
                {value2 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value={tableData.nameOfTheUniversity.registered}
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "nameOfTheUniversity",
                          "registered",
                          newValue,
                        )
                      }
                      validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                      type="text"
                      disabled={false}
                    />
                  </TableData>
                ) : (
                  ""
                )}
                {value3 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value={tableData.nameOfTheUniversity.received}
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "nameOfTheUniversity",
                          "received",
                          newValue,
                        )
                      }
                      validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                      type="text"
                      disabled={false}
                    />
                  </TableData>
                ) : (
                  ""
                )}
              </TableRow>
              <TableRow>
                <TableData>Date of Registration</TableData>
                {value2 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value={tableData.dateOfRegistration.registered}
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "dateOfRegistration",
                          "registered",
                          newValue,
                        )
                      }
                      validate={(input) => true}
                      type="date"
                      disabled={false}
                    />
                  </TableData>
                ) : (
                  ""
                )}
                {value3 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value={tableData.dateOfRegistration.received}
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "dateOfRegistration",
                          "received",
                          newValue,
                        )
                      }
                      validate={(input) => true}
                      type="date"
                      disabled={false}
                    />
                  </TableData>
                ) : (
                  ""
                )}
              </TableRow>
              <TableRow>
                <TableData>Name of Supervisor and Co-Supervisor </TableData>
                {value2 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value={tableData.supervisorAndCoSupervisorName.registered}
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "supervisorAndCoSupervisorName",
                          "registered",
                          newValue,
                        )
                      }
                      validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                      type="text"
                      disabled={false}
                    />
                  </TableData>
                ) : (
                  ""
                )}
                {value3 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value={tableData.supervisorAndCoSupervisorName.received}
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "supervisorAndCoSupervisorName",
                          "received",
                          newValue,
                        )
                      }
                      validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                      type="text"
                      disabled={false}
                    />
                  </TableData>
                ) : (
                  ""
                )}
              </TableRow>
              <TableRow>
                <TableData>Pre-Ph.D. completion Date</TableData>
                {value2 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value={tableData.prePhDCompletionDate.registered}
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "prePhDCompletionDate",
                          "registered",
                          newValue,
                        )
                      }
                      validate={(input) => true}
                      type="date"
                      disabled={false}
                    />
                  </TableData>
                ) : (
                  ""
                )}
                {value3 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value={tableData.prePhDCompletionDate.received}
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "prePhDCompletionDate",
                          "received",
                          newValue,
                        )
                      }
                      validate={(input) => true}
                      type="date"
                      disabled={false}
                    />
                  </TableData>
                ) : (
                  ""
                )}
              </TableRow>
              <TableRow>
                <TableData>No. of Research Reviews completed</TableData>
                {value2 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value={tableData.noOfResearchReviewsCompleted.registered}
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "noOfResearchReviewsCompleted",
                          "registered",
                          newValue,
                        )
                      }
                      validate={(input) =>
                        /^[0-9]*(\.[0-9]+)?$/.test(input) &&
                        input <= 100 &&
                        input >= 0
                      }
                      type="text"
                      disabled={false}
                    />
                  </TableData>
                ) : (
                  ""
                )}
                {value3 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value=""
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "noOfResearchReviewsCompleted",
                          "received",
                          newValue,
                        )
                      }
                      validate={(input) =>
                        /^[0-9]*(\.[0-9]+)?$/.test(input) &&
                        input <= 100 &&
                        input >= 0
                      }
                      type="text"
                      disabled={true}
                    />
                  </TableData>
                ) : (
                  ""
                )}
              </TableRow>
              <TableRow>
                <TableData>Expected date/Date of completion of Ph.D.</TableData>
                {value2 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value={tableData.dateOfCompletionOfPhD.registered}
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "dateOfCompletionOfPhD",
                          "registered",
                          newValue,
                        )
                      }
                      validate={(input) => true}
                      type="date"
                      disabled={false}
                    />
                  </TableData>
                ) : (
                  ""
                )}
                {value3 === "yes" ? (
                  <TableData>
                    <EditableValue
                      value={tableData.dateOfCompletionOfPhD.received}
                      onValueChange={(newValue) =>
                        handleTableDataChange(
                          "dateOfCompletionOfPhD",
                          "received",
                          newValue,
                        )
                      }
                      validate={(input) => true}
                      type="date"
                      disabled={false}
                    />
                  </TableData>
                ) : (
                  ""
                )}
              </TableRow>
            </TableBody>
          </Table>
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
          <SaveNextButton
            className="btn btn-primary"
            type="submit"
            onClick={submitConformation3}
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
  };

  const registerAndCompletionConformation = () => {
    return (
      <>
        <ParagraphContainer className="mt-4">
          <Paragraph>Did you register for Ph. D. in {year}?</Paragraph>
          <SelectForm
            className="form-control w-25"
            onChange={handleSelectOption2}
            disabled={onClick2}
            value={value2}
          >
            <OptionSelectForm value="">Select an option</OptionSelectForm>
            <OptionSelectForm value="yes">Yes</OptionSelectForm>
            <OptionSelectForm value="no">No</OptionSelectForm>
          </SelectForm>
          <ErrorMessage className="mt-3">{errorMsg2}</ErrorMessage>
          <Paragraph>Did you receive your Ph. D. in {year}?</Paragraph>
          <SelectForm
            className="form-control w-25"
            onChange={handleSelectOption3}
            disabled={onClick2}
            value={value3}
          >
            <OptionSelectForm value="">Select an option</OptionSelectForm>
            <OptionSelectForm value="yes">Yes</OptionSelectForm>
            <OptionSelectForm value="no">No</OptionSelectForm>
          </SelectForm>
          <ErrorMessage className="mt-3">{errorMsg3}</ErrorMessage>
        </ParagraphContainer>
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            className="btn btn-primary"
            type="submit"
            onClick={submitConformation2}
            display={onClick2}
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
              "Next"
            )}
          </SaveNextButton>
        </SaveNextButtonContainer>
        {onClick2 ? subPartConformation() : ""}
      </>
    );
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
          <SectionHeading>Research and Development</SectionHeading>
          <MarksHeading>(Max. Score: 25)</MarksHeading>
        </HeadingContainer>
        <ParagraphContainer className="mt-4">
          <Paragraph>
            The section summarizes the progress of the candidate in Research and
            Development. Please furnish the following details. Furnish the
            documentary evidence for your claims.
          </Paragraph>
          <Paragraph>Do you posses Ph. D. in {year}</Paragraph>
          <SelectForm
            className="form-control w-25"
            onChange={handleSelectOption1}
            disabled={onClick1}
            value={value1}
          >
            <OptionSelectForm value="">Select an option</OptionSelectForm>
            <OptionSelectForm value="yes">Yes</OptionSelectForm>
            <OptionSelectForm value="no">No</OptionSelectForm>
          </SelectForm>
          <ErrorMessage className="mt-3">{errorMsg1}</ErrorMessage>
        </ParagraphContainer>
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            className="btn btn-primary"
            type="submit"
            onClick={submitConformation}
            display={onClick1}
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
              "Next"
            )}
          </SaveNextButton>
        </SaveNextButtonContainer>

        {onClick1 === true ? registerAndCompletionConformation() : ""}
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

  const renderConformationPage = () => {
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
      <Header />
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
            <p style={{ marginRight: "10px", marginTop: "10px" }}>
              Navigate to
            </p>
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
              <option selected>R&D Conformation</option>
              <option>R&D Part A</option>
              <option>R&D Part B</option>
              <option>R&D Part C</option>
              <option>R&D Part D</option>
              <option>Contribution To University School</option>
              <option>Contribution To Department</option>
              <option>Contribution To Society</option>
            </select>
          </div>
        </div>
        {renderConformationPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default Conformation;
