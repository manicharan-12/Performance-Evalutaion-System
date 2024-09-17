import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import failureImage from "../Images/failure view.png";
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

const UserDetail = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [facultyId, setFacultyId] = useState();

  const navigate = useNavigate();

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
    navigate(`/review/user-details/?fac_id=${f_id}`)
  };
  return (
    <HomeMainContainer>
      <MainContainer>
        <h1>User Details</h1>
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
            </FormsList>
          ))}
        </FormsContainer>
      </MainContainer>
    </HomeMainContainer>
  );
};

export default UserDetail;
