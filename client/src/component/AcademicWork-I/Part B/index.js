import Back from "../../Back";
import React, { useEffect, useState } from "react";
import Header from "../../Header";
// import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import failure from "../../Images/failure view.png";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
  InputFileContainer,
  InputFile,
  SaveNextButton,
  SaveNextButtonContainer,
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
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.success);
  const [year, setYear] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {};

    loadData();
  }, []);

  const submitAcademicForm2 = async (event) => {
    try {
      event.preventDefault();

      // Create a FormData object
      const formData = new FormData();
      formData.append("editorContent", editorContent);
      formData.append("file", file);
      console.log(formData);
      const api = "http://localhost:5000";
      const options = {
        method: "POST",
        body: formData,
      };

      const response = await fetch(`${api}/academic-work-2`, options);
      const data = await response.json();
      console.log(data);
      // navigate("/research-and-development/conformation");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
            academics during {year}
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
            modules={modules}
            formats={formats}
          />
        </TextEditorContainer>
        <InputFileContainer>
          <Paragraph>
            If you wish to provide any supported documents. You can Upload here
          </Paragraph>
          <InputFile type="file" onChange={handleFileChange} />
        </InputFileContainer>
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            className="btn btn-primary"
            type="submit"
            onClick={submitAcademicForm2}
          >
            Save & Next
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

  const renderAcademicWorkPartBPage = () => {
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
        {renderAcademicWorkPartBPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default AcademicWorkII;
