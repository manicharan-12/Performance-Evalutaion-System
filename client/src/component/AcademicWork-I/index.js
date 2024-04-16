import Back from "../Back";
import CourseForm from "../CourseForm";
import Header from "../Header";
import {
  HeadingContainer,
  SectionHeading,
  MarksHeading,
  SubSectionHeading,
  MainContainer,
  HomeMainContainer,
  SubSectionHeadingContainer,
  InputElement,
  HorizontalLine,
} from "../Styling/StyledComponents";

const AcademicWorkI = () => {
  return (
    <HomeMainContainer>
      <Header />
      <MainContainer className="mt-5">
        <Back />
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
              placeholder="Year"
            />
          </SubSectionHeading>
        </SubSectionHeadingContainer>
        <CourseForm semester="Semester 1" />
        <HorizontalLine className="mt-5" />
        <CourseForm semester="Semester 2" />
      </MainContainer>
    </HomeMainContainer>
  );
};

export default AcademicWorkI;
