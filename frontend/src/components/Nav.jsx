import { useState } from 'react'
import { Link } from "react-router-dom";
import logo from '../assets/react.svg';
import styled from "styled-components"

const Navbar = styled.div`
  width: 100vw;
  background-color: var(--primary);
  border-bottom: 3px solid var(--tertiary);
  position: fixed;
  height: 6rem;
  top: 0px;
  left: 0px;
  z-index: 100;
`;

const InnerNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1em;
  padding-right: 1em;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  & > * {
    padding-left: 0.5em;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  & > div {
    padding-right: 0.5em;
  }
`;

const Text = styled.div`
  font-size: 1rem;
  color: var(--text-2);
`;

function Nav() {
  return (
    <Navbar>
      <InnerNav>
        <Left>
          <img src={logo} alt="Logo" />
          <Link to="/">
            <h2>ClassMate</h2>
          </Link>
        </Left>
        <Right>
          <Text>Already have an account?</Text>
          <Link to="/login">
            <button>Log In</button>
          </Link>
        </Right>
      </InnerNav>
    </Navbar>
  );
}

export default Nav