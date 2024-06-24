import styled from "styled-components";
import { RiAccountCircleLine } from "react-icons/ri";

export const LoginButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative; /* Ensure dropdown aligns correctly */
`;

export const MainNavContainer = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  position: relative;
`;

export const NavImage = styled.img`
  width: auto;
  height: 77px;
  cursor: pointer;
`;

export const ProfileButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const ProfileIcon = styled(RiAccountCircleLine)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  z-index: 1000;
`;

export const DropdownList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const DropdownItem = styled.li`
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;
