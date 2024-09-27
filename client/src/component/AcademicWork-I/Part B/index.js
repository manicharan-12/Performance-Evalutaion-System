import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import EditableValue from "../../EditableValue";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import Back from "../../Back";
import { TiDelete } from "react-icons/ti";
import failure from "../../Images/failure view.png";
import { toast } from "react-toastify";
import {
  LoaderContainer,
  FailureContainer,
  FailureImage,
  HomeMainContainer,
  MainContainer,
  SubSectionHeadingContainer,
  SubSectionHeading,
  ParagraphContainer,
  Paragraph,
  TextEditorContainer,
  InputFile,
  SaveNextButton,
  SaveNextButtonContainer,
  FileContainer,
  StyledDropzone,
  UnorderedList,
  ListItems,
  SpanEle,
  DeleteButton,
  TableContainer,
  Table,
  TableHead,
  TableData,
  TableMainHead,
  TableBody,
  TableRow,
} from "./StyledComponents";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
  "formula",
  "header",
  "list",
  "bullet",
  "check",
  "script",
  "sub",
  "super",
  "indent",
  "direction",
  "size",
  "color",
  "background",
  "font",
  "align",
  "clean",
];

const AcademicWorkII = (props) => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [editorContent, setEditorContent] = useState("");
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [onClick, setOnClick] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formId, setFormId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [reviewerScore, setReviewerScore] = useState("");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isSummaryPath =
    location.pathname.startsWith("/summary") ||
    location.pathname.startsWith("/review");
  const isReview = location.pathname.startsWith("/review");

  const role = Cookies.get("role");

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

    const fetchData = async (formId, userId) => {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        const response = await fetch(
          `http://localhost:6969/academic-work-2/data/${userId}/?formId=${formId}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.academicWork) {
            setEditorContent(data.academicWork.editorContent || "");
            setFiles(data.academicWork.files || []);
            setApiStatus(apiStatusConstants.success);
          } else {
            setEditorContent("");
            setFiles([]);
            setApiStatus(apiStatusConstants.success);
          }
        } else {
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.error("Error fetching data from API:", error);
        setApiStatus(apiStatusConstants.failure);
      }
    };

    const [formId, userId] = getFormIdFromSearchParams();
    if (formId && userId) {
      setFormId(formId);
      setUserId(userId);

      if (!isReview) {
        fetchData(formId, userId);
      } else {
        setApiStatus(apiStatusConstants.inProgress);
        const { editorContent, files } = props.data;
        setEditorContent(editorContent);
        setFiles(files);
        setApiStatus(apiStatusConstants.success);
      }
    }
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
    disabled: role === "HOD",
  });

  const submitAcademicForm2 = async (event) => {
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

    event.preventDefault();
    setOnClick(true);
    setDisabled(true);

    if (editorContent === "") {
      await toast.error("Please fill the text area", {
        position: "bottom-center",
        autoClose: 6969,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("formId", formId);
    formData.append("editorContent", editorContent);
    formData.append("reviewerScore", reviewerScore);
    files.forEach((file) => {
      if (!file.fileId) {
        formData.append("files", file);
      }
    });
    deletedFiles.forEach((fileId) => {
      formData.append("deletedFiles", fileId);
    });

    try {
      const response = await fetch("http://localhost:6969/academic-work-2", {
        method: "POST",
        body: formData,
      });
      if (response.ok === true) {
        !isReview &&
          navigate(
            `/research-and-development/conformation/?f_id=${formId}&fac_id=${userId}`
          );
      } else {
        setOnClick(false);
        setDisabled(false);
        toast.error("Error While Saving the data Please try again later", {
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
      console.error(error);
      setOnClick(false);
      setDisabled(false);
      toast.error("Internal Server Error! Please try again later", {
        position: "bottom-center",
        autoClose: 6969,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
        progress: undefined,
      });
    } finally {
      setOnClick(false);
      setDisabled(false);
    }
  };

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

    setApiStatus(apiStatusConstants.inProgress);
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
      } finally {
        setApiStatus(apiStatusConstants.success);
      }
    } else {
      const url = file.preview;
      window.open(url, "_blank");
      setApiStatus(apiStatusConstants.success);
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
        <SubSectionHeadingContainer>
          <SubSectionHeading>
            b. Please describe instances where you have gone the extra mile in
            academics
          </SubSectionHeading>
          <SubSectionHeading>(Max. Score: 5)</SubSectionHeading>
        </SubSectionHeadingContainer>
        <ParagraphContainer className="mt-3">
          <Paragraph>
            This section includes efforts to enhance the student experience by
            demonstrating exceptional dedication. Provide specific cases and
            outcomes that highlight your commitment which has improved the
            student regularity, discipline, academic accomplishments,
            professional and career development through coaching, guidance,
            mentoring, conducting remedial classes, and other academic
            activities. Submit the documentary evidences for your claims.{" "}
          </Paragraph>
        </ParagraphContainer>
        <TextEditorContainer>
          <ReactQuill
            theme="snow"
            value={editorContent}
            onChange={setEditorContent}
            modules={role === "HOD" ? { toolbar: false } : modules}
            readOnly={role === "HOD"}
            formats={formats}
            style={{ width: "100%" }}
          />
        </TextEditorContainer>
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
        {isReview && (
          <TableContainer className="mt-4">
            <Table>
              <TableMainHead>
                <TableRow>
                  <TableHead>Reviewer Remark</TableHead>
                </TableRow>
              </TableMainHead>
              <TableBody>
                <TableRow>
                  <TableData>
                    <EditableValue
                      value={reviewerScore || ""}
                      onValueChange={(newValue) => setReviewerScore(newValue)}
                      validate={(input) => /^[0-5]+$/.test(input)}
                      type="text"
                      disabled={false}
                    />
                  </TableData>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {!isSummaryPath && (
          <SaveNextButtonContainer className="mt-3">
            <SaveNextButton
              className="btn btn-primary text-center"
              type="submit"
              onClick={submitAcademicForm2}
              display={onClick}
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
          </SaveNextButtonContainer>
        )}
        {isReview && (
          <SaveNextButtonContainer className="mt-3">
            <SaveNextButton
              className="btn btn-primary"
              type="submit"
              onClick={submitAcademicForm2}
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
                "Save"
              )}
            </SaveNextButton>
          </SaveNextButtonContainer>
        )}
      </>
    );
  };

  const renderFailureView = () => {
    return (
      <FailureContainer>
        <FailureImage src={failure} />
        <SubSectionHeading className="mt-4">
          Failed to load Data. Retry Again!
        </SubSectionHeading>
      </FailureContainer>
    );
  };

  const renderAcademicWorkPartBPage = () => {
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
              <select
                style={{
                  border: "1px solid #000",
                  borderRadius: "5px",
                  padding: "5px",
                }}
                onChange={handleSelectChange}
              >
                <option>AcademicWork I</option>
                <option selected>AcademicWork II</option>
                <option>R&D Conformation</option>
                <option>R&D Part A</option>
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
        {renderAcademicWorkPartBPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default AcademicWorkII;
