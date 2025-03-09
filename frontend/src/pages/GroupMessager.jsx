import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import MessageBubble from '../components/MessageBubble';
import placeholder from '../assets/placeholder.png'
import FadeIn from 'react-fade-in';

const Container = styled.div`
  display: flex;
  height: 88vh;
  background-color: var(--secondary);
  color: black;
`;

const Sidebar = styled.div`
  background-color: var(--primary);
  border-right: 3px solid var(--tertiary);
  color: black;
  height:100%;
`;


const ClassItem = styled.div`
font-family: Lato;
font-size: 2vh;;
  border-radius: 1rem;
    padding:10px;
    background-color: var(--primary);
    display:flex;
    justify-content: space-between;
    align-items:center;
    width:fit-content;
`;


const GroupInfo = styled.div`
  padding: 2vh 1.5vw;
  background-color: ${({ groupColor }) => groupColor || 'var(--tertiary)'};
  border: 3px solid ${({ secondaryColor }) => secondaryColor || 'var(--tertiary)'};
  border-left:none;

  h2{
    margin-top:1vh;
    margin-bottom:2vh;
  }
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 18vw; /* Same width as Sidebar */
  min-width: 200px;
`;


const Members = styled.div`
   background-color: var(--secondary);
    border-radius: 1rem;
    margin: .5vh 2vh 2vh 2vh;
    padding:1vw;
`;

const MemberItem = styled.div`
  text-decoration:underline;

  &:hover {
    color: var(--tertiary);
  }
`;

const LeaveGroupButton = styled.button`
  margin: .5vh 2vh 2vh 2vh;
`;

const User = styled.div`
  margin-bottom: 1vh;
`;

const Messenger = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  flex: 1;
  padding: 2vh 1.5vw;
  overflow-y: auto;
  align-content:flex-end;
`;

const MessageInputC = styled.div`
  display: flex;
  padding: 1.5vh 1.5vw;
  background-color: var(--primary);
  border-top: 3px solid var(--tertiary);

  button{
    margin-left:2vw;
  }
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 1vh 1vw;
  background-color: var(--primary);
  border: 3px solid var(--tertiary);
  border-radius: 0.5vw;
  color: black;
  outline: none;
  font-size: 1.2vw;
  transition: background-color 0.2s ease-in-out;

  &:focus {
    flex: 1;
  padding: 1vh 1vw;
  background-color: var(--secondary);
  border: 3px solid var(--tertiary);
  border-radius: 0.5vw;
  color: black;
  outline: none;
  font-size: 1.2vw;
  transition: background-color 0.2s ease-in-out;
  }
`;

const Details = styled.div`
    background-color: var(--secondary);
    border-radius: 1rem;
    margin: .5vh 2vh 2vh 2vh;
    padding:1vw;
`;

const Label = styled.div`
    margin-left:2vw;
    margin-top:2vh;
`;

const GroupMessenger = () => {
  const { groupid } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({ id: '', name: '' });
  const [groupInfo, setGroupInfo] = useState(undefined);
  const [memberPics, setMemberPics] = useState({});
  
  const socketRef = useRef(null);
  const messageListRef = useRef();
  const navigate = useNavigate();

  
  const colors = {
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

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return {};
    }
  };

  const token = localStorage.getItem('accessToken');
  const decodedToken = token ? decodeToken(token) : {};

  // Initialize currentUser with id from token; name will be fetched below.
  useEffect(() => {
    if (decodedToken.id) {
      setCurrentUser((prev) => ({ ...prev, id: decodedToken.id }));
      const fetchProfile = async () => {
        try {
          const response = await fetch(`http://localhost:3010/v0/profile/${decodedToken.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCurrentUser({ id: decodedToken.id, name: data.full_name });
          } else {
            console.error('Failed to fetch profile');
            // Fall back to token info if available
            setCurrentUser({ id: decodedToken.id, name: decodedToken.full_name || 'User' });
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
          setCurrentUser({ id: decodedToken.id, name: decodedToken.full_name || 'User' });
        }
      };
      fetchProfile();
    }
  }, [decodedToken.id, token, decodedToken.full_name]);

  // Fetch previous messages from the endpoint.
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3010/v0/group/${groupid}/messages`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMessages(data.reverse());
          scrollToBottom();
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [groupid, token]);

// Fetch group info to fill sidebar
useEffect(() => {
  const fetchGroupInfo = async () => {
    if (!groupid || !token) return;

    try {
      const response = await fetch(`http://localhost:3010/v0/group/${groupid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGroupInfo(data);

        // Fetch member images directly from the data
        const picDict = {};
        for (const member of data.members) { // Use 'data' instead of 'groupInfo' to avoid infinite loop
          let picURL = null;
          try {
            const imageResponse = await fetch(`http://localhost:3010/v0/profile/${member.id}/image`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (imageResponse.ok) {
              const imgBlob = await imageResponse.blob();
              picURL = URL.createObjectURL(imgBlob);
              picDict[member.id] = picURL;
            } else {
              picDict[member.id] = placeholder;
            }
          } catch (err) {
            console.error(`Error fetching image for member ${member.id}:`, err);
          }
        }

        setMemberPics(picDict);
        console.log('Member pics:', picDict);

      } else {
        console.error('Failed to fetch group info');
      }
    } catch (err) {
      console.error('Error fetching group info:', err);
    }
  };

  fetchGroupInfo();
}, [groupid, token]); // Remove 'groupInfo' from dependencies


  // Setup the WebSocket connection.
  useEffect(() => {
    if (!groupInfo?.id) return;

    socketRef.current = new WebSocket('ws://localhost:3010');

    socketRef.current.onopen = () => {
      console.log('Connected to WebSocket server');
      const joinMsg = {
        type: 'join',
        userId: currentUser.id,
        sender_name: currentUser.name,
        groupId: groupid
      };
      socketRef.current.send(JSON.stringify(joinMsg));
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        const newMsg = data.message;
        setMessages((prevMessages) => [...prevMessages, newMsg]);
      }
    };

    socketRef.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    // Clean up on unmount.
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [groupInfo, currentUser.id, currentUser.name]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages])

  // Handle sending a new message.
  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;
    const msgData = {
      type: 'message',
      senderId: currentUser.id,
      sender_name: currentUser.name,
      groupId: groupid,
      message: trimmedMessage,
      timestamp: new Date()
    };
    socketRef.current.send(JSON.stringify(msgData));
    setInputMessage('');
  };

  // Handle leaving the group.
  const handleLeaveGroup = async () => {
    try {
      const response = await fetch(`http://localhost:3010/v0/group/${groupid}/leave`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ member_id: currentUser.id }),
      });

      if (!response.ok) {
        if (response.status === 400) throw new Error('User is not a member of study group');
        if (response.status === 404) throw new Error('No study group found');
        throw new Error('Failed to leave study group');
      }

      navigate('/groups');
    } catch (err) {
      console.error(err.message)
    }
  };

  
  const formatReceivedDate = (receivedDate) => {
    const date = new Date(receivedDate);
    const now = new Date();

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const isYesterday = (d) => {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      return isSameDay(d, yesterday);
    };

    if (isSameDay(date, now)) {
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([],
          {month: 'short', day: 'numeric'}); // "Jan 31"
    }
    return date.getFullYear().toString(); // "2022"
  };

  const scrollToBottom = () => {
    if (messageListRef) {
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }
  };

  return (
      <Container>
        {groupInfo && (
          <>
          <SidebarContainer>
          <GroupInfo groupColor={colors[groupInfo.color]["normal"]}
        secondaryColor={colors[groupInfo.color]["dark"]}>
          <h2>{groupInfo?.group_name || 'Failed to fetch group'}</h2>
          <ClassItem>
            {groupInfo?.associated_class || 'No associated class'}
          </ClassItem>
        </GroupInfo>
        <Sidebar>
      <Label>
      Description
      </Label>
      <Details>
      {groupInfo?.group_description || 'No description available'}
      </Details>

      <Label>
      Members
      </Label>
        <Members>
          {groupInfo?.members && (groupInfo.members.map((member) => (
            <User key={member.id}>
                <Link to={`/profile/${member.id}`}>
                <MemberItem>
                {member.name}
                </MemberItem>
                </Link>
            </User>
          ))) || 'No members to display'}
        </Members>
        <LeaveGroupButton 
        onClick={handleLeaveGroup}>
          Leave Group
        </LeaveGroupButton>
      </Sidebar>


          </SidebarContainer>
      <Messenger>
        <MessageList ref = {messageListRef}>
          <FadeIn>
          {messages.map((msg, index) => (
            <MessageBubble 
            key={index}
            profilePic={memberPics[msg.sender_id]}
            username={msg.sender_name}
            text={msg.message}
            timestamp={formatReceivedDate(msg.timestamp)}
            iscurrentuser={decodedToken.id == msg.sender_id}>
            </MessageBubble>
          ))}
          </FadeIn>
        </MessageList>
        <MessageInputC>
          <MessageInput
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Optional: Prevents form submission if inside a form.
                handleSendMessage();
              }
            }
          }
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </MessageInputC>
      </Messenger>
          </>
      )}
    </Container>
  );
};

export default GroupMessenger;
