import { useState } from 'react';
import styled from "styled-components";

const Label = styled.div`
  margin-bottom: 5px;
  margin-top:10px;
`;

const Container = styled.div`
  display: flex;
  width: auto;
  height: auto;
`;

const EditContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border: 3px solid var(--tertiary);
  border-radius: 1rem;
`;

const PicContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border: 3px solid var(--tertiary);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  height: fit-content;
`;

const FileInput = styled.input`
  margin-top: 10px;
  padding: 10px;
  height: fit-content;
`;

const MessageContainer = styled.div`
  margin: 20px;
`;

const Button = styled.button`
  margin-top: 10px;
  margin-right: 10px;
`;

/* eslint-disable react/prop-types */
const Edit = ({ profileData, setProfileData, setUpdateTrigger }) => {
  const [formData, setFormData] = useState({id: profileData.id, full_name: profileData.full_name, bio: profileData.bio, profile_pic_id: profileData.picture || null});
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

      if (response.status === 200 || response.status === 201) {
        setProfileData({full_name: formData.full_name, bio: formData.bio});
        setUpdateTrigger((prev) => prev + 1);
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
        setFormData((prev) => ({ ...prev, profile_pic_id: data.image_id }))
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

  const handleResetPic = async () => {
    // reset picture here
    return;
  }

  return (
    <div>
      <Container>
        <EditContainer>
          <h3>Edit Profile</h3>
          <form onSubmit={handleSubmit}>
            <Label>Username:</Label>
            <input
              id="full_name"
              type="text"
              value={formData.full_name}
              maxLength={22}
              onChange={handleChange}
            />
            <Label>Bio:</Label>
            <textarea
              id="bio"
              value={formData.bio}
              maxLength={172}
              onChange={handleChange}
            />
            <br></br>
            <Button type="submit">Save Changes</Button>
          </form>
        </EditContainer>
        <PicContainer>
          <h3>Upload Profile Picture</h3>
          <form onSubmit={handleFileUpload}>
            <FileInput type="file" accept="image/*" onChange={handleFile} />
            <br></br>
            <Button type="submit">Upload</Button>
            <Button type="button" onClick={handleResetPic}>Reset</Button>
          </form>
        </PicContainer>
      </Container>
      <MessageContainer>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </MessageContainer>
    </div>
  );
};

export default Edit
