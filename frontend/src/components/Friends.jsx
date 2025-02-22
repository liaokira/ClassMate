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

const Friends = ({userId}) => {
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSearch = async() => {
    setError('');
    setSuccess('');
    setSearch(null);

    try {
      const friends = await fetch(`http://localhost:3010/v0/users/searchFriend?userId=${userId}&email=${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (friends.status === 200) {
        const fData = await friends.json();
        if (fData) {
          setError('User is already a friend');
        } else {
          setError('Server error');
        }
        return;
      }

      const response = await fetch(`http://localhost:3010/v0/users/search?email=${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setSearch(data.user);
        setError('');
      } else if (response.status === 404) {
        setError('User not found');
        setSearch(null);
      } else {
        setError('Server error');
        setSearch(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to search for user');
      setSearch(null);
    }
  };

  const handleAdd = async () => {
    if (!search) return

    setError('');
    setSuccess('');
    try {
      const response = await fetch(`http://localhost:3010/v0/users/addFriend`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: userId, id: search.id, full_name: search.full_name, email: search.email})
      });

      if (response.status === 201) {
        setSuccess(`${search.id} added!`);
        setError('');
        setSearch(null);
      } else {
        setError('Server error');
        setSuccess('');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to add');
    }
  };

  return (
    <div>
    <Container>
      <Label>Search by Email:</Label>
      <input 
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </Container>
    <br></br>
    <div>
      {search && (
        <div>
          <p>User found: {search.full_name}</p>
          <button onClick={handleAdd}>Add Friend</button>
        </div>
      )}
    </div>
    {error && <p style={{color: 'red'}}>{error}</p>}
    {success && <p style={{color: 'green'}}>{success}</p>}
    </div>
  );
};

export default Friends;