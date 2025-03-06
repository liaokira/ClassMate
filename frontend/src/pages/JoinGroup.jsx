import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import styled from "styled-components";

const BodyStyle = styled.body`
  background-color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  height:calc(100vh - 12vh);
`;

const Card = styled.div`
  width: 50vw; /* Scales with viewport width */ /* Prevents it from being too large on big screens *//* Proportional height */
  display: flex;
  flex-direction: column;
`;

const TopHalf = styled.div`
position:relative;
  height: 8vh;
  background-color: ${(props) => props.inner};
  border: 3px solid ${(props) => props.outer}; /* Scales with screen */
  display: flex;
  border-radius: 1vw 1vw 0 0; /* Scales the border radius */
`;

const BottomHalf = styled.div`
position:relative;
  background-color: var(--primary);
  padding-left: 1vw;
  padding-right: 1vw;
  border: 3px solid var(--tertiary);
  border-top: none;
  border-radius: 0 0 1vw 1vw;
  text-wrap:wrap;
  min-height:40vh;
`;

const ButtonHolder = styled.div`
    margin-bottom:3vh;
    width:100%;
    display:flex;
    align-items:right;
    justify-content:right;
`

const Details = styled.div`
  margin:3vw;
`;


const ClassItem = styled.div`
position:absolute;
right:1vw;
top:1vw;
font-family: Lato;
font-size: 2vh;;
  border-radius: 1rem;
    padding:10px;
    background-color: var(--primary);
    display:flex;
    justify-content: space-between;
    align-items:center;
`;

const Members = styled.div`
    background-color: var(--secondary);
    border-radius: 1rem;
    margin-top:3vh;
    margin-bottom:3vh;
    padding:2vw;
`;

const MemberItem = styled.div`
    text-decoration:underline;
`;

function JoinGroup() {
    const { groupId } = useParams();
    const [groupDetails, setGroupDetails] = useState(undefined);
    const navigate = useNavigate();

    const decodeToken = (token) => {
        const payload = token.split('.')[1];
        const decode = atob(payload);
        return JSON.parse(decode);
      }
    
      const token = localStorage.getItem('accessToken');
      const decodeId = decodeToken(token);
      const userId = decodeId?.id;

    const submitJoin = async () => {
        try {
          const response = await fetch(`http://localhost:3010/v0/group/${groupId}/join`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ member_id: userId }),
          });
      
          if (!response.ok) {
            if (response.status === 400) throw new Error('User is already a member of the study group');
            if (response.status === 404) throw new Error('No study group found');
            throw new Error('Failed to join study group');
          }
      
          navigate('/groups');
        } catch (err) {
          console.error(err.message);
        }
      };
      

    useEffect(() => {
      const fetchGroupDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost:3010/v0/group/${groupId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
  
          if (!response.ok) throw new Error("Failed to fetch group details");
  
          const data = await response.json();
          setGroupDetails(data);
        } catch (err) {
          console.error(err);
        }
      };
  
      if (groupId) fetchGroupDetails();
    }, [groupId]);

const colors = {
    '':{
        normal:'#000000',
        dark:'#000000',
    },
    red: {
      normal: "#D27D7D",  // Desaturated red
      dark: "#A35F5F",    // Darker, more neutral red
    },
    yellow: {
      normal: "#D1B37C",  // Desaturated yellow
      dark: "#A78D62",    // Darker, more neutral yellow
    },
    green: {
      normal: "#7DAF89",  // Desaturated green
      dark: "#5E8A6A",    // Darker, more neutral green
    },
    blue: {
      normal: "#7D9ABD",  // Desaturated blue
      dark: "#5F7991",    // Darker, more neutral blue
    },
    purple: {
      normal: "#9F7DAF",  // Desaturated purple
      dark: "#7A5F86",    // Darker, more neutral purple
    }
}


  return (
    <BodyStyle>
        {groupDetails != undefined &&(
            <Card>
        <TopHalf inner={colors[groupDetails.color]['normal']}
         outer={colors[groupDetails.color]['dark']}>
        <ClassItem>{groupDetails.associated_class}</ClassItem>
        </TopHalf>
        <BottomHalf>
            <Details>
            <h2>{groupDetails.group_name}</h2>
            {groupDetails.group_description!="Add a group description..." &&(
                groupDetails.group_description
            )
            }
            <Members>
            <h3>Members</h3>
            {groupDetails.members && (groupDetails.members.map((member) => (
                <div key={member.id}>
                    <Link to={`/profile/${member.id}`}>
                    <MemberItem>
                    {member.name}
                    </MemberItem>
                    </Link>
                </div>
            )))}
            </Members>
            <ButtonHolder>
                    <button
                    onClick={submitJoin}>
                        Join Group
                    </button>
            </ButtonHolder>
            </Details>
        </BottomHalf>
    </Card>
        )}
    </BodyStyle>
  );
}

export default JoinGroup;
