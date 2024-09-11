// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { ThreeDots } from 'react-loader-spinner';
// import failureImage from '../Images/failure view.png';
// import {
//     LoaderContainer,
//     FailureContainer,
//     FailureImage,
//     MainContainer,
//     DataContainer,
//     SectionHeading
// } from './StyledComponents'; // Adjust the path to your styled components

// const UserDetail = ({userId}) => {
//     // const { userId } = useParams(); // Get userId from route params
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5000/user/${userId}`);
//                 console.log(response.data);
//                 setData(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.message);
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [userId]);

//     if (loading) {
//         return (
//             <LoaderContainer>
//                 <ThreeDots
//                     visible={true}
//                     height="50"
//                     width="50"
//                     color="#0b69ff"
//                     radius="9"
//                     ariaLabel="three-dots-loading"
//                 />
//             </LoaderContainer>
//         );
//     }

//     if (error) {
//         return (
//             <FailureContainer>
//                 <FailureImage src={failureImage} alt="Failure" />
//                 <SectionHeading>Failed to load data. Please try again later.</SectionHeading>
//             </FailureContainer>
//         );
//     }

//     if (!data) {
//         return <SectionHeading>No data found.</SectionHeading>;
//     }

//     return (
//         <MainContainer>
//             <h1>User Details</h1>
//             <DataContainer>
//                 {/* Display academic work part A */}
//                 <section>
//                     <h2>Academic Work Part A</h2>
//                     <pre>{JSON.stringify(data.academicWorkPartA, null, 2)}</pre>
//                 </section>

//                 {/* Display academic work part B */}
//                 <section>
//                     <h2>Academic Work Part B</h2>
//                     <pre>{JSON.stringify(data.academicWorkPartB, null, 2)}</pre>
//                 </section>

//                 {/* Display research and development part B */}
//                 <section>
//                     <h2>Research and Development Part B</h2>
//                     <pre>{JSON.stringify(data.researchAndDevelopmentPartB, null, 2)}</pre>
//                 </section>

//                 {/* Display research and development part C */}
//                 <section>
//                     <h2>Research and Development Part C</h2>
//                     <pre>{JSON.stringify(data.researchAndDevelopmentPartC, null, 2)}</pre>
//                 </section>

//                 {/* Display research and development part D */}
//                 <section>
//                     <h2>Research and Development Part D</h2>
//                     <pre>{JSON.stringify(data.researchAndDevelopmentPartD, null, 2)}</pre>
//                 </section>

//                 {/* Display PhD confirmation */}
//                 <section>
//                     <h2>PhD Confirmation</h2>
//                     <pre>{JSON.stringify(data.phdConformation, null, 2)}</pre>
//                 </section>

//                 {/* Display API Score */}
//                 <section>
//                     <h2>API Score</h2>
//                     <pre>{JSON.stringify(data.apiScore, null, 2)}</pre>
//                 </section>

//                 {/* Display Contribution to Department */}
//                 <section>
//                     <h2>Contribution to Department</h2>
//                     <pre>{JSON.stringify(data.contributionToDepartment, null, 2)}</pre>
//                 </section>

//                 {/* Display Contribution to Society */}
//                 <section>
//                     <h2>Contribution to Society</h2>
//                     <pre>{JSON.stringify(data.contributionToSociety, null, 2)}</pre>
//                 </section>

//                 {/* Display Contribution to University/School */}
//                 <section>
//                     <h2>Contribution to University/School</h2>
//                     <pre>{JSON.stringify(data.contributionToUniversitySchool, null, 2)}</pre>
//                 </section>
//             </DataContainer>
//         </MainContainer>
//     );
// };

// export default UserDetail;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import failureImage from "../Images/failure view.png";
import {
  LoaderContainer,
  FailureContainer,
  FailureImage,
  MainContainer,
  DataContainer,
  SectionHeading,
} from "./StyledComponents"; // Adjust the path to your styled components

const UserDetail = () => {
  const { userId } = useParams(); // Get userId from route params
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/user/${userId}`
        );
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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

  if (!data) {
    return <SectionHeading>No data found.</SectionHeading>;
  }

  return (
    <MainContainer>
      <h1>User Details</h1>
      <DataContainer>
        {/* Display academic work part A */}
        <section>
          <h2>Academic Work Part A</h2>
          <pre>{JSON.stringify(data.academicWorkPartA, null, 2)}</pre>
        </section>

        {/* Display academic work part B */}
        <section>
          <h2>Academic Work Part B</h2>
          <pre>{JSON.stringify(data.academicWorkPartB, null, 2)}</pre>
        </section>

        {/* Display research and development part B */}
        <section>
          <h2>Research and Development Part B</h2>
          <pre>{JSON.stringify(data.researchAndDevelopmentPartB, null, 2)}</pre>
        </section>

        {/* Display research and development part C */}
        <section>
          <h2>Research and Development Part C</h2>
          <pre>{JSON.stringify(data.researchAndDevelopmentPartC, null, 2)}</pre>
        </section>

        {/* Display research and development part D */}
        <section>
          <h2>Research and Development Part D</h2>
          <pre>{JSON.stringify(data.researchAndDevelopmentPartD, null, 2)}</pre>
        </section>

        {/* Display PhD confirmation */}
        <section>
          <h2>PhD Confirmation</h2>
          <pre>{JSON.stringify(data.phdConformation, null, 2)}</pre>
        </section>

        {/* Display API Score */}
        <section>
          <h2>API Score</h2>
          <pre>{JSON.stringify(data.apiScore, null, 2)}</pre>
        </section>

        {/* Display Contribution to Department */}
        <section>
          <h2>Contribution to Department</h2>
          <pre>{JSON.stringify(data.contributionToDepartment, null, 2)}</pre>
        </section>

        {/* Display Contribution to Society */}
        <section>
          <h2>Contribution to Society</h2>
          <pre>{JSON.stringify(data.contributionToSociety, null, 2)}</pre>
        </section>

        {/* Display Contribution to University/School */}
        <section>
          <h2>Contribution to University/School</h2>
          <pre>
            {JSON.stringify(data.contributionToUniversitySchool, null, 2)}
          </pre>
        </section>
      </DataContainer>
    </MainContainer>
  );
};

export default UserDetail;
