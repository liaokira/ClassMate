import { useState, useEffect } from 'react';
import styled from "styled-components";


const Label = styled.div`
  margin-bottom: 5px;
  margin-top:10px;
`;

const Button = styled.button`
  margin-left: 10px;
`;

const ParentContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Container = styled.div`
  margin: auto;
  padding: 20px;
  border: 3px solid var(--tertiary);
  border-radius: 1rem;
`;

const Results = styled.div`
  margin: auto;
  padding: 20px;
  border: ${(props) => (props.$fill ? '3px solid var(--tertiary)' : 'none')};
  border-radius: 1rem;
`;

const Friends = ({userId}) => {
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fill, setFill] = useState(false);

  useEffect(() => {
    if (search || error || success) {
      setFill(true);
    } else {
      setFill(false);
    }
  }, [search, error, success]);

  const handleSearch = async() => {
    setError('');
    setSuccess('');
    setSearch(null);

    try {
      const encode = encodeURIComponent(email);
      const friends = await fetch(`http://localhost:3010/v0/users/searchFriend?userId=${userId}&email=${encode}`, {
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
          setSuccess('');
        } else {
          setError('Server error');
          setSuccess('');
        }
        return;
      } else if (friends.status === 404) {
        setError('Cannot add yourself');
        setSuccess('');
        return;
      }

      const response = await fetch(`http://localhost:3010/v0/users/search?email=${encode}`, {
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
        setSuccess(`${search.full_name} added!`);
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
    <ParentContainer>
      <Container>
        <h3>Add a friend</h3>
        <Label>Search by Email:</Label>
        <input 
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Container>

      <Results $fill={fill}>
        {search && (
          <div>
            <h3>User found: {search.full_name}</h3>
            <button onClick={handleAdd}>Add Friend</button>
          </div>
        )}
        {error && <p style={{color: 'red'}}>{error}</p>}
        {success && <p style={{color: 'green'}}>{success}</p>}
      </Results>
    </ParentContainer>
  );
};

export default Friends
