import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import MessageBubble from '../components/MessageBubble';
import placeholder from '../assets/placeholder.png';

const Container = styled.div`
  display: flex;
  height: 88vh;
  background-color: var(--secondary);
  color: black;
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
  const { recepientId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({ id: '', name: '' });
  const socketRef = useRef(null);
  const messageListRef = useRef();

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

  // Decode JWT
  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Failed to decode token:', error);
      return {};
    }
  };

  const token = localStorage.getItem('accessToken');
  const decodedToken = token ? decodeToken(token) : {};

  // Initialize currentUser with id from token and then fetch profile for full name.
  useEffect(() => {
    if (decodedToken.id) {
      setCurrentUser(prev => ({ ...prev, id: decodedToken.id }));
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

  // Fetch previous DM messages.
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!currentUser.id || !recepientId) return;
        const response = await fetch(
          `http://localhost:3010/v0/users/${currentUser.id}/${recepientId}/messages`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
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
  }, [currentUser.id, recepientId, token]);

  // Setup WebSocket connection for live DM updates.
  useEffect(() => {
    if (!currentUser.id || !recepientId) return;

    socketRef.current = new WebSocket('ws://localhost:3010');

    socketRef.current.onopen = () => {
      console.log('Connected to WebSocket server');
      const joinMsg = {
        type: 'dm',
        userId: currentUser.id,
        sender_name: currentUser.name,
        recepientId: recepientId
      };
      socketRef.current.send(JSON.stringify(joinMsg));
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'dm') {
          const newMsg = data.message;
          setMessages(prev => [...prev, newMsg]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socketRef.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [currentUser.id, currentUser.name, recepientId]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message.
  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;
    const msgData = {
      type: 'dm',
      senderId: currentUser.id,
      sender_name: currentUser.name,
      recepientId: recepientId,
      message: trimmedMessage,
      timestamp: new Date()
    };
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msgData));
    }
    // Optionally update UI immediately.
    setMessages(prev => [...prev, msgData]);
    setInputMessage('');
  };

  // Optional: Format received date (currently not used, but you could integrate it in MessageBubble)
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

  const scrollToBottom = () => {
    if (messageListRef && messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  return (
    <Container>
      <Messenger>
        <MessageList ref={messageListRef}>
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              profilePic={placeholder}
              username={msg.sender_name}
              text={msg.message}
              // Using toLocaleTimeString here; you can swap in formatReceivedDate(msg.timestamp) if preferred.
              timestamp={new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              iscurrentuser={currentUser.id === msg.senderId}
            />
          ))}
        </MessageList>
        <MessageInputC>
          <MessageInput
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </MessageInputC>
      </Messenger>
    </Container>
  );
};

export default FriendMessager;
