import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import ClassManager from "../components/ClassManager";

const Container = styled.div`
  margin: auto;
  padding: 20px;
  border: 3px solid var(--tertiary);
  border-radius: 1rem;
`;


const PageContainer = styled.body`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Head = styled.div`
  background-color: var(--secondary);
  align-items: center;
  justify-content: left;
  height: 32vh;
  border-bottom: 3px solid var(--tertiary); 
  z-index: 3;
`;

const EditContainer = styled.div`
  display:flex;
  align-items:flex-start;
  flex:wrap: wrap;
  column-gap:10px;
`;

const Biography = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  gap: 4rem;
  padding-left:calc(8vw + 26vh);
`;

const ProfPic = styled.div`
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26vh;
  width:  26vh;
  border: 2px solid var(--tertiary);
  border-radius: 50%;
  position: absolute;
  top:calc(3vh + 6rem);
  left: 4vw;
  overflow: hidden;
`;

const TabDisplay = styled.div`
  display: flex;
`;

const Tabs = styled.div`
  background-color: var(--primary);
  width: 16vw;
  display: flex;
  flex-direction: column;
  height:calc(100vh - 6rem);
  z-index: 2;
`;

const TabsFill = styled.div`
  background-color: var(--primary);
  width: 15.9+7vw;
  border: 3px solid var(--tertiary);
  border-top:none;
  height: 100vh
`;

const TabButton = styled.button`
  background: ${props => props.$active ? 'var(--secondary)' : 'var(--primary)'};
  border: 3px solid var(--tertiary);
  border-top:none;
  border-radius: 0;
  font-size: calc(1vh + 1.25vw);
  transition: all 0.2s;

  &:hover {
    background: var(--tertiary);
  }
`;

const Label = styled.div`
  margin-bottom: 5px;
  margin-top:10px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--primary);
  padding: 2rem;
  flex-grow: 1;
  align-items: flex-start;
  justify-content: flex-start;
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

const Groups = () => (
  <div>
    <p>This is where the study groups will display</p>
  </div>
);

const Schedule = () => (
  <div>
    <p>This is where the class schedule will display</p>
  </div>
);

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

function Profile() {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState({id: userId, name: '', bio: ''});
  const [error, setError] = useState('');
  const [activeTab, setActivateTab] = useState('friends');
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3010/v0/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setProfileData({ id: userId, full_name: data.full_name, bio: data.bio });
        } else if (response.status === 404) {
          setError('Profile not found');
        } else {
          setError('Unexpected error');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile data');
      }
    };
    fetchProfile();
  }, [userId, updateTrigger]);

  const decodeToken = (token) => {
    const payload = token.split('.')[1];
    const decode = atob(payload);
    return JSON.parse(decode);
  }

  const token = localStorage.getItem('accessToken');
  const decodeId = decodeToken(token);
  const loggedId = decodeId?.id;

  const tabs = [
    { id: 'friends', label: 'Friends List', content: 'friends' },
    { id: 'groups', label: 'Study Groups', content: 'groups' },
    { id: 'schedule', label: 'Schedule', content: 'schedule' },
  ];

if (loggedId === userId) {
  tabs.unshift({ id: 'edit', label: 'Edit Profile', content: 'editor'});
}

  return (
    <PageContainer>

      <Head>
        <ProfPic>
          Profile Pic
        </ProfPic>
        <Biography>
            <h1> {profileData.full_name} </h1>
            <h3> {profileData.bio} </h3>            
        </Biography>
      </Head>

      <TabDisplay>
        <Tabs>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              onClick={() => setActivateTab(tab.id)}
              $active={activeTab === tab.id}
            >
              {tab.label}
            </TabButton>
          ))}
          <TabsFill></TabsFill>
        </Tabs>

        <Content>
          {(() => {
            switch (activeTab) {
              case 'friends':
                return <Friends userId={userId}/>;
              case 'groups':
                return <Groups />;
              case 'schedule':
                return <Schedule />;
              case 'edit':
                return <Edit profileData={profileData} setProfileData={setProfileData} setUpdateTrigger={setUpdateTrigger}/>;
              default:
                return <Friends userId={userId}/>;
            }
          })()}
        </Content>
      </TabDisplay>

    </PageContainer>
  )
}

export default Profile
