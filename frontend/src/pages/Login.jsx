import { useState } from 'react'
import { Link } from "react-router-dom";
import styled from "styled-components";

const BodyStyle = styled.body`
  background-color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  height:calc(100vh - 6rem);
`;

const RegisterBox = styled.div`
  text-align: center;
  width: 20rem;
  background-color: var(--primary);
  border: 3px solid var(--tertiary);
  border-radius: 2rem;
  padding: 0 2rem 2rem;
`;

const RegisterForm = styled.div`
  width: 100%;

  > input {
    margin-bottom: 0.8rem;
  }
`;

const SubmitButton = styled.button`
  margin-top: 1rem;
`;

const Text = styled.div`
  margin:.8rem;
  color:var(--text-2);
  text-decoration: underline;
`;

function Login() {
  return (
    <BodyStyle>
      <RegisterBox>
        <h2>Login</h2>
        <RegisterForm>
          <input id="schoolemail" placeholder="School Email" />
          <input id="password" placeholder="Password" />
        </RegisterForm>
        <SubmitButton>Submit</SubmitButton>
        <Link to="/register">
          <Text>Don't have an account?</Text>
        </Link>
      </RegisterBox>
    </BodyStyle>
  );
}

export default Login;