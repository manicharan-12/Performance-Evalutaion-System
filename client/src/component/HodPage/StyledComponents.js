import styled from 'styled-components';

export const TeacherCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const TeacherCard = styled.div`
  height: 180px;
  width: 200px;
  background-color: #f0f0f0;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  &:hover {
    background-color: #e0e0e0;
  }
`;
