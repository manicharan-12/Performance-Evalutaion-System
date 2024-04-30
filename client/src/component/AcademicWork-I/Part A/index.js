import Back from "../../Back";
import React, { useEffect, useState, useCallback } from "react";
import Header from "../../Header";
import EditableValue from "../../EditableValue";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import failure from "../../Images/failure view.png";
import { useNavigate } from "react-router-dom";
import {
  HeadingContainer,
  SectionHeading,
  MarksHeading,
  SubSectionHeading,
  MainContainer,
  HomeMainContainer,
  SubSectionHeadingContainer,
  InputElement,
  TableContainer,
  Table,
  TableHead,
  TableData,
  SaveNextButton,
  SaveNextButtonContainer,
  TableMainHead,
  TableBody,
  TableRow,
  SpanEle,
  LoaderContainer,
  FailureContainer,
  FailureImage,
} from "./StyledComponents";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const AcademicWorkI = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [tableData, setTableData] = useState([
    {
      semesterName: "Semester 1",
      courses: [
        {
          name: "Course-1",
          courseTaught: "",
          scheduledClasses: "",
          actualClasses: "",
          passPercentage: "",
          apiScoreResults: "",
          studentFeedbackPercentage: "",
          studentFeedbackScore: "",
        },
        {
          name: "Course-2",
          courseTaught: "",
          scheduledClasses: "",
          actualClasses: "",
          passPercentage: "",
          apiScoreResults: "",
          studentFeedbackPercentage: "",
          studentFeedbackScore: "",
        },
      ],
    },
    {
      semesterName: "Semester 2",
      courses: [
        {
          name: "Course-1",
          courseTaught: "",
          scheduledClasses: "",
          actualClasses: "",
          passPercentage: "",
          apiScoreResults: "",
          studentFeedbackPercentage: "",
          studentFeedbackScore: "",
        },
        {
          name: "Course-2",
          courseTaught: "",
          scheduledClasses: "",
          actualClasses: "",
          passPercentage: "",
          apiScoreResults: "",
          studentFeedbackPercentage: "",
          studentFeedbackScore: "",
        },
      ],
    },
  ]);
  const [year, setYear] = useState("");
  const [averageResultPercentage, setAverageResultPercentage] = useState();
  const [averageFeedbackPercentage, setAverageFeedbackPercentage] = useState();
  const [totalApiScore, setTotalApiScore] = useState();
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleAddSemester = () => {
    const newSemesterIndex = tableData.length + 1;
    const newSemester = {
      semesterName: `Semester ${newSemesterIndex}`,
      courses: [
        {
          name: "Course-1",
          courseTaught: "",
          scheduledClasses: "",
          actualClasses: "",
          passPercentage: "",
          apiScoreResults: "",
          studentFeedbackPercentage: "",
          studentFeedbackScore: "",
        },
        {
          name: "Course-2",
          courseTaught: "",
          scheduledClasses: "",
          actualClasses: "",
          passPercentage: "",
          apiScoreResults: "",
          studentFeedbackPercentage: "",
          studentFeedbackScore: "",
        },
      ],
    };
    setTableData([...tableData, newSemester]);
  };

  const handleDeleteSemester = (semesterIndex) => {
    if (tableData.length > 2) {
      const newTableData = tableData.filter(
        (_, index) => index !== semesterIndex,
      );
      setTableData(newTableData);
    } else {
      console.log("Cannot delete semester. Minimum of 2 semesters required.");
    }
  };

  const handleAddCourse = (semesterIndex) => {
    const newTableData = [...tableData];
    const currentSemester = newTableData[semesterIndex];
    const newCourseIndex = currentSemester.courses.length + 1;
    const newCourse = {
      name: `Course-${newCourseIndex}`,
      courseTaught: "",
      scheduledClasses: "",
      actualClasses: "",
      passPercentage: "",
      apiScoreResults: "",
      studentFeedbackPercentage: "",
      studentFeedbackScore: "",
    };
    currentSemester.courses.push(newCourse);
    setTableData(newTableData);
  };

  const handleDeleteCourse = (semesterIndex) => {
    const currentSemester = tableData[semesterIndex];
    if (currentSemester.courses.length > 2) {
      const newTableData = [...tableData];
      currentSemester.courses.pop();
      setTableData(newTableData);
    } else {
      console.log("Cannot delete course. Minimum of 2 courses required.");
    }
  };

  const handleEditCourse = (semesterIndex, courseIndex, updatedCourse) => {
    updatedCourse.passPercentage = Math.round(
      parseFloat(updatedCourse.passPercentage),
    );
    updatedCourse.studentFeedbackPercentage = Math.round(
      parseFloat(updatedCourse.studentFeedbackPercentage),
    );
    updatedCourse.apiScoreResults = calculateApiScore(
      updatedCourse.passPercentage,
    );
    updatedCourse.studentFeedbackScore = calculateApiScore(
      updatedCourse.studentFeedbackPercentage,
    );

    const updatedSemesters = tableData.map((semester, sIndex) => {
      if (sIndex === semesterIndex) {
        const updatedCourses = semester.courses.map((course, cIndex) => {
          if (cIndex === courseIndex) {
            return updatedCourse;
          }
          return course;
        });
        return { ...semester, courses: updatedCourses };
      }
      return semester;
    });
    setTableData(updatedSemesters);
    recalculateAveragesAndTotalApiScore();
  };

  const recalculateAveragesAndTotalApiScore = useCallback(() => {
    const allCourses = tableData.flatMap((semester) => semester.courses);
    const totalPassPercentage = allCourses.reduce(
      (acc, course) =>
        acc + (course.passPercentage ? parseFloat(course.passPercentage) : 0),
      0,
    );
    const totalFeedbackPercentage = allCourses.reduce(
      (acc, course) =>
        acc +
        (course.studentFeedbackPercentage
          ? parseFloat(course.studentFeedbackPercentage)
          : 0),
      0,
    );

    const averagePassPercentage = totalPassPercentage / allCourses.length;
    const averageFeedbackPercentage =
      totalFeedbackPercentage / allCourses.length;
    const totalApiScore =
      calculateApiScore(averagePassPercentage) +
      calculateApiScore(averageFeedbackPercentage);
    setAverageResultPercentage(averagePassPercentage);
    setAverageFeedbackPercentage(averageFeedbackPercentage);
    setTotalApiScore(totalApiScore);
  }, [tableData]);

  const calculateApiScore = (value) => {
    if (value < 0 || value > 100) {
      return;
    } else if (value >= 90) {
      return 20;
    } else if (value >= 80) {
      return 15;
    } else if (value >= 70) {
      return 10;
    } else if (value >= 60) {
      return 5;
    } else if (value < 60) {
      return 2;
    }
  };

  const submitAcademicForm1 = async (event) => {
    try {
      event.preventDefault();
      setDisabled(true);
      const isAnyFieldEmpty = (course) => {
        return (
          !course.name ||
          !course.courseTaught ||
          !course.scheduledClasses ||
          !course.actualClasses ||
          !course.passPercentage ||
          !course.apiScoreResults ||
          !course.studentFeedbackPercentage ||
          !course.studentFeedbackScore ||
          !year
        );
      };
      for (const semester of tableData) {
        for (const course of semester.courses) {
          if (isAnyFieldEmpty(course)) {
            alert("Please fill out all the fields before submitting.");
            return;
          }
        }
        const userId = Cookies.get("user_id");
        const postData = {
          userId,
          tableData,
          year,
          averageResultPercentage,
          averageFeedbackPercentage,
          totalApiScore,
        };
        const api = "http://localhost:5000";
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        };
        await fetch(`${api}/academic-work-1`, option);
        setDisabled(false);
        navigate("/academicWork/part-b");
      }
    } catch (error) {
      console.log(error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    recalculateAveragesAndTotalApiScore();
  }, [tableData, recalculateAveragesAndTotalApiScore]);

  useEffect(() => {
    async function fetchData() {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        setDisabled(true);
        const userId = Cookies.get("user_id");
        const api = "http://localhost:5000";
        const response = await fetch(`${api}/academic-work-1/data/${userId}`);
        if (response.ok === true) {
          const data = await response.json();
          if (data === null) {
            setApiStatus(apiStatusConstants.success);
          } else {
            setTableData(data.academic_work_part_a || tableData);
            setYear(data.academic_year);
            setAverageFeedbackPercentage(data.averageFeedbackPercentage);
            setAverageResultPercentage(data.averageResultPercentage);
            setTotalApiScore(data.totalApiScore);
            setDisabled(false);
            setApiStatus(apiStatusConstants.success);
          }
        } else {
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.log(error);
        setApiStatus(apiStatusConstants.failure);
      }
    }
    fetchData();
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
        <HeadingContainer>
          <SectionHeading>Academic Work</SectionHeading>
          <MarksHeading>(Max. Score: 45)</MarksHeading>
        </HeadingContainer>
        <SubSectionHeadingContainer>
          <SubSectionHeading className="mt-4 flex-start">
            a. Teaching Performance indicator for{" "}
            <InputElement
              style={{
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "-3px",
                width: "10%",
              }}
              value={year}
              placeholder="Year"
              onChange={handleYearChange}
            />
          </SubSectionHeading>
        </SubSectionHeadingContainer>
        <TableContainer className="mt-5">
          <Table>
            <TableMainHead>
              <TableRow>
                <TableHead>Semester</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Course taught</TableHead>
                <TableHead>No. of Scheduled Classes</TableHead>
                <TableHead>No. of classes actually held</TableHead>
                <TableHead>Result (Pass %)</TableHead>
                <TableHead>API Score-Results (Max. 20) (A)</TableHead>
                <TableHead>Student Feedback %</TableHead>
                <TableHead>API Score-Feedback (Max. 20) (B)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableMainHead>
            <TableBody>
              {tableData.map((semester, semesterIndex) => {
                const semesterCoursesCount = semester.courses.length;
                return semester.courses.map((course, courseIndex) => (
                  <TableRow key={`course-${semesterIndex}-${courseIndex}`}>
                    {courseIndex === 0 && (
                      <TableData rowSpan={semesterCoursesCount}>
                        {semester.semesterName}
                      </TableData>
                    )}
                    <TableData>
                      <SpanEle>{course.name}</SpanEle>
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={course.courseTaught || ""}
                        onValueChange={(newValue) =>
                          handleEditCourse(semesterIndex, courseIndex, {
                            ...course,
                            courseTaught: newValue,
                          })
                        }
                        validate={(input) => /^[A-Za-z\s]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={course.scheduledClasses}
                        onValueChange={(newValue) =>
                          handleEditCourse(semesterIndex, courseIndex, {
                            ...course,
                            scheduledClasses: newValue,
                          })
                        }
                        validate={(input) => /^[0-9]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={course.actualClasses}
                        onValueChange={(newValue) =>
                          handleEditCourse(semesterIndex, courseIndex, {
                            ...course,
                            actualClasses: newValue,
                          })
                        }
                        validate={(input) => /^[0-9]+$/.test(input)}
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={course.passPercentage}
                        onValueChange={(newValue) => {
                          const apiScoreResults = calculateApiScore(newValue);
                          handleEditCourse(semesterIndex, courseIndex, {
                            ...course,
                            passPercentage: newValue,
                            apiScoreResults,
                          });
                        }}
                        validate={(input) =>
                          /^[0-9]*(\.[0-9]+)?$/.test(input) &&
                          input <= 100 &&
                          input >= 0
                        }
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <SpanEle>{course.apiScoreResults}</SpanEle>
                    </TableData>
                    <TableData>
                      <EditableValue
                        value={course.studentFeedbackPercentage}
                        onValueChange={(newValue) => {
                          const apiScoreFeedback = calculateApiScore(newValue);
                          handleEditCourse(semesterIndex, courseIndex, {
                            ...course,
                            studentFeedbackPercentage: newValue,
                            studentFeedbackScore: apiScoreFeedback,
                          });
                        }}
                        validate={(input) =>
                          /^[0-9]*(\.[0-9]+)?$/.test(input) &&
                          input <= 100 &&
                          input >= 0
                        }
                        type="text"
                        disabled={false}
                      />
                    </TableData>
                    <TableData>
                      <SpanEle>{course.studentFeedbackScore}</SpanEle>
                    </TableData>
                    {courseIndex === 0 && (
                      <TableData rowSpan={semesterCoursesCount}>
                        <SaveNextButton
                          onClick={() => handleAddCourse(semesterIndex)}
                          className="btn btn-primary mb-2"
                        >
                          Add Course
                        </SaveNextButton>
                        {semester.courses.length > 2 ? (
                          <SaveNextButton
                            onClick={() => handleDeleteCourse(semesterIndex)}
                            className="btn btn-danger  mb-2"
                          >
                            Delete Course
                          </SaveNextButton>
                        ) : (
                          ""
                        )}
                      </TableData>
                    )}
                  </TableRow>
                ));
              })}
              <TableRow>
                <TableHead colSpan="5">Average Percentage</TableHead>
                <TableData>{averageResultPercentage}</TableData>
                <TableData></TableData>
                <TableData>{averageFeedbackPercentage}</TableData>
                <TableData></TableData>
                <TableData></TableData>
              </TableRow>
              <TableRow>
                <TableHead colSpan="5">
                  Total API score (Results + Feedback)
                </TableHead>
                <TableData colSpan="5">{totalApiScore}</TableData>
              </TableRow>
            </TableBody>
          </Table>
          <SaveNextButton
            onClick={handleAddSemester}
            className="btn btn-primary mt-3 mr-3"
          >
            Add Semester
          </SaveNextButton>
          {tableData.length > 2 && (
            <SaveNextButton
              onClick={() => handleDeleteSemester(tableData.length - 1)}
              className="btn btn-danger mt-3"
            >
              Delete Last Semester
            </SaveNextButton>
          )}
        </TableContainer>
        <SubSectionHeading className="mt-5 flex-start w-100">
          Evaluation Guidelines:
        </SubSectionHeading>
        <TableContainer>
          <Table>
            <TableMainHead>
              <TableRow>
                <TableHead>Pass Percentage / Feedback</TableHead>
                <TableHead>&gt;=90%</TableHead>
                <TableHead>80-90%</TableHead>
                <TableHead>70-79%</TableHead>
                <TableHead>60-69%</TableHead>
                <TableHead>&lt;60%</TableHead>
              </TableRow>
            </TableMainHead>
            <TableBody>
              <TableData>
                <SpanEle>API Score for Results and student feedback</SpanEle>
              </TableData>
              <TableData>
                <SpanEle>20</SpanEle>
              </TableData>
              <TableData>
                <SpanEle>15</SpanEle>
              </TableData>
              <TableData>
                <SpanEle>10</SpanEle>
              </TableData>
              <TableData>
                <SpanEle>5</SpanEle>
              </TableData>
              <TableData>
                <SpanEle>2</SpanEle>
              </TableData>
            </TableBody>
          </Table>
        </TableContainer>
        <SaveNextButtonContainer className="mt-3">
          <SaveNextButton
            className="btn btn-primary"
            type="submit"
            onClick={submitAcademicForm1}
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

  const renderAcademicWorkPartAPage = () => {
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
        {renderAcademicWorkPartAPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default AcademicWorkI;
