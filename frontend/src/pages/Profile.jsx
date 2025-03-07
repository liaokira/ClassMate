import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import Friends from '../components/Friends';
import Schedule from '../components/Schedule';
import Edit from '../components/Edit';
import placeholderPic from '../assets/placeholder.png';

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

function Profile() {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState({id: userId, full_name: '', bio: '', picture: null});
  const [picObj, setPicObj] = useState(null);
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
          setProfileData({ id: userId, full_name: data.full_name, bio: data.bio, picture: data.profile_pic_id || null });
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

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (profileData.picture) {
          let picURL = null;
    
          const imgResponse = await fetch (`http://localhost:3010/v0/profile/${userId}/image`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
    
          if (imgResponse.ok) {
            const imgBlob = await imgResponse.blob();
            picURL = URL.createObjectURL(imgBlob)
            setPicObj({picURL});
          }
        } else {
          setPicObj(null);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch image data');
      }
    };
    fetchImage();
  }, [userId, profileData.picture]);

  

  const decodeToken = (token) => {
    const payload = token.split('.')[1];
    const decode = atob(payload);
    return JSON.parse(decode);
  }

  const token = localStorage.getItem('accessToken');
  const decodeId = decodeToken(token);
  const loggedId = decodeId?.id;
  const ownPage = (loggedId === userId);

  const tabs = [
    { id: 'friends', label: 'Friends List', content: 'friends' },
    { id: 'schedule', label: 'Schedule', content: 'schedule' },
  ];

if (loggedId === userId) {
  tabs.unshift({ id: 'edit', label: 'Edit Profile', content: 'editor'});
}

  return (
    <PageContainer>

      <Head>
        <ProfPic>
          {picObj ? (
            <img
              src={picObj?.picURL}
              alt="Profile Picture"
              style={{ width: '100%', height: '100%', objectFit: 'cover', alignContent: 'center' }}
            />
          ) : (
            <img
              src={placeholderPic}
              alt="Default Picture"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </ProfPic>
        <Biography>
            <h1> {profileData.full_name} </h1>
            <h2> {profileData.bio} </h2>            
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
                return <Friends userId={userId} ownPage={ownPage} />;
              case 'schedule':
                return <Schedule profileData={profileData} ownPage={ownPage} />;
              case 'edit':
                return <Edit profileData={profileData} setProfileData={setProfileData} setUpdateTrigger={setUpdateTrigger}/>;
              default:
                return <Friends userId={userId} ownPage={ownPage}/>;
            }
          })()}
        </Content>
      </TabDisplay>

    </PageContainer>
  )
}

export default Profile
