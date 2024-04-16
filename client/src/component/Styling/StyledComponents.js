import { styled, createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
body{
  font-family: "Poppins";
}
`;

export const SmallDeviceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

export const SmallDeviceImageContainer = styled.div`
  width: 60%;
`;

export const SmallDeviceImage = styled.img`
  width: 100%;
`;
export const TextContent = styled.h6``;

export const MainContainerLoginRegister = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

export const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: fit-content;
  width: 100%;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
`;

export const NavImage = styled.img`
  width: auto;
  height: 77px;
`;

export const ContainerLoginRegister = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 70vh;
`;

export const LoginForm = styled.form`
  width: 30%;
  padding: 32px;
  min-height: 381px;
  border-radius: 5px;
`;

export const FormHeading = styled.h3`
  font-weight: 500;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const LabelElement = styled.label``;

export const InputElement = styled.input``;

export const LoginButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LoginRegisterButton = styled.button`
  width: 100%;
  padding: 6px;
  border-radius: 8px;
  background-image: linear-gradient(127deg, #c02633 -40%, #233659 100%);
  border: none;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ErrorMessage = styled.p`
  color: #ff3333;
  font-weight: Bolder;
`;

export const LoginRegisterButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const HyperLinkButton = styled.button`
  background-color: #fff;
  border: none;
`;

export const SpanElement = styled.span`
  color: blue;
  text-decoration: underline;
`;

export const BackButtonContainer = styled.div`
  width: 100%;
`;

export const BackButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
  outline: none;
  background: transparent;
  border: none;
  font-size: 18px;
`;

export const SelectInput = styled.select``;

export const OptionInput = styled.option``;

export const UsernamePasswordErrMsg = styled.p`
  font-weight: bolder;
`;

export const ResetPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  width: 100%;
`;

export const ExpiredTokenContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const ExpiredImage = styled.img`
  display: flex;
  flex-direction: column;
  width: 20%;
`;

export const ExpiredMessage = styled.p``;

export const MainNavContainer = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export const LogoutButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const LogoutButton = styled.button``;

export const HomeMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const MainContainer = styled.div`
  width: 90%;
  padding: 32px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ProfileForm = styled.form`
  width: 80%;
`;

export const InputContainerMain = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SaveNextButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
export const SaveNextButton = styled.button``;

export const HeadingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SectionHeading = styled.h4``;

export const MarksHeading = styled.h4``;

export const SubSectionHeading = styled.h5``;

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
`;

export const FailureContainer = styled.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const FailureImage = styled.img`
  width: 25%;
`;

export const SubSectionHeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

export const CourseContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const CourseFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
`;

export const CourseHeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
`;

export const HorizontalLine = styled.hr`
  border: 1px solid #000;
  width: 100%;
`;
