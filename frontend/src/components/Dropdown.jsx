import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 5px;
  background-color: var(--primary);
  border-radius: 5px;
  margin-top: 5px;
  z-index: 10;
  width: 100px;
  border: 3px solid var(--tertiary);
  display: ${(props) => (props.$visible ? "block" : "none")};
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: var(--secondary);
  }
`;

export default function Dropdown() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <DropdownContainer>
        <button onClick={toggleMenu}>
            Menu
        </button>
      <DropdownMenu $visible={isVisible}>
        <Link to="/groups">
            <DropdownItem onClick={toggleMenu}>Groups</DropdownItem>
        </Link>
        <Link to="/profile">
            <DropdownItem onClick={toggleMenu}>My Profile</DropdownItem>
        </Link>
        <Link to="/logout">
            <DropdownItem onClick={toggleMenu}>Log out</DropdownItem>
        </Link>
      </DropdownMenu>
    </DropdownContainer>
  );
}
