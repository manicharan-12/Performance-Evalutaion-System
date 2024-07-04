import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import Back from "../../Back";
import Header from "../../Header";
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
  DeleteButton, // Add this import for DeleteButton
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

const AcademicWorkII = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [editorContent, setEditorContent] = useState("");
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [onClick, setOnClick] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formId, setFormId] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const role = Cookies.get("role");

  useEffect(() => {
    let id;
    async function fetchData() {
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
        const response = await fetch(
          `http://localhost:5000/academic-work-2/data/${userId}/?formId=${id}`,
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
        console.error(error);
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchData();
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
    disabled: role === "HOD",
  });

  const submitAcademicForm2 = async (event) => {
    event.preventDefault();
    setOnClick(true);
    setDisabled(true);
    const userId = Cookies.get("user_id");
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("formId", formId);
    formData.append("editorContent", editorContent);
    files.forEach((file) => {
      if (!file.fileId) {
        formData.append("files", file);
      }
    });
    deletedFiles.forEach((fileId) => {
      formData.append("deletedFiles", fileId);
    });

    try {
      const response = await fetch("http://localhost:5000/academic-work-2", {
        method: "POST",
        body: formData,
      });
      if (response.ok === true) {
        navigate(`/research-and-development/conformation/?f_id=${formId}`);
      } else {
        setOnClick(false);
        setDisabled(false);
        toast.error("Error While Saving the data Please try again later", {
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
      console.error(error);
      setOnClick(false);
      setDisabled(false);
      toast.error("Internal Server Error! Please try again later", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
        progress: undefined,
      });
    }
  };

  const handleOpenInNewTab = async (file) => {
    if (file.fileId) {
      try {
        const response = await fetch(
          `http://localhost:5000/files/${file.fileId}`,
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
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
            },
          );
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
          },
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
          />
        </TextEditorContainer>
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
          </div>
        </div>
        {renderAcademicWorkPartBPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default AcademicWorkII;
