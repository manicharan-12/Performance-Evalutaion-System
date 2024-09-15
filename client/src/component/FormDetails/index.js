import React, { useEffect, useState } from "react";
import {
  DataContainer,
  LoaderContainer,
  FailureImage,
  FailureContainer,
  SectionHeading,
} from "./StyledComponents";
import { useSearchParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import failureImage from "../Images/failure view.png";
import axios from "axios";
import AcademicWorkI from "../AcademicWork-I/Part A";
import AcademicWorkII from "../AcademicWork-I/Part B";
import RDPartB from "../ResearchAndDevelopment/PartB";
import RDPartC from "../ResearchAndDevelopment/PartC";
import RDPartD from "../ResearchAndDevelopment/PartD";
import ContributionToDepartment from "../ContributionToDepartment";
import ContributionToSociety from "../ContributionToSociety";
import ContributionToUniversity from "../ContributionToUniversitySchool";
import ApiScoreSummary from "../ApiScoreSummary";
import AssessmentOfFunctionalHead from "../AssessmentOfFunctionalHead";

const FormDetails = () => {
  const [formId, setFormId] = useState();
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const getFacultyId = () => {
      const id = searchParams.get("fac_id");
      setFormId(id);
    };

    getFacultyId();
  }, [searchParams]);

  useEffect(() => {
    console.log(formId);

    const getFormData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:6969/faculty/forms/${formId}`
        );
        console.log(response.data);

        setFormData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      getFormData();
    }
  }, [formId]);

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
        <section>
          <AcademicWorkI data={formData.academicWorkPartA} />
        </section>
        <section>
          <AcademicWorkII data={formData.academicWorkPartB} />
        </section>
        <section>
          <h2>PhD Confirmation</h2>
          <pre>{JSON.stringify(formData?.phdConformation, null, 2)}</pre>
        </section>
        <section>
          <RDPartB data={formData.researchAndDevelopmentPartB} />
        </section>
        <section>
          <RDPartC data={formData.researchAndDevelopmentPartC} />
        </section>
        <section>
          <RDPartD data={formData.researchAndDevelopmentPartD} />
        </section>
        <section>
          <ContributionToDepartment data={formData.contributionToDepartment} />
        </section>
        <section>
          <ContributionToSociety data={formData.contributionToSociety} />
        </section>
        <section>
          <ContributionToUniversity data={formData.contributionToUniversitySchool}/>
        </section>
        <section>
          <h2>API Score</h2>
          <pre>{JSON.stringify(formData?.apiScore, null, 2)}</pre>
          <ApiScoreSummary data={formData.apiScore}/>
        </section>
        <section>
            <AssessmentOfFunctionalHead/>
        </section>
      </DataContainer>
    </div>
  );
};

export default FormDetails;
