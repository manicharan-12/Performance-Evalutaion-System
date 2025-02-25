import styled from "styled-components";

export const TableInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid #ccc;
  display: block;
`;

export const MainContainer = styled.div`
  position: relative;
`;

export const InputVal = styled.div`
  cursor: pointer;
`;

export const ErrMsg = styled.div`
  visibility: visible;
  width: 120px;
  background-color: black;
  color: white;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 5px;

  &::before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent black transparent;
  }
`;
