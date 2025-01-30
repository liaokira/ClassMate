import { useState } from 'react'
import { Link } from "react-router-dom";
import styled from "styled-components";

const Body = styled.div`
  background-color: var(--primary);
  position: relative;
`;

const Banner = styled.div`
  height: 18rem;
  width: 100vw;
  background-color: var(--secondary);
`;

const BelowBanner = styled.div`
  display: flex;
  align-items: center;
  align-text: center;
  justify-content: space-between;
  padding-top: 2em;
  padding-left: 3em;
  padding-right: 3em;
`;

const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 3em;
  padding-right: 4em;
  padding-top: 3em;
`;

const Left = styled.div`
  height: 100%;
  width: 40%;

  & > * {
    padding-left: 0.5em;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%

  & > div {
    padding-right: 0.5em;
  }
`;

const Head1 = styled.h2`
  text-decoration: bold;
  text-wrap: wrap;
`;

const Text = styled.div`
  width: 80%;
  padding-left: 1.1em;
`;

const RegBox = styled.div`
  width: 50%;
  align-items: center;
  text-align: center;
  background-color: var(--primary);
  border: 3px solid var(--tertiary);
  border-radius: 2rem;
  padding: 0rem 1rem 1.5rem;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  margin-top: 1rem;
`;

const FeatureBox = styled.div`
  width: 25%;
  align-items: center;
  text-align: center;
  background-color: var(--primary);
  border: 3px solid var(--tertiary);
  border-radius: 2rem;
  padding: 0rem 1rem 1.5rem;
  margin-top: 1rem;
`;

function Landing() {
  return (
    <Body>
      <Banner>
        <Inner>
          <Left>
            <Head1>
              Want to find study buddies? 
              Let's make it happen!
            </Head1>
            <Text>
              ClassMate is a networking app 
              that connects you to people in 
              the same classes as you.
            </Text>
          </Left>
          <RegBox>
            <h2>New to ClassMate? Get started here!</h2>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </RegBox>
        </Inner>
      </Banner>
      <BelowBanner>
        <FeatureBox>
          <h2>
            Feature 1
          </h2>
            Description 1
        </FeatureBox>
        <FeatureBox>
          <h2>
            Feature 2
          </h2>
          Description 2
        </FeatureBox>
        <FeatureBox>
          <h2>
            Feature 3
          </h2>
          Description 3
        </FeatureBox>
      </BelowBanner>
    </Body>
  );
}

export default Landing;
