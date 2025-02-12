import { useState } from 'react'
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
    font-size: 4vh+4vw;
  }

  h3 {
    font-size: 4vh;
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
  font-size: 4vh;
  transition: all 0.2s;

  &:hover {
    background: var(--tertiary);
  }
`

const Content = styled.div`
  flex: 1;
  background-color: var(--primary);
  padding: 2rem;
`;

function Profile() {
  const [activeTab, setActivateTab] = useState('friends');

  const tabs = [
    { id: 'friends', label: 'Friends List', content: 'friends' },
    { id: 'groups', label: 'Study Groups', content: 'groups' },
    { id: 'schedule', label: 'Class Schedule', content: 'schedule' },
    { id: 'posts', label: 'Forum Posts', content: 'posts' },
  ];

  return (
    <PageContainer>

      <Head>
        <ProfPic>
          Profile Pic
        </ProfPic>
        <Biography>
          <h1> Student Name </h1>
          <h3> Biography details </h3>
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
