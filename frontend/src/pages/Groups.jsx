import { useState } from 'react'
import { Link } from "react-router-dom";
import logo from '../assets/react.svg';
import styled from "styled-components";
import GroupCard from '../components/GroupCard';

const Body = styled.div`
display:flex;
flex-direction:column;
  background-color: var(--secondary);
  text-align: center;
  align-items: center;
  height:calc(100vh - 12vh);
  justify-content:center;
`;

const View = styled.div`
  display:flex;
  width:65vw;
  text-align: center;
  background-color: var(--primary);
  border: 3px solid var(--tertiary);
  border-radius: 0 1vw 1vw 1vw;
  padding: 0 2rem 2rem;
  gap:1vw;
  padding-top:1vw;
  flex-wrap: wrap;
  overflow-y:scroll;
  height:60vh;
`;

const TabHolder = styled.div`
position:relative;
width:69vw;
height:8vh;
`;

const TabHolder2 = styled.div`
position:absolute;
bottom:-3px;
left:-2px;
padding-bottom:-3px;
  padding:0px;
  display:flex;
  justify-content:start;
`
const Button = styled.div`
position:absolute;
right:0px;
top: 0vh;
z-index:50;
`
const Tab = styled.div`
  background: ${(props) => (props.active ? "var(--primary)" : "var(--secondary)")};
  padding: 5px 15px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 1vw 1vw 0 0;
  border: 3px solid var(--tertiary);
  border-bottom: ${(props) => (props.active ? "4px solid var(--primary)" : "3px solid var(--tertiary)")};
  cursor: pointer;

  &:hover {
    background: var(--primary);
    border-bottom: 4px solid var(--primary);
  }
`;

const SearchSection = styled.div`
  display:flex;
  justify-content:center;
  width:60vw;
  align-items:center;
  align-content:center;
  gap:1vw;
  height:10vh;
`;

function GroupsPage() {
  const [activeTab, setActiveTab] = useState('myGroups');
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


  return (
    <Body>
      <TabHolder>
        <TabHolder2>
          <Tab active={activeTab === "myGroups"} onClick={() => setActiveTab("myGroups")}>
            <h3>My Groups</h3>
          </Tab>
          <Tab active={activeTab === "explore"} onClick={() => setActiveTab("explore")}>
            <h3>Explore</h3>
          </Tab>
        </TabHolder2>
        <Link to='/creategroup'>
        <Button>
          <button>+ Create</button>
        </Button>
        </Link>
      </TabHolder>

      <View>
        {activeTab === "myGroups" ? (
          // My groups
          <>
            <GroupCard name={"The awesome group"} groupclass={'Class'} description={'Description'} link={'Link'} color={"red"} />
            <GroupCard name={"My epic group"} groupclass={'cse186'} description={'Blah Blah Blah Yap Yap Yap'} link={'Link'} color={"green"} />
          </>
        ) : (
          // Explore page
          <>
          <SearchSection>
          <input
          placeholder='Search for a group'/>
          <button>Search</button>
          </SearchSection>

            <GroupCard name={"Whatever"} groupclass={'cse186'} description={'Blah Blah Blah Yap Yap Yap'} link={'Link'} color={"blue"} />
            <GroupCard name={"Whatever"} groupclass={'cse186'} description={'Blah Blah Blah Yap Yap Yap'} link={'Link'} color={"yellow"} />
            <GroupCard name={"Whatever"} groupclass={'cse186'} description={'Blah Blah Blah Yap Yap Yap'} link={'Link'} color={"purple"} />
            <GroupCard name={"Whatever"} groupclass={'cse186'} description={'Blah Blah Blah Yap Yap Yap'} link={'Link'} color={"purple"} />
            <GroupCard name={"Whatever"} groupclass={'cse186'} description={'Blah Blah Blah Yap Yap Yap'} link={'Link'} color={"purple"} />
            <GroupCard name={"Whatever"} groupclass={'cse186'} description={'Blah Blah Blah Yap Yap Yap'} link={'Link'} color={"purple"} />
          </>
        )}
      </View>
    </Body>
  );
}

export default GroupsPage;