import React, { useEffect, useState, useCallback } from "react";
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
import Conformation from "../ResearchAndDevelopment/Conformation";
import RDPartA from "../ResearchAndDevelopment/PartA";

const FormDetails = () => {
  const [searchParams] = useSearchParams();
  const [formId, setFormId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiScores, setApiScores] = useState({});
  const [reviewerApiScores, setReviewerApiScores] = useState({});

  const getFormData = useCallback(async (id) => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:6969/faculty/forms/${id}`
      );

      setFormData(response.data);

      if (response.data && response.data.apiScore) {
        setApiScores(response.data.apiScore.apiScores || {});
        setReviewerApiScores(response.data.apiScore.reviewerApiScores || {});
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = searchParams.get("f_id");
    setFormId(id);
    getFormData(id);
  }, [searchParams, getFormData]);

  const updateReviewerApiScores = (newScores) => {
    setReviewerApiScores((prevScores) => ({ ...prevScores, ...newScores }));
  };

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
      <pre>{JSON.stringify(formData.apiScore, null, 2)}</pre>
      <DataContainer>
        {/* <section> */}
          <AcademicWorkI
            data={formData.academicWorkPartA}
            reviewerApiScores={reviewerApiScores}
            updateReviewerApiScores={updateReviewerApiScores}
          />
        {/* </section>
        <section> */}
          <AcademicWorkII
            data={formData.academicWorkPartB}
            reviewerApiScores={reviewerApiScores}
            updateReviewerApiScores={updateReviewerApiScores}
          />
        {/* </section>
        <section> */}
          <Conformation data={formData.phdConformation} />
        {/* </section>
        <section> */}
          {/* <pre>
            {JSON.stringify(formData.researchAndDevelopmentPartA, null, 2)}
          </pre> */}
          <RDPartA
            data={formData.researchAndDevelopmentPartA}
            reviewerApiScores={reviewerApiScores}
            updateReviewerApiScores={updateReviewerApiScores}
          />
        {/* </section>
        <section> */}
          <RDPartB
            data={formData.researchAndDevelopmentPartB}
            reviewerApiScores={reviewerApiScores}
            updateReviewerApiScores={updateReviewerApiScores}
          />
        {/* </section>
        <section> */}
          <RDPartC
            data={formData.researchAndDevelopmentPartC}
            reviewerApiScores={reviewerApiScores}
            updateReviewerApiScores={updateReviewerApiScores}
          />
        {/* </section>
        <section> */}
          <RDPartD
            data={formData.researchAndDevelopmentPartD}
            reviewerApiScores={reviewerApiScores}
            updateReviewerApiScores={updateReviewerApiScores}
          />
        {/* </section>
        <section> */}
          <ContributionToUniversity
            data={formData.contributionToUniversitySchool}
            reviewerApiScores={reviewerApiScores}
            updateReviewerApiScores={updateReviewerApiScores}
          />
        {/* </section>
        <section> */}
          <ContributionToDepartment
            data={formData.contributionToDepartment}
            reviewerApiScores={reviewerApiScores}
            updateReviewerApiScores={updateReviewerApiScores}
          />
        {/* </section>
        <section> */}
          <ContributionToSociety
            data={formData.contributionToSociety}
            reviewerApiScores={reviewerApiScores}
            updateReviewerApiScores={updateReviewerApiScores}
          />
        {/* </section>
        <section> */}
          <AssessmentOfFunctionalHead
            reviewerApiScores={reviewerApiScores}
            updateReviewerApiScores={updateReviewerApiScores}
          />
        {/* </section>
        <section> */}
          <ApiScoreSummary
            apiScores={apiScores}
            reviewerApiScores={reviewerApiScores}
          />
        {/* </section> */}
      </DataContainer>
    </div>
  );
};

export default FormDetails;
