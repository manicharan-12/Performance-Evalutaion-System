import { styled } from "styled-components";

export const HeadingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const HomeMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const InputContainerMain = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const LabelElement = styled.label``;

export const InputElement = styled.input``;

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

export const SaveNextButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
export const SaveNextButton = styled.button``;

export const SectionHeading = styled.h4``;

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

export const SubSectionHeading = styled.h5``;

export const ErrorMessage = styled.p`
  color: #ff3333;
  font-weight: Bolder;
`;
