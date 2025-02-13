import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
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
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:3010/v0/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        const data = await response.json();
        console.log('Registration successful:', data);
        navigate('/login'); // Redirect to login after successful registration
      } else if (response.status === 400) {
        setError('User already exists');
      } else {
        setError('Unexpected error occurred');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to register');
    }
  };

  return (
    <BodyStyle>
      <RegisterBox>
        <h2>Register</h2>
        <RegisterForm>
          <input id="name" placeholder="Username" onChange={handleChange} />
          <input id="password" placeholder="Password" type="password" onChange={handleChange} />
          <input id="email" placeholder="School Email" onChange={handleChange} />
        </RegisterForm>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </RegisterBox>
    </BodyStyle>
  );
}

export default Register;
