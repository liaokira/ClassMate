import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
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

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError('');
      console.log('Sending request to login with:', formData);
  
      const response = await fetch('http://localhost:3010/v0/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      console.log('Response status:', response.status);
  
      if (response.status === 200) {
        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('accessToken', data.accessToken);
        setIsAuthenticated(true);
        navigate('/profile');
      } else if (response.status === 401) {
        console.log('Invalid credentials');
        setError('Invalid email or password');
      } else {
        console.log('Unexpected error');
        setError('An unexpected error occurred');
      }
    } catch (err) {
      console.error('Error occurred:', err);
      setError('Failed to connect to the server');
    }
  };
  

  return (
    <BodyStyle>
      <RegisterBox>
        <h2>Login</h2>
        <RegisterForm>
          <input 
            type="email" 
            id="email" 
            placeholder="School Email" 
            onChange={handleChange} 
          />
          <input 
            type="password" 
            id="password" 
            placeholder="Password" 
            onChange={handleChange} 
          />
        </RegisterForm>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        <Link to="/register">
          <Text>Don't have an account?</Text>
        </Link>
      </RegisterBox>
    </BodyStyle>
  );
}

export default Login;
