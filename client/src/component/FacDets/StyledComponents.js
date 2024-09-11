// StyledComponents.js

import styled from 'styled-components';

// Container for the main content
export const MainContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

// Container for the data sections
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

// Container for the loading spinner
export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// Container for failure messages
export const FailureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f8d7da;
  border-radius: 5px;
  border: 1px solid #f5c6cb;
`;

export const FailureImage = styled.img`
  width: 80px;
  height: 80px;
`;

export const SectionHeading = styled.h1`
  color: #721c24;
  font-size: 1.25em;
`;

