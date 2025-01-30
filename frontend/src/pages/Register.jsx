import { useState, useEffect } from 'react'
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

function Register() {
  return (
    <BodyStyle>
      <RegisterBox>
        <h2>Register</h2>
        <RegisterForm>
          <input id="user" placeholder="Username" />
          <input id="password" placeholder="Password" />
          <input id="schoolemail" placeholder="School Email" />
        </RegisterForm>
        <SubmitButton>Submit</SubmitButton>
      </RegisterBox>
    </BodyStyle>
  );
}

export default Register;
