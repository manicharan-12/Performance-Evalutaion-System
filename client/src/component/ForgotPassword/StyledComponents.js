import { styled } from "styled-components";

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

export const ErrorMessage = styled.p`
  color: #ff3333;
  font-weight: Bolder;
`;

export const FormHeading = styled.h3`
  font-weight: 500;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const InputElement = styled.input``;

export const LabelElement = styled.label``;

export const LoginForm = styled.form`
  width: 30%;
  padding: 32px;
  min-height: 381px;
  border-radius: 5px;
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

export const LoginRegisterButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
