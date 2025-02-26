import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const BodyStyle = styled.body`
  background-color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  height:calc(100vh - 12vh);
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

const colors = ["red", "yellow", "green", "blue", "purple"];

const colordict = {
  red: {
    normal: "#D27D7D",  // Desaturated red
    dark: "#A35F5F",    // Darker, more neutral red
  },
  yellow: {
    normal: "#D1B37C",  // Desaturated yellow
    dark: "#A78D62",    // Darker, more neutral yellow
  },
  green: {
    normal: "#7DAF89",  // Desaturated green
    dark: "#5E8A6A",    // Darker, more neutral green
  },
  blue: {
    normal: "#7D9ABD",  // Desaturated blue
    dark: "#5F7991",    // Darker, more neutral blue
  },
  purple: {
    normal: "#9F7DAF",  // Desaturated purple
    dark: "#7A5F86",    // Darker, more neutral purple
  }
}

const ColorPickerWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const ColorCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => colordict[props.color]['normal']};
  border: ${(props) => (props.selected ? "3px solid " + colordict[props.color]['dark'] : "3px solid transparent")};
  cursor: pointer;
  transition: border 0.1s ease-in;
`;

function GroupCreate() {
    const [selectedColor, setSelectedColor] = useState('red');
    const [formData, setFormData] = useState({ group: "", bio: "" });
  
    const handleSelect = (color) => {
      setSelectedColor(color);
    };
  
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
        <h2>Create Group</h2>
        <ColorPickerWrapper>
        {colors.map((color) => (
          <ColorCircle
            key={color}
            color={color}
            selected={selectedColor === color}
            onClick={() => handleSelect(color)}
          />
        ))}
      </ColorPickerWrapper>
      <input id="group" placeholder="Group name" onChange={handleChange} />
      <input id="groupclass" placeholder="Class" onChange={handleChange} />
      <textarea id="bio" placeholder="Group description (Optional)" onChange={handleChange} />
      <button onClick={handleSubmit} disabled={!formData.group}>
        Submit
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </RegisterBox>
    </BodyStyle>
  );
}

export default GroupCreate;
