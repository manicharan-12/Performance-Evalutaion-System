import React, { useEffect, useState } from 'react'
import { 
    DataContainer,
    LoaderContainer,
    FailureImage,
    FailureContainer,
    SectionHeading,

} from './StyledComponents'
import { useSearchParams } from 'react-router-dom';
import { ThreeDots } from "react-loader-spinner";
import failureImage from "../Images/failure view.png";
import axios from 'axios';



const FormDisplay = () => {
    const [formId, setFormId] = useState();
    const [formData, setFormData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const getFacultyId = async () => {
          try {
            const id = searchParams.get("f_id"); // No need for await as searchParams.get() is synchronous
            setFormId(id); // Set the retrieved ID in the state
          } catch (error) {
            console.error("Error fetching faculty ID", error);
          }
        };
    
        getFacultyId();
      }, [searchParams]);

    useEffect(() => {
      const getFormData = async () =>{
        if (!formData) return; // Ensure facultyId is available before making the API call

        try {
          const response = await axios.get(
            `http://localhost:6969/faculty/${formId}`
          );
          setFormData(response.data); // Set the fetched data in state
          setLoading(false);
        } catch (err) {
          console.log(err)
          setError(err.message);
          setLoading(false);
        }
        finally{
            setLoading(false)
        }
      }
    
      getFormData();
    }, [formData, formId])
    



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



  return (
    <div>
         <DataContainer>
        {/* Display academic work part A */}
        <section>
          <h2>Academic Work Part A</h2>
          <pre>{JSON.stringify(formData.academicWorkPartA, null, 2)}</pre>
        </section>

        {/* Display academic work part B */}
        <section>
          <h2>Academic Work Part B</h2>
          <pre>{JSON.stringify(formData.academicWorkPartB, null, 2)}</pre>
        </section>

        {/* Display research and development part B */}
        <section>
          <h2>Research and Development Part B</h2>
          <pre>{JSON.stringify(formData.researchAndDevelopmentPartB, null, 2)}</pre>
        </section>

        {/* Display research and development part C */}
        <section>
          <h2>Research and Development Part C</h2>
          <pre>{JSON.stringify(formData.researchAndDevelopmentPartC, null, 2)}</pre>
        </section>

        {/* Display research and development part D */}
        <section>
          <h2>Research and Development Part D</h2>
          <pre>{JSON.stringify(formData.researchAndDevelopmentPartD, null, 2)}</pre>
        </section>

        {/* Display PhD confirmation */}
        <section>
          <h2>PhD Confirmation</h2>
          <pre>{JSON.stringify(formData.phdConformation, null, 2)}</pre>
        </section>

        {/* Display API Score */}
        <section>
          <h2>API Score</h2>
          <pre>{JSON.stringify(formData.apiScore, null, 2)}</pre>
        </section>

        {/* Display Contribution to Department */}
        <section>
          <h2>Contribution to Department</h2>
          <pre>{JSON.stringify(formData.contributionToDepartment, null, 2)}</pre>
        </section>

        {/* Display Contribution to Society */}
        <section>
          <h2>Contribution to Society</h2>
          <pre>{JSON.stringify(formData.contributionToSociety, null, 2)}</pre>
        </section>

        {/* Display Contribution to University/School */}
        <section>
          <h2>Contribution to University/School</h2>
          <pre>
            {JSON.stringify(formData.contributionToUniversitySchool, null, 2)}
          </pre>
        </section>
      </DataContainer>
    </div>
  )
}

export default FormDisplay