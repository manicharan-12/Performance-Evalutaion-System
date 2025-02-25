import Back from "../../Back";
import React, { useEffect, useState, useCallback } from "react";
import Header from "../../Header";
import EditableValue from "../../EditableValue";
import Cookies from "js-cookie";
import { ThreeDots, Oval } from "react-loader-spinner";
import failure from "../../Images/failure view.png";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
import { toast } from "react-toastify";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const AcademicWorkI = (props) => {
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
          remarkA: "",
          remarkB: "",
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
          remarkA: "",
          remarkB: "",
        },
      ],
    },
  ]);
  const [year, setYear] = useState("");
  const [averageResultPercentage, setAverageResultPercentage] = useState();
  const [averageFeedbackPercentage, setAverageFeedbackPercentage] = useState();
  const [totalApiScore, setTotalApiScore] = useState();
  const [disabled, setDisabled] = useState(false);
  const [formId, setFormId] = useState("");
  const [userId, setUserId] = useState("");
  const location = useLocation();
  const isSummaryPath = location.pathname.startsWith("/summary");
  const isReview = location.pathname.startsWith("/review");
  const isReviewAndIsSummary =
    location.pathname.startsWith("/summary") ||
    location.pathname.startsWith("/review");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
      ],
    };
    setTableData([...tableData, newSemester]);
  };

  const handleDeleteSemester = (semesterIndex) => {
    if (tableData.length > 1) {
      const newTableData = tableData.filter(
        (_, index) => index !== semesterIndex
      );
      setTableData(newTableData);
    } else {
      toast.error("Cannot delete semester. Minimum of 2 semesters required.", {
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
  };

  const handleAddCourse = (semesterIndex) => {
    const newTableData = tableData.map((semester, sIndex) => {
      if (sIndex === semesterIndex) {
        const newCourses = [
          ...semester.courses,
          {
            name: `Course-${semester.courses.length + 1}`,
            courseTaught: "",
            scheduledClasses: "",
            actualClasses: "",
            passPercentage: "",
            apiScoreResults: "",
            studentFeedbackPercentage: "",
            studentFeedbackScore: "",
          },
        ];
        return { ...semester, courses: newCourses };
      }
      return semester;
    });
    setTableData(newTableData);
  };

  const handleDeleteCourse = (semesterIndex) => {
    const currentSemester = tableData[semesterIndex];
    if (currentSemester.courses.length > 1) {
      const newTableData = [...tableData];
      currentSemester.courses.pop();
      setTableData(newTableData);
    } else {
      toast.error("Cannot delete course. Minimum of 2 courses required.", {
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
  };

  const handleEditCourse = (semesterIndex, courseIndex, updatedCourse) => {
    if (updatedCourse.passPercentage !== "") {
      updatedCourse.passPercentage = Math.round(
        parseFloat(updatedCourse.passPercentage)
      );
      updatedCourse.apiScoreResults = calculateApiScore(
        updatedCourse.passPercentage
      );
    }
    if (updatedCourse.studentFeedbackPercentage !== "") {
      updatedCourse.studentFeedbackPercentage = Math.round(
        parseFloat(updatedCourse.studentFeedbackPercentage)
      );
      updatedCourse.studentFeedbackScore = calculateApiScore(
        updatedCourse.studentFeedbackPercentage
      );
    }

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
      0
    );
    const totalFeedbackPercentage = allCourses.reduce(
      (acc, course) =>
        acc +
        (course.studentFeedbackPercentage
          ? parseFloat(course.studentFeedbackPercentage)
          : 0),
      0
    );

    const averagePassPercentage = parseFloat(
      (totalPassPercentage / allCourses.length).toPrecision(4)
    );
    const averageFeedbackPercentage = parseFloat(
      (totalFeedbackPercentage / allCourses.length).toPrecision(4)
    );
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
            setDisabled(false);
            return;
          }
        }
        const postData = {
          userId,
          formId,
          tableData,
          year,
          averageResultPercentage,
          averageFeedbackPercentage,
          totalApiScore,
        };
        const api = "http://localhost:6969";
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        };
        const response = await fetch(`${api}/academic-work-1`, option);
        if (response.ok === true) {
          !isReview &&
            // update fac_id
            navigate(`/academicWork/part-b/?f_id=${formId}&fac_id=${userId}`);
        } else {
          setDisabled(false);
          await toast.error("Failed to save data! Please try again later", {
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
      }
    } catch (error) {
      console.error(error);
      setDisabled(false);
      toast.error("Failed to save data! Please try again later", {
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

  useEffect(() => {
    recalculateAveragesAndTotalApiScore();
  }, [tableData, recalculateAveragesAndTotalApiScore]);

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
        setDisabled(true);
        const api = "http://localhost:6969";
        const response = await fetch(
          `${api}/academic-work-1/data/${userId}/?formId=${formId}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data === null) {
            setApiStatus(apiStatusConstants.success);
            setDisabled(false);
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
        const {
          academic_work_part_a,
          academic_year,
          averageFeedbackPercentage,
          averageResultPercentage,
          totalApiScore,
        } = props.data;

        setTableData(academic_work_part_a);
        setYear(academic_year);
        setAverageFeedbackPercentage(averageFeedbackPercentage);
        setAverageResultPercentage(averageResultPercentage);
        setTotalApiScore(totalApiScore);
        setApiStatus(apiStatusConstants.success);
      }
    }
  }, [isReview, searchParams, props.data]);

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
            {!isReviewAndIsSummary ? (
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
            ) : (
              year
            )}
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
                {isReview && (
                  <TableHead>Reviewer Remark (Max. 20) (A)</TableHead>
                )}
                <TableHead>Student Feedback %</TableHead>
                <TableHead>API Score-Feedback (Max. 20) (B)</TableHead>
                {!isReviewAndIsSummary && <TableHead>Actions</TableHead>}
                {isReview && (
                  <TableHead>Reviewer Remark (Max. 20) (B)</TableHead>
                )}
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
                    {isReview && (
                      <TableData>
                        <EditableValue
                          value={course.remarkA || ""}
                          onValueChange={(newValue) =>
                            handleEditCourse(semesterIndex, courseIndex, {
                              ...course,
                              remarkA: newValue,
                            })
                          }
                          validate={(input) =>
                            /^(?:[0-9]|1[0-9]|20)$/.test(input)
                          }
                          type="text"
                          disabled={false}
                        />
                      </TableData>
                    )}
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
                    {courseIndex === 0 && !isReviewAndIsSummary && (
                      <TableData rowSpan={semesterCoursesCount}>
                        <SaveNextButton
                          onClick={() => handleAddCourse(semesterIndex)}
                          className="mb-2"
                          style={{
                            width: "100%",
                            padding: "6px",
                            borderRadius: "8px",
                            backgroundImage:
                              "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
                            color: "#fff",
                            border: "none",
                          }}
                        >
                          Add Course
                        </SaveNextButton>
                        {semester.courses.length > 1 ? (
                          <SaveNextButton
                            onClick={() => handleDeleteCourse(semesterIndex)}
                            className="mb-2"
                            style={{
                              width: "100%",
                              padding: "6px",
                              borderRadius: "8px",
                              backgroundImage:
                                "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
                              color: "#fff",
                              border: "none",
                            }}
                          >
                            Delete Course
                          </SaveNextButton>
                        ) : (
                          ""
                        )}
                      </TableData>
                    )}
                    {isReview && (
                      <TableData>
                        <EditableValue
                          value={course.remarkB || ""}
                          onValueChange={(newValue) =>
                            handleEditCourse(semesterIndex, courseIndex, {
                              ...course,
                              remarkB: newValue,
                            })
                          }
                          validate={(input) =>
                            /^(?:[0-9]|1[0-9]|20)$/.test(input)
                          }
                          type="text"
                          disabled={false}
                        />
                      </TableData>
                    )}
                  </TableRow>
                ));
              })}
              <TableRow>
                <TableHead colSpan="5">Average Percentage</TableHead>
                <TableData>{averageResultPercentage}</TableData>
                <TableData></TableData>
                {isReview && (
                  <TableData>{/* Calculate Average Score */}</TableData>
                )}
                <TableData>{averageFeedbackPercentage}</TableData>
                <TableData></TableData>
                {isReview && (
                  <TableData>{/* Calculate Average Score */}</TableData>
                )}
                {!isReviewAndIsSummary && <TableData></TableData>}
              </TableRow>
              <TableRow>
                <TableHead colSpan={isReview ? 5 : isSummaryPath ? 4 : 5}>
                  Total API score (Results + Feedback)
                </TableHead>
                <TableData colSpan={isReview ? 6 : isSummaryPath ? 5 : 5}>{totalApiScore}</TableData>
              </TableRow>
            </TableBody>
          </Table>
          {!isSummaryPath ||
            (isReview && (
              <SaveNextButton
                onClick={handleAddSemester}
                className="mt-3"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundImage:
                    "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
                  color: "#fff",
                  border: "none",
                }}
              >
                Add Semester
              </SaveNextButton>
            ))}
          {tableData.length > 1 && (!isSummaryPath || !isReview) && (
            <SaveNextButton
              onClick={() => handleDeleteSemester(tableData.length - 1)}
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
              Delete Semester
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
        {!isSummaryPath && (
          <SaveNextButtonContainer className="mt-3">
            <SaveNextButton
              className="btn btn-primary"
              type="submit"
              onClick={submitAcademicForm1}
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
              onClick={submitAcademicForm1}
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

  const isFormValid = () => {
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
          return false;
        }
      }
    }
    return true;
  };

  const handleSelectChange = async (event) => {
    const selectedOption = event.target.value;

    if (!isFormValid()) {
      await toast.error(
        "Completely fill the form and save the data before navigating",
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
      return;
    }

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
          {!isReviewAndIsSummary && <Back />}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
            }}
          >
            {!isReviewAndIsSummary && (
              <p style={{ marginRight: "10px", marginTop: "10px" }}>
                Navigate to
              </p>
            )}
            {!isReviewAndIsSummary && (
              <select
                style={{
                  border: "1px solid #000",
                  borderRadius: "5px",
                  padding: "5px",
                }}
                onChange={handleSelectChange}
              >
                <option selected>AcademicWork I</option>
                <option>AcademicWork II</option>
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

        {renderAcademicWorkPartAPage()}
      </MainContainer>
    </HomeMainContainer>
  );
};

export default AcademicWorkI;
