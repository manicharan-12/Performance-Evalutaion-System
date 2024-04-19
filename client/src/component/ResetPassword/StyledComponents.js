import { styled } from "styled-components";

export const ErrorMessage = styled.p`
  color: #ff3333;
  font-weight: Bolder;
`;

export const ExpiredImage = styled.img`
  display: flex;
  flex-direction: column;
  width: 20%;
`;

export const ExpiredMessage = styled.p``;

export const ExpiredTokenContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
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

export const ResetPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  width: 100%;
`;
