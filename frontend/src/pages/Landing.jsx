import { useState } from 'react'
import styled from "styled-components";

const Body = styled.div`
  background-color: var(--primary);
  position: relative;
`;

const Banner = styled.div`
  height: 10rem;
  width: 100vw;
  background-color: var(--secondary);
`;

function Landing() {
  return (
    <Body>
      <Banner>
        <h1>Landing Page</h1>
      </Banner>
    </Body>
  );
}

export default Landing;
