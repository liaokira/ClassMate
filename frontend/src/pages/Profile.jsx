import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from "styled-components";

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
  border-bottom: 2px solid var(--tertiary); 
  box-shadow: 0 4px 6px -2px rgba(0, 0, 0, 0.2);
  z-index: 3;
`;

const Biography = styled.div`
  padding-left:calc(8vw + 26vh);

  h1 {
    font-size: calc(3vh + 2vw);
  }

  h3 {
    font-size: calc(1.5vh + 1vw);
  }
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
  width: 20vw;
  display: flex;
  flex-direction: column;
  height:calc(100vh - 6rem);
  z-index: 2;
`;

const TabsFill = styled.div`
  background-color: var(--primary);
  width: 19.8vw;
  border: 2px solid var(--tertiary);
  border-radius: 0 0.75rem 0.75rem 0;
  height: 100vh
`;

const TabButton = styled.button`
  background: ${props => props.$active ? 'var(--secondary)' : 'var(--primary)'};
  border: 2px solid var(--tertiary);
  border-radius: 0 0.75rem 0.75rem 0;
  font-size: calc(1vh + 1.25vw);
  transition: all 0.2s;

  &:hover {
    background: var(--tertiary);
  }
`;

const Content = styled.div`
  flex: 1;
  background-color: var(--primary);
  padding: 2rem;
`;

function Profile() {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState({ name: '', bio: ''});
  const [error, setError] = useState('');
  const [activeTab, setActivateTab] = useState('friends');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3010/v0/profile/${userID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setProfileData(data);
        } else if (response.status === 404) {
          setError('Profile not found');
        } else {
          setError('Unexpected error');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [userId]);

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
    { id: 'schedule', label: 'Class Schedule', content: 'schedule' },
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
          <h1> {profileData.name} </h1>
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
          {tabs.find(tab => tab.id === activeTab)?.content}
        </Content>
      </TabDisplay>

    </PageContainer>
  )
}

export default Profile
