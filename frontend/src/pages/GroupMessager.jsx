import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 88vh;
  background-color: var(--tertiary);
  color: black;
`;

const Sidebar = styled.div`
  width: 16vw;
  min-width: 200px;
  background-color: ${({ groupColor }) => groupColor || 'var(--tertiary)'};
  opacity: 0.8;
  padding: 2vh 1.5vw;
  border-right: 1px solid #202225;
  color: black;
`;

const GroupInfo = styled.div`
  margin-bottom: 2vh;
`;

const Members = styled.ul`
  list-style: none;
  padding: 0;
`;

const MemberItem = styled.div`
  text-decoration:underline;
  font-size: 1.1vw;

  &:hover {
    color: var(--tertiary);
  }
`;

const User = styled.div`
  font-size: 1.2vw;
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
`;

const Message = styled.div`
  margin-bottom: 1.5vh;
  color: black;
  background-color: var(--secondary);
  padding: 1vh;
  border-radius: 0.5vw;
`;

const MessageSender = styled.strong`
  color: black;
  font-size: 1.2vw;
`;

const MessageInputC = styled.div`
  display: flex;
  padding: 1.5vh 1.5vw;
  background-color: var(--primary);
  border-top: 1px solid #202225;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 1vh 1vw;
  background-color: var(--secondary);
  border: 1px solid #202225;
  border-radius: 0.5vw;
  color: black;
  outline: none;
  font-size: 1.2vw;
  transition: background-color 0.2s ease-in-out;

  &:focus {
    flex: 1;
    padding: 1vh 1vw;
    background-color: var(--tertiary);
    border: 1px solid #202225;
    border-radius: 0.5vw;
    color: black;
    outline: none;
    font-size: 1.2vw;
    transition: background-color 0.2s ease-in-out;
  }
`;

const Send = styled.button`
  margin-left: 1vw;
  padding: 1vh 2vw;
  background-color: var(--tertiary);
  border: none;
  border-radius: 0.5vw;
  color: black;
  cursor: pointer;
  font-size: 1.2vw;

  &:hover {
    background-color: var(--secondary);
  }
`;

const GroupMessenger = () => {
  const { groupid } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({ id: '', name: '' });
  const [groupInfo, setGroupInfo] = useState(undefined);
  const socketRef = useRef(null);

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
        const response = await fetch(`http://localhost:3010/v0/messages/${groupid}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMessages(data.reverse());
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
    try {
      const response = await fetch (`http://localhost:3010/v0/group/${groupid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setGroupInfo(data);
        console.log('Group info: ', data);
      } else {
        console.error('Failed to fetch group info');
      }
    } catch (err) {
      console.error('Error fetching group info:', err);
    }
  };

  fetchGroupInfo();
}, [groupid, token]);

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

  // Handle sending a new message.
  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;
    const msgData = {
      type: 'message',
      senderId: currentUser.id,
      sender_name: currentUser.name,
      groupId: groupid,
      message: trimmedMessage
    };
    socketRef.current.send(JSON.stringify(msgData));
    setInputMessage('');
  };

  return (
    <Container>
      <Sidebar groupColor={groupInfo?.color}>
        <GroupInfo>
          <h2>{groupInfo?.group_name || 'Failed to fetch group'}</h2>
          <p>{groupInfo?.group_description || 'No description available'}</p>
          <p>{groupInfo?.associated_class || 'No associated class'}</p>
        </GroupInfo>
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
      </Sidebar>
      <Messenger>
        <MessageList>
          {messages.map((msg, index) => (
            <Message key={index}>
              <MessageSender>{msg.sender_name}</MessageSender>: {msg.message}
            </Message>
          ))}
        </MessageList>
        <MessageInputC>
          <MessageInput
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Send onClick={handleSendMessage}>Send</Send>
        </MessageInputC>
      </Messenger>
    </Container>
  );
};

export default GroupMessenger;
