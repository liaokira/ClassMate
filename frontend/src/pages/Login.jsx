import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import FadeIn from 'react-fade-in';

const BodyStyle = styled.body`
  background-color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 12vh);
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

  > p {
    color: red;
    margin: 0 0 0.4rem 0;
    font-size: 0.9rem;
    text-align: center;
  }
`;

const SubmitButton = styled.button`
  margin-top: 1rem;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

const Text = styled.div`
  margin: 0.8rem;
  color: var(--text-2);
  text-decoration: underline;
`;

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Basic email regex validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Real-time validation
    if (id === 'email') {
      if (!value.trim()) {
        setValidationErrors((prev) => ({
          ...prev,
          email: 'Email is required',
        }));
      } else if (!validateEmail(value)) {
        setValidationErrors((prev) => ({
          ...prev,
          email: 'Invalid email format',
        }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          email: '',
        }));
      }
    } else if (id === 'password') {
      if (!value.trim()) {
        setValidationErrors((prev) => ({
          ...prev,
          password: 'Password is required',
        }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          password: '',
        }));
      }
    }
  };

  // Check if form is valid (all fields filled + no validation errors)
  const isFormValid =
    formData.email.trim() &&
    formData.password.trim() &&
    !validationErrors.email &&
    !validationErrors.password;

  const handleSubmit = async () => {
    setError('');

    // If form isn't valid, show an error and skip the request
    if (!isFormValid) {
      setError('Please fix all errors before submitting');
      return;
    }

    try {
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
      <FadeIn>
        <RegisterBox>
          <h2>Login</h2>
          <RegisterForm>
            <input
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
            />
            {validationErrors.email && <p>{validationErrors.email}</p>}

            <input
              type="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
            />
            {validationErrors.password && <p>{validationErrors.password}</p>}
          </RegisterForm>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <SubmitButton onClick={handleSubmit} disabled={!isFormValid}>
            Submit
          </SubmitButton>

          <Link to="/register">
            <Text>Don't have an account?</Text>
          </Link>
        </RegisterBox>
      </FadeIn>
    </BodyStyle>
  );
}

export default Login;
