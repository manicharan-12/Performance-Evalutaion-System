import React, { useEffect, useState } from "react";
import {
  SubSectionHeadingContainer,
  SubSectionHeading,
  CourseContainer,
  CourseFormContainer,
  InputContainerMain,
  InputElement,
  LabelElement,
  CourseHeadingContainer,
  DeleteButton,
  LogoutButton,
} from "./StyledComponents";
import { MdDelete } from "react-icons/md";
import Cookies from "js-cookie";

const CourseForm = ({ semester }) => {
  const [courses, setCourses] = useState([
    {
      courseTaught: "",
      scheduledClasses: "",
      classesHeld: "",
      passPercentage: "",
      apiScore1: "",
      feedbackPercentage: "",
      apiScore2: "",
    },
  ]);

  const userId = Cookies.get("user_id");

  useEffect(() => {
    async function fetchData() {}
    fetchData();
  }, []);

  const deleteCourse = (event, index) => {
    event.preventDefault();
    const list = [...courses];
    list.splice(index, 1);
    setCourses(list);
  };

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        courseTaught: "",
        scheduledClasses: "",
        classesHeld: "",
        passPercentage: "",
        apiScore1: "",
        feedbackPercentage: "",
        apiScore2: "",
      },
    ]);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...courses];
    list[index][name] = value;
    setCourses(list);
  };

  return (
    <>
      <SubSectionHeadingContainer className="mt-4">
        <SubSectionHeading>{semester}</SubSectionHeading>
      </SubSectionHeadingContainer>
      {courses.map((course, index) => (
        <CourseContainer key={index}>
          <CourseHeadingContainer style={{ width: "100%" }}>
            <SubSectionHeading style={{ width: "100%" }} className="flex-start">
              Course {index + 1}
            </SubSectionHeading>
            <DeleteButton onClick={(e) => deleteCourse(e, index)}>
              <MdDelete />
            </DeleteButton>
          </CourseHeadingContainer>
          <CourseFormContainer>
            <InputContainerMain className="mt-3 mb-3" style={{ width: "100%" }}>
              <LabelElement>Course Taught:</LabelElement>
              <InputElement
                type="text"
                name="courseTaught"
                value={course.courseTaught}
                onChange={(e) => handleInputChange(e, index)}
                className="form-control"
                style={{
                  width: "40%",
                  backgroundColor: "#fff",
                }}
              />
            </InputContainerMain>
            <InputContainerMain className="mb-3" style={{ width: "100%" }}>
              <LabelElement>No. of Scheduled Classes:</LabelElement>
              <InputElement
                type="text"
                name="scheduledClasses"
                value={course.scheduledClasses}
                onChange={(e) => handleInputChange(e, index)}
                className="form-control"
                style={{
                  width: "40%",
                  backgroundColor: "#fff",
                }}
              />
            </InputContainerMain>
            <InputContainerMain className="mb-3" style={{ width: "100%" }}>
              <LabelElement>No. of Classes Actually Held:</LabelElement>
              <InputElement
                type="text"
                name="classesHeld"
                value={course.classesHeld}
                onChange={(e) => handleInputChange(e, index)}
                className="form-control"
                style={{
                  width: "40%",
                  backgroundColor: "#fff",
                }}
              />
            </InputContainerMain>
            <InputContainerMain className="mb-3" style={{ width: "100%" }}>
              <LabelElement>Pass %:</LabelElement>
              <InputElement
                type="text"
                name="passPercentage"
                value={course.passPercentage}
                onChange={(e) => handleInputChange(e, index)}
                className="form-control"
                style={{
                  width: "40%",
                  backgroundColor: "#fff",
                }}
              />
            </InputContainerMain>
            <InputContainerMain className="mb-3" style={{ width: "100%" }}>
              <LabelElement>API Score -1:</LabelElement>
              <InputElement
                type="text"
                name="apiScore1"
                value={course.apiScore1}
                onChange={(e) => handleInputChange(e, index)}
                disabled
                className="form-control"
                style={{
                  width: "40%",
                  backgroundColor: "#fff",
                  cursor: "not-allowed",
                }}
              />
            </InputContainerMain>
            <InputContainerMain className="mb-3" style={{ width: "100%" }}>
              <LabelElement>Feedback %:</LabelElement>
              <InputElement
                type="text"
                name="feedbackPercentage"
                value={course.feedbackPercentage}
                onChange={(e) => handleInputChange(e, index)}
                className="form-control"
                style={{
                  width: "40%",
                  backgroundColor: "#fff",
                }}
              />
            </InputContainerMain>
            <InputContainerMain className="mb-3" style={{ width: "100%" }}>
              <LabelElement>API Score -2:</LabelElement>
              <InputElement
                type="text"
                name="apiScore2"
                value={course.apiScore2}
                onChange={(e) => handleInputChange(e, index)}
                disabled
                className="form-control"
                style={{
                  width: "40%",
                  backgroundColor: "#fff",
                  cursor: "not-allowed",
                }}
              />
            </InputContainerMain>
          </CourseFormContainer>
        </CourseContainer>
      ))}
      <LogoutButton onClick={addCourse} className="btn btn-primary">
        Add Course
      </LogoutButton>
    </>
  );
};

export default CourseForm;
