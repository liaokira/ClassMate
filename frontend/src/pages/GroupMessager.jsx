import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const GroupMessenger = () => {
  const { groupid } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({ id: '', name: '' });
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

  // Setup the WebSocket connection.
  useEffect(() => {
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
  }, [groupid, currentUser.id, currentUser.name]);

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
    <div className="group-messenger">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender_name}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default GroupMessenger;
