import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    margin-bottom: 0.4rem;
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

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({ name: '', email: '', password: '' });

  const navigate = useNavigate();

  // Basic email regex validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));

    // Real-time validation for each field
    if (id === 'email') {
      if (value.trim() === '') {
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
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} is required` : '',
      }));
    }
  };

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    !validationErrors.name &&
    !validationErrors.email &&
    !validationErrors.password;

  const handleSubmit = async () => {
    setError('');

    // Double-check before submitting
    if (!isFormValid) {
      setError('Please fill out all fields correctly');
      return;
    }

    try {
      const response = await fetch('http://localhost:3010/v0/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        const data = await response.json();
        console.log('Registration successful:', data);
        navigate('/login');
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
      <FadeIn>
        <RegisterBox>
          <h2>Register</h2>
          <RegisterForm>
            <input id="name" placeholder="Username" onChange={handleChange} />
            {validationErrors.name && <p>{validationErrors.name}</p>}

            <input id="password" placeholder="Password" type="password" onChange={handleChange} />
            {validationErrors.password && <p>{validationErrors.password}</p>}

            <input id="email" placeholder="Email" onChange={handleChange} />
            {validationErrors.email && <p>{validationErrors.email}</p>}
          </RegisterForm>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <SubmitButton onClick={handleSubmit} disabled={!isFormValid}>
            Submit
          </SubmitButton>
        </RegisterBox>
      </FadeIn>
    </BodyStyle>
  );
}

export default Register;
