import { useState } from 'react';
import styled from "styled-components";
import ClassManager from "../components/ClassManager";

const Label = styled.div`
  margin-bottom: 5px;
  margin-top:10px;
`;

const Container = styled.div`
  margin: auto;
  padding: 20px;
  border: 3px solid var(--tertiary);
  border-radius: 1rem;
`;

const EditContainer = styled.div`
  display:flex;
  align-items:flex-start;
  flex:wrap: wrap;
  column-gap:10px;
`;

const Edit = ({ profileData, setProfileData, setUpdateTrigger }) => {
  const [formData, setFormData] = useState({id: profileData.id, full_name: profileData.full_name, bio: profileData.bio});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData( (prev) => ({...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch (`http://localhost:3010/v0/profile/${profileData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        setUpdateTrigger((prev) => prev + 1);
        setProfileData((prev) => ({...prev, full_name: formData.full_name, bio: formData.bio}));
        setSuccess('Profile updated');
        setError('');
      } else if (response.status === 400) {
        setError('Invalid data');
        setSuccess('');
      } else {
        setError('Unexpected error');
        setSuccess('');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
      setSuccess('');
    }
  };

  return (
    <EditContainer>
    <Container>
    <h3>Edit Profile</h3>
    <form onSubmit={handleSubmit}>
      <div>
        <Label>Username:</Label>
      </div>
      <div>
        <input
          id="full_name"
          type="text"
          value={formData.full_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Bio:</Label>
      </div>
      <div>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={handleChange}
        />
      </div>
      <div>
        <br></br>
        <button type="submit">Save Changes</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    </form>
    </Container>
    <ClassManager  userId={formData.id}/>
    </EditContainer>
  );
};

export default Edit
