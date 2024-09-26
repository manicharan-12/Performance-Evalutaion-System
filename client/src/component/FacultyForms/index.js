import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import failureImage from "../Images/failure view.png";
import Back from "../Back";
import {
  LoaderContainer,
  FailureContainer,
  FailureImage,
  MainContainer,
  FormsList,
  SubSectionHeading,
  FormListButtonContainer,
  OptionButton,
  SectionHeading,
  FormsContainer,
  HomeMainContainer,
} from "./StyledComponents"; // Adjust the path to your styled components
import "./UserDetail.css";

const UserDetail = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [facultyId, setFacultyId] = useState();
  const [facultyName, setFacultyName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const isSummaryPath =
    location.pathname.startsWith("/summary") ||
    location.pathname.startsWith("/review");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const getFacultyId = await searchParams.get("fac_id");
  //       setFacultyId(getFacultyId);
  //     } catch (error) {}
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:6969/faculty/${facultyId}`
  //       );

  //       console.log(response.data);
  //       setData(response.data);
  //       setLoading(false);
  //     } catch (err) {
  //       setError(err.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // First useEffect: To get and set facultyId
  useEffect(() => {
    const getFacultyId = async () => {
      try {
        const id = searchParams.get("fac_id"); // No need for await as searchParams.get() is synchronous
        setFacultyId(id); // Set the retrieved ID in the state
      } catch (error) {
        console.error("Error fetching faculty ID", error);
      }
    };

    getFacultyId();
  }, [searchParams]);

  // Second useEffect: To fetch data after facultyId is set
  useEffect(() => {
    const fetchData = async () => {
      if (!facultyId) return; // Ensure facultyId is available before making the API call

      try {
        const response = await axios.get(
          `http://localhost:6969/faculty/${facultyId}`
        );
        // console.log(response.data);
        setFormData(response.data); // Set the fetched data in state
        setFacultyName(response.data.facultyName); // Set the faculty name
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [facultyId]); // Run this effect when facultyId changes

  if (loading) {
    return (
      <LoaderContainer>
        <ThreeDots
          visible={true}
          height="50"
          width="50"
          color="#0b69ff"
          radius="9"
          ariaLabel="three-dots-loading"
        />
      </LoaderContainer>
    );
  }

  if (error) {
    return (
      <FailureContainer>
        <FailureImage src={failureImage} alt="Failure" />
        <SectionHeading>
          Failed to load data. Please try again later.
        </SectionHeading>
      </FailureContainer>
    );
  }

  if (!formData) {
    return <SectionHeading>No data found.</SectionHeading>;
  }

  const handleFormClick = (f_id) => {
    navigate(`/review/user-details/?fac_id=${facultyId}&f_id=${f_id}`);
  };
  return (
    <HomeMainContainer>
      <MainContainer>
        {!isSummaryPath && <Back />}
        <h1>List of Forms</h1>
        <h4>Faculty: {facultyId}</h4>
        <FormsContainer>
          {formData.map((eachForm) => (
            <FormsList key={eachForm._id}>
              <SubSectionHeading
                onClick={() => handleFormClick(eachForm._id)}
                style={{
                  cursor: "pointer",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap, nowrap",
                  overflow: "hidden",
                  textAlign: "center",
                  width: "100%",
                  textOverflow: "ellipsis",
                }}
              >
                {eachForm.formName}
              </SubSectionHeading>
              <div className="icon-buttons-container">
                <button
                  className="icon-button"
                  onClick={() => handleFormClick(eachForm._id)}
                  aria-label="Edit"
                >
                  <i
                    class="fa-solid fa-pen-to-square"
                    style={{ fontSize: "25px" }}
                  ></i>
                </button>
                <button
                  className="icon-button"
                  onClick={() => handleFormClick(eachForm._id)}
                  aria-label="Print"
                >
                  <i class="fa-solid fa-print" style={{ fontSize: "25px" }}></i>
                </button>
              </div>
            </FormsList>
          ))}
        </FormsContainer>
      </MainContainer>
    </HomeMainContainer>
  );
};

export default UserDetail;
