import { styled } from "styled-components";

export const HeadingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SectionHeading = styled.h4``;

export const MarksHeading = styled.h4``;

export const SubSectionHeading = styled.h5``;

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

export const HomeMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SubSectionHeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

export const InputElement = styled.input``;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;
export const TableMainHead = styled.thead``;

export const TableBody = styled.tbody``;

export const TableHead = styled.th`
  text-align: left;
  padding: 8px;
  border: 1px solid #ddd;
  word-wrap: break-word;
  text-align: center;
  white-space: normal;
`;

export const TableData = styled.td`
  text-align: left;
  padding: 8px;
  border: 1px solid #ddd;
  word-wrap: break-word;
  text-align: center;
  white-space: normal;
`;

export const TableRow = styled.tr``;

export const SpanEle = styled.span``;

export const SaveNextButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`;
export const SaveNextButton = styled.button``;

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
