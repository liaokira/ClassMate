import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
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

  button{
    display:flex;
    align-items:center;
  }
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

const Error = styled.div`
  display:flex;
  justify-content:center;
  text-align:center;
  width:100%
`

function GroupsPage() {
  const [activeTab, setActiveTab] = useState('myGroups');
  const [userGroups, setUserGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [error, setError] = useState("");
  const [allError, setAllError] = useState('');
  const [query, setQuery] = useState (""); 

  const decodeToken = (token) => {
    const payload = token.split('.')[1];
    const decode = atob(payload);
    return JSON.parse(decode);
  }

  const token = localStorage.getItem('accessToken');
  const decodeId = decodeToken(token);
  const userId = decodeId?.id;

  useEffect(() => {
      fetchUserGroups();
      fetchAllGroups();
    }, []);


  const fetchUserGroups = async () => {
    try {
      const response = await fetch(`http://localhost:3010/v0/profile/${userId}/groups`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
  
      if (response.ok) {
        const data = await response.json();
        setUserGroups(data);

        if(data.length == 0){
          setError("You are not in any groups yet!");
        }
      } else {
        throw new Error("Failed to fetch groups");
      }
    } catch (err) {
      console.error(err);
      setError("Could not load user groups");
    }
  };

  const fetchAllGroups = async () => {
    try {
      const response = await fetch(`http://localhost:3010/v0/group/discovery`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
  
      if (response.ok) {
        const data = await response.json();
        setAllGroups(data);
        console.log(data);
      } else {
        throw new Error("Failed to fetch groups");
      }
    } catch (err) {
      console.error(err);
      setAllError("Could not load all groups");
    }
  };

  useEffect(() => {
    setAllError(null);
    const fetchSearchResults = async () => {
      if (query.trim() === "") {
        fetchAllGroups(); // Reset to all groups if search is empty
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:3010/v0/group/search?searchFor=${query}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setAllGroups(data);
        }
        else if(response.status==404){
          setAllError("No groups found...");
          setAllGroups([]);
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchSearchResults();
  }, [query]);
  

  const handleSearch = async (e) => {
    setQuery(e.target.value);
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
          <button><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
</svg>Create</button>
        </Button>
        </Link>
      </TabHolder>

      <View>
        {activeTab === "myGroups" ? (
          // My groups
          <>

          {error && (<Error>
            <p>{error}</p>
            </Error>
            )
          }
  
          {userGroups.length != 0 && (userGroups.map((group) => (
          <GroupCard key={group.id} 
          name={group.group_name} 
          groupclass={group.associated_class}
          description={group.group_description}
          link={group.id}
          color={group.color}
          joined={true}
          />
        )))}
          </>
        ) : (
          // Explore page
          <>
          <SearchSection>
          <input
          placeholder='Search for a group'
          type="text"
          onChange={handleSearch}/>
          </SearchSection>

          {allError && (<Error>
            <p>{allError}</p>
            </Error>
            )
          }
          {allGroups.map((group) => (
          <GroupCard key={group.id} 
          name={group.group_name} 
          groupclass={group.associated_class}
          description={group.group_description}
          link={group.id}
          color={group.color}
          joined={false}
          />
        ))}
          </>
        )}
      </View>
    </Body>
  );
}

export default GroupsPage;