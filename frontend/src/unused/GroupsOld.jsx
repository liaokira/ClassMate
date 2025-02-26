
import { useState } from 'react'
import { Link } from "react-router-dom";
import logo from '../assets/react.svg';
import styled from "styled-components";



const Body = styled.div`
  background-color: var(--secondary);
  height:calc(100vh - 12vh);
  text-align: center;
  align-items: center;
`;

const Banner = styled.div`
  height: relative;
  width: 81%;
  background-color: var(--secondary);
  margin: auto;
  overflow-y: auto;
  scrollbar-width: none;
`;

const TabRow = styled.div`
  display: flex;
  padding-top: 11vh;
  margin: auto;
`;

const Tab = styled.div`
  height: 6vh;
  width: 30%;
  margin: auto;
  background-color: var(--secondary);
  border-top: 3px solid var(--tertiary);
  border-left: 3px solid var(--tertiary);
  border-right: 3px solid var(--tertiary);
  border-bottom: 0px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: var(--secondary-hover, #f0f0f0);
  }
`;

const TabSelect = styled.div`
  height: 6vh;
  width: 30%;
  margin: auto;
  background-color: var(--primary);
  border-top: 3px solid var(--tertiary);
  border-left: 3px solid var(--tertiary);
  border-right: 3px solid var(--tertiary);
  border-bottom: 0px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: var(--primary-hover, #dcdcdc);
  }
`;

const GroupBlock = styled.div`
  background-color: var(--primary);
  height: 40vh;
  max-height: 40vh;
  overflow-y: auto;
  scrollbar-width: none;
  width: relative;
  margin: auto;
  padding-top: 5vh;
  padding-bottom: 11vh;
  border: 3px solid var(--tertiary);
  border-radius: 20px;
  justify-content: space-between;
  text-align: center;
`;

const Group = styled.div`
  height: 11vh;
  width: 35vh;
  margin: 2vh 4vh;
  border: 3px solid var(--tertiary);
  border-radius: 20px;
  background-color: var(--secondary);
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: var(--secondary-hover, #f0f0f0);
  }
`;

const GroupClicked = styled.div`
  height: relative;
  width: 35vh;
  margin: 2vh 4vh;
  border: 3px solid var(--tertiary);
  border-radius: 20px;
  background-color: var(--secondary);
  text-align: center;
  vertical-align: middle;
  overflow-y: auto;
  cursor: pointer;

  &:hover {
    background-color: var(--secondary-hover, #f0f0f0);
  }
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

const GroupDescription = styled.h3`
  margin-left: 1vw;
  margin-right: 1vw;
`;

const GroupButton = styled.button`
  margin-bottom: 2vh;
`;

const SearchBarBox = styled.input`
  margin: auto;
  margin-right: 2vw;
  width: relative;
`;

function GroupTemplate({ name = "ClassName", description = "This is a class.", chat = "/groups" }) {
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    setClicked(!clicked)
  }

  return (
    clicked ? 
      <GroupClicked onClick={handleClick}>
        <h2>{name}</h2>
        <GroupDescription>{description}</GroupDescription>
        <Link to={chat}>
          <GroupButton>Chat</GroupButton>
        </Link>
      </GroupClicked>
    :
      <Group onClick={handleClick}>
          <h2>{name}</h2>
      </Group>
  );
}

function GroupsPage() {
  const [myGroups, setmyGroups] = useState(true);
  const [query, setQuery] = useState (""); 
  const [results, setResults] = useState ([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value}));
  }

  function SearchBar(){
    return (
      <SearchBarBox
        type="text"
        //value={query}
        id="search"
        placeholder="Search..."
        onChange={handleChange}
      />
    )
  }

  function toggleGroups() {
    setmyGroups(!myGroups)
  }
  function GroupsTab() {
    return (
      myGroups ? 
      <TabSelect style={{ userSelect: "none"}}><h2>Groups</h2></TabSelect> : 
      <Tab onClick={toggleGroups} style={{ userSelect: "none"}}>
        <h2>Groups</h2>
      </Tab>
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
          <GroupTemplate/>
          <GroupTemplate description="This is a different class. By the way, this class has different content. Just so you know."/>
          <GroupTemplate/>
          <GroupTemplate/>
      </GroupBlock>
    );
  }
  function OtherGroups() {
    return (
      <div>
      <Link to='/creategroup'>
        <button>Create</button>
      </Link>
      <SearchBar/>
      <button>Search</button>
      <GroupBlock>
          <GroupTemplate/>
          <GroupTemplate/>
          <GroupTemplate/>
          <GroupTemplate/>
          <GroupTemplate/>
          <GroupTemplate/>
      </GroupBlock>
      </div>
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