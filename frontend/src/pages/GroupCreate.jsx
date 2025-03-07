import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FadeIn from 'react-fade-in';

const BodyStyle = styled.body`
  background-color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  height:calc(100vh - 12vh);
`;

const RegisterBox = styled.div`
display:flex;
justify-content:center;
align-items:center;
gap:1vh;
flex-direction:column;
  text-align: center;
  width: 20rem;
  background-color: var(--primary);
  border: 3px solid var(--tertiary);
  border-radius: 2rem;
  padding: 0 2rem 2rem;

  h2{
    margin-bottom:2vh;
  }

  textarea{
    margin-bottom:2vh;
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
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  background-color: ${(props) => colordict[props.color]['normal']};
  border: ${(props) => (props.selected ? "3px solid " + colordict[props.color]['dark'] : "3px solid transparent")};
  cursor: pointer;
  transition: border 0.1s ease-in;
`;

function GroupCreate() {
    const [selectedColor, setSelectedColor] = useState('red');
    const [userClasses, setUserClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [formData, setFormData] = useState({ group: "", groupclass: "", bio: "" });
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSelect = (color) => {
      setSelectedColor(color);
    };

    const decodeToken = (token) => {
      const payload = token.split('.')[1];
      const decode = atob(payload);
      return JSON.parse(decode);
    }
  
    const token = localStorage.getItem('accessToken');
    const decodeId = decodeToken(token);
    const userId = decodeId?.id;

    useEffect(() => {
      const fetchUserClasses = async () => {
        try {
          const response = await fetch(
            `http://localhost:3010/v0/profile/${userId}/classes`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
  
          if (!response.ok) throw new Error("Failed to fetch user classes");
  
          const data = await response.json();
          setUserClasses(data);
        } catch (err) {
          console.error(err);
          setError("Could not load user classes");
        }
      };
  
      if (userId) fetchUserClasses();
    }, [userId]);

  const handleClassSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedClass(selectedValue);
  };
  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      'group_name': formData.group,
      'group_description': formData.bio,
      'color': selectedColor,
      'associated_class': selectedClass,
    };
    try {
      const response = await fetch("http://localhost:3010/v0/group", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}` 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to create group");
      }

      const data = await response.json();
      console.log("Group created successfully:", data);
      navigate("/groups"); // Redirect after successful creation
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <BodyStyle>
      <FadeIn>
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

      <select id="class-dropdown" value={selectedClass} onChange={handleClassSelect}>
  <option value="" disabled>
    Select a class
  </option>
  {userClasses.map((classItem) => (
    <option key={classItem.id} value={classItem.class_name}>
      {classItem.class_name}
    </option>
  ))}
</select>

      <input id="group" maxLength="18" placeholder="Group name" onChange={handleChange} />


      <textarea id="bio" placeholder="Group description (Optional)" onChange={handleChange} />
      <button onClick={handleSubmit} disabled={!formData.group}>
        Submit
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </RegisterBox>
      </FadeIn>
    </BodyStyle>
  );
}

export default GroupCreate;
