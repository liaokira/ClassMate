
import { useState } from 'react'
import { Link } from "react-router-dom";
import logo from '../assets/react.svg';
import styled from "styled-components";



const Body = styled.div`
  background-color: var(--secondary);
  position: relative;
`;

const Banner = styled.div`
  height: relative;
  min-height: 50.9rem;
  width: relative;
  background-color: var(--secondary);
  margin-left: 14rem;
`;

const TabRow = styled.div`
  display: flex;
  padding-left: 6rem;
  padding-top: 6rem;
`;

const Tab = styled.div`
  height: 3rem;
  width: 10rem;
  background-color: var(--secondary);
  border: 3px solid var(--tertiary);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const TabSelect = styled.div`
  height: 3rem;
  width: 10rem;
  background-color: var(--primary);
  border-top: 3px solid var(--tertiary);
  border-left: 3px solid var(--tertiary);
  border-right: 3px solid var(--tertiary);
  border-bottom: 3px solid var(--secondary);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const GroupBlock = styled.div`
  background-color: var(--primary);
  height: 27rem;
  overflow-y: auto;
  scrollbar-width: none;
  width: relative;
  max-width: 80rem;
  margin-left: 6rem;
  padding-top: 3rem;
  padding-bottom: 6rem;
  border: 3px solid var(--tertiary);
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  justify-content: space-between;
`;

const GroupRow = styled.div`
  display: flex;
  margin-top: 3rem;
  justify-content: space-evenly;
`;

const GroupsUnder = styled.div`
  height: relative;
  width: 10rem;
  border-bottom: 3px solid var(--tertiary);
`;

const Group = styled.div`
  height: 20rem;
  width: 20rem;
  border: 3px solid var(--tertiary);
  border-radius: 20px;
  background-color: var(--secondary);
  text-align: center;
`;

const ImageHolder = styled.div`
  height: 75%;
  width: relative;
  background-color: black;
  border: 3px solid var(--tertiary);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GroupName = styled.h2`
  height: relative;
  width: relative;
  background-color: var(--secondary);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

function PlaceHolder() {
  return (
    <Group>
        <ImageHolder><img src={logo} alt="Logo" /></ImageHolder>
        <GroupName>Placeholder Name</GroupName>
    </Group>
  );
}

function GroupsPage() {
  const [myGroups, setmyGroups] = useState(true);

  function toggleGroups() {
    setmyGroups(!myGroups)
  }
  function GroupsTab() {
    return (
      myGroups ? <TabSelect style={{ userSelect: "none"}}><h2>Groups</h2></TabSelect> : <Tab onClick={toggleGroups} style={{ userSelect: "none"}}><h2>Groups</h2></Tab>
    );
  }
  function DiscoverTab() {
    return (
      myGroups ? <Tab onClick={toggleGroups} style={{ userSelect: "none"}}><h2>Discover</h2></Tab> : <TabSelect style={{ userSelect: "none"}}><h2>Discover</h2></TabSelect>
    );
  }
  function OwnedGroups() {
    return (
      <GroupBlock>
      <GroupRow>
        <PlaceHolder/>
        <PlaceHolder/>
      </GroupRow>
    </GroupBlock>
    );
  }
  function OtherGroups() {
    return (
      <GroupBlock>
        <GroupRow>
          <PlaceHolder/>
          <PlaceHolder/>
          <PlaceHolder/>
        </GroupRow>
        <GroupRow>
          <PlaceHolder/>
          <PlaceHolder/>
          <PlaceHolder/>
        </GroupRow>
      </GroupBlock>
    );
  }
  function Groups() {
    return (
      myGroups ? OwnedGroups() : OtherGroups()
    );
  }

  return (
    <Body>
      <Banner>
        <TabRow>
            <GroupsTab/>
            <DiscoverTab/>
        </TabRow>
        <Groups/>
      </Banner>
    </Body>
  );
}

export default GroupsPage;