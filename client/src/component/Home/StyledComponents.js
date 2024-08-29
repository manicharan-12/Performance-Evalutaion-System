import styled, { keyframes, css } from "styled-components";
import { GrClose } from "react-icons/gr";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

// Keyframes for the fadeOut animation
const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
`;

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
  min-height: 70vh;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const ModelContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  padding: 20px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  animation: ${(props) =>
    props.isClosing
      ? css`
          ${fadeOut} 0.5s ease-in-out
        `
      : css`
          ${fadeIn} 0.5s ease-in-out
        `};
`;

export const CloseButton = styled(GrClose)`
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

export const FormsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 55px;
  justify-content: center;
`;

export const FormsList = styled.div`
  width: 200px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  text-align: center;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  background: linear-gradient(to bottom right, #e4ecf8 10%, #fbfcff 30%);
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
`;

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

export const FormListButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 5px;
  justify-content: center;
  width: 100%;
`;

export const OptionButton = styled.button`
  background-color: transparent;
  border: 1px solid #000;
  border-radius: 4px;
  cursor: pointer;
  flex: 1 0 45%;
  margin: 2px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #fff;
    background-color: #000;
    transition: 0.5s ease-in-out;
    border: none;
  }
`;

export const NameText = styled.p`
  font-weight: bolder;
  font-size: 2.7vw;
`;

export const SearchBox = styled.input`
  border: 1px solid #000;
  border-radius: 2px;
  padding: 10px;
  width: 40%;
`;
