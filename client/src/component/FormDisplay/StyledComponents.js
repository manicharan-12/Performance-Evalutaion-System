import styled, { keyframes, css } from "styled-components";

export const DataContainer = styled.div`
  margin-top: 20px;

  section {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;

    h2 {
      margin-top: 0;
      font-size: 1.5em;
      color: #333;
    }

    pre {
      white-space: pre-wrap; /* Allows for line breaks and wrapping */
      word-wrap: break-word; /* Breaks long words */
    }
  }
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

export const SectionHeading = styled.h1`
  color: #721c24;
  font-size: 1.25em;
`;

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
`;