import styled from "styled-components";

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
  min-height: 350px;
  border-radius: 5px;
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

export const BackButtonContainer = styled.div`
  padding: 32px;
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
