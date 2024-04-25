import Back from "../../Back";
import React, { useEffect, useState } from "react";
import Header from "../../Header";
// import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import failure from "../../Images/failure view.png";
// import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { plugins } from "./plugin";
import { toolbars } from "./toolbars";
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
  EditorContainer,
  Toolbar,
} from "./StyledComponents";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const AcademicWorkII = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.success);
  const [year, setYear] = useState("");
  const [contentState, setContentState] = useState(null);
  const [value, setValue] = useState("");
  const [text, setText] = useState("");

  console.log(value);
  const onEditorInputChange = (newValue, editor) => {
    setValue(newValue);
    setText(editor.getContent({ format: "text" }));
  };
  // const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      //   const apiContent = await ();
      //   // Assuming 'apiContent' is a string of HTML
      //   const contentState = convertToRaw(ContentState.createFromBlockArray(convertFromHTML(apiContent)));
      //   setContentState(contentState);
    };

    loadData();
  }, []);

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
          <Editor
            apiKey="dqtgiu3aijyl4v7hik9iow01fgs5da0tq2guyz4nder09c5t"
            onEditorChange={(newValue, editor) =>
              onEditorInputChange(newValue, editor)
            }
            onInit={(evt, editor) =>
              setText(editor.getContent({ format: "text" }))
            }
            value={value}
            initialValue={"Write your thoughts here..."}
            init={{
              plugins: plugins,
              toolbar: toolbars,
              images_upload_url: "path_to_your_upload_handler.php", // Specify your server-side upload handler URL
              file_picker_callback: function (callback, value, meta) {
                // Add your custom file picker logic here
                // For example, set a default value for the field:
                callback("my browser value");
              },
            }}
          />
        </TextEditorContainer>
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
