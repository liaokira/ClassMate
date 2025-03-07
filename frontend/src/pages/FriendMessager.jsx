import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import FadeIn from 'react-fade-in';

import MessageBubble from '../components/MessageBubble';
import placeholder from '../assets/placeholder.png'; // Adjust path if needed

const Container = styled.div`
  display: flex;
  height: 88vh;
  background-color: var(--secondary);
  color: black;
`;

/* Optional left sidebar for friend info (similar style to GroupMessenger). 
   Feel free to remove or style differently. */
const FriendInfoSidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 18vw; 
  min-width: 200px;
  border-right: 3px solid var(--tertiary);
  background-color: var(--primary);
`;

const FriendDetails = styled.div`
  padding: 2vh 1.5vw;
  color: black;
`;

const Label = styled.div`
  margin-top: 2vh;
  margin-bottom: 1vh;
  font-weight: bold;
`;

const FriendName = styled.div`
  font-size: 2vh;
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
  align-content: flex-end;
`;

const MessageInputC = styled.div`
  display: flex;
  padding: 1.5vh 1.5vw;
  background-color: var(--primary);
  border-top: 3px solid var(--tertiary);

  button {
    margin-left: 2vw;
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
    background-color: var(--secondary);
  }
`;

const FriendMessager = () => {
  const { recepientId } = useParams(); // DM route param: /dm/:recepientId

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({ id: '', name: '' });
  const [friendInfo, setFriendInfo] = useState(null);

  const socketRef = useRef(null);
  const messageListRef = useRef(null);

  // Grab token from localStorage and decode
  const token = localStorage.getItem('accessToken') || '';
  const decodeToken = (tokenString) => {
    try {
      const payload = tokenString.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return {};
    }
  };
  const decodedToken = decodeToken(token);

  // Fetch current user's profile
  useEffect(() => {
    if (decodedToken.id) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`http://localhost:3010/v0/profile/${decodedToken.id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCurrentUser({ id: decodedToken.id, name: data.full_name });
          } else {
            console.error('Failed to fetch current user profile');
            setCurrentUser({ id: decodedToken.id, name: decodedToken.full_name || 'User' });
          }
        } catch (err) {
          console.error('Error fetching current user profile:', err);
          setCurrentUser({ id: decodedToken.id, name: decodedToken.full_name || 'User' });
        }
      };
      fetchProfile();
    }
  }, [decodedToken.id, decodedToken.full_name, token]);

  // Fetch friend (recipient) info to display in a sidebar or header
  useEffect(() => {
    const fetchFriendInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3010/v0/profile/${recepientId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFriendInfo(data);
        } else {
          console.error('Failed to fetch friend info');
        }
      } catch (error) {
        console.error('Error fetching friend info:', error);
      }
    };
    if (recepientId) {
      fetchFriendInfo();
    }
  }, [recepientId, token]);

  // Fetch existing DM messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // GET /v0/users/:id/:recepientId/messages (as in friends.js)
        const response = await fetch(`http://localhost:3010/v0/users/${decodedToken.id}/${recepientId}/messages`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          // The server orders messages DESC by timestamp, so reverse for ascending display:
          setMessages(data.reverse());
          scrollToBottom();
        } else {
          console.error('Failed to fetch DM messages');
        }
      } catch (err) {
        console.error('Error fetching DM messages:', err);
      }
    };

    if (decodedToken.id && recepientId) {
      fetchMessages();
    }
  }, [decodedToken.id, recepientId, token]);

  // Set up WebSocket for real-time DM communication
  useEffect(() => {
    if (!decodedToken.id || !recepientId) return;

    socketRef.current = new WebSocket('ws://localhost:3010');
    socketRef.current.onopen = () => {
      console.log('Connected to WebSocket server (DM)');

      // “Join” the DM channel
      const joinMsg = {
        type: 'dm_join',
        userId: decodedToken.id,
        recepientId,
        sender_name: currentUser.name,
      };
      socketRef.current.send(JSON.stringify(joinMsg));
    };

    // Listen for incoming DM messages
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'dm_message') {
        const newMsg = data.message;
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    socketRef.current.onclose = () => {
      console.log('Disconnected from WebSocket server (DM)');
    };

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [currentUser.name, decodedToken.id, recepientId]);

  // Scroll to bottom when new messages arrive
  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messageListRef?.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
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
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    return date.getFullYear().toString();
  };

  // Send a new DM
  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    const msgData = {
      type: 'dm_message',
      senderId: currentUser.id,
      sender_name: currentUser.name,
      recepientId,
      message: trimmedMessage,
      timestamp: new Date(),
    };
    socketRef.current.send(JSON.stringify(msgData));
    setInputMessage('');
  };

  return (
    <Container>
      {/* Optional friend info section, similar to GroupMessenger’s sidebar */}
      <FriendInfoSidebar>
        <FriendDetails>
          <Label>Messaging with:</Label>
          {friendInfo ? (
            <FriendName>{friendInfo.full_name}</FriendName>
          ) : (
            <FriendName>Loading...</FriendName>
          )}
          <br/>
          {friendInfo && (
            <Link to={`/profile/${recepientId}`}>
              View {friendInfo.full_name}'s Profile
            </Link>
          )}
        </FriendDetails>
      </FriendInfoSidebar>

      <Messenger>
        <MessageList ref={messageListRef}>
          <FadeIn>
            {messages.map((msg, index) => (
              <MessageBubble
                key={index}
                profilePic={placeholder}
                username={msg.sender_name}
                text={msg.message}
                timestamp={formatReceivedDate(msg.timestamp)}
                iscurrentuser={decodedToken.id === msg.sender_id}
              />
            ))}
          </FadeIn>
        </MessageList>

        <MessageInputC>
          <MessageInput
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </MessageInputC>
      </Messenger>
    </Container>
  );
};

export default FriendMessager;
