import AcademicWorkI from "../AcademicWork-I/Part A";
import AcademicWorkII from "../AcademicWork-I/Part B";
import ContributionToDepartment from "../ContributionToDepartment";
import ContributionToSociety from "../ContributionToSociety";
import ContributionToUniversity from "../ContributionToUniversitySchool";
import Conformation from "../ResearchAndDevelopment/Conformation";
import RDPartA from "../ResearchAndDevelopment/PartA";
import RDPartB from "../ResearchAndDevelopment/PartB";
import RDPartC from "../ResearchAndDevelopment/PartC";
import RDPartD from "../ResearchAndDevelopment/PartD";

const Review = () => {
  return (
    <>
      <h2 style={{ marginTop: "2rem", marginBottom: "0", paddingLeft: "20px" }}>
        Review Your data before submitting
      </h2>
      <AcademicWorkI />
      <AcademicWorkII />
      <Conformation />
      <RDPartA />
      <RDPartB />
      <RDPartC />
      <RDPartD />
      <ContributionToUniversity />
      <ContributionToDepartment />
      <ContributionToSociety />
    </>
  );
};

export default Review;
