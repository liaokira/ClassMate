import { useState } from 'react';
import styled from "styled-components";

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
  margin: 20px;
  display:flex;
  align-items:flex-start;
  flex:wrap: wrap;
  column-gap: 2vw;
`;

const ProfileImage = styled.img`
  width: 26vw;
  height: 26vh;
  object-fit: cover;
`;

const Edit = ({ profileData, setProfileData, setUpdateTrigger }) => {
  const [formData, setFormData] = useState({id: profileData.id, full_name: profileData.full_name, bio: profileData.bio, picture: profileData.picture || null});
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData( (prev) => ({...prev, [id]: value }));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  }

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

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      setSuccess('');
      return;
    }

    const imgData = new FormData();
    imgData.append('image', file);

    try {
      const response = await fetch(`http://localhost:3010/v0/profile/${profileData.id}/image`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: imgData
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData((prev) => ({ ...prev, picture: data.image_id }))
        setUpdateTrigger((prev) => prev + 1);
        setSuccess('Profile image updated!');
        setError('');
      } else {
        setError('Failed to upload image');
        setSuccess('');
      }
    } catch (err) {
      console.error(err);
      setError('Error uploading image');
      setSuccess('');
    }
  }

  return (
    <div>
      <Container>
        <h3>Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <EditContainer>
            <div>
              <Label>Username:</Label>
              <input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Bio:</Label>
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
          </EditContainer>
        </form>

        <h3>Update Profile Picture</h3>
        <form onSubmit={handleFileUpload}>
          <input type="file" accept="image/*" onChange={handleFile} />
          <button type="submit">Upload</button>
        </form>
      </Container>
    </div>
  );
};

export default Edit
