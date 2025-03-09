import React from "react";
import styled from "styled-components";
import placeholder from '../assets/placeholder.png'; // Adjust path if needed

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  justify-content: ${({ iscurrentuser }) => (iscurrentuser ? "flex-end" : "flex-start")};
  text-align: ${({ iscurrentuser }) => (iscurrentuser ? "right" : "left")};
`;

const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  order: ${({ iscurrentuser }) => (iscurrentuser ? 2 : 0)}; /* Moves pic to right if it's currentUser */
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 60%;
`;

const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  color: black;
`;

const MessageBubble = styled.div`
  background-color: var(--primary);
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 0.95rem;
  color: black;
  text-align:left;
  word-wrap: break-word;
`;

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: var(--tertiary);
  margin-top: 4px;
`;

const Message = ({ profilePic, username, text, timestamp, iscurrentuser }) => {
  if (profilePic == null){
    profilePic = placeholder;
  }
  return (
    <MessageContainer iscurrentuser={iscurrentuser}>
      {!iscurrentuser && <ProfilePic src={profilePic} alt="User Profile" />}
      <MessageContent>
        {!iscurrentuser&&(
            <UserName>{username}</UserName>
        )}
        <MessageBubble iscurrentuser={iscurrentuser}>{text}</MessageBubble>
        <Timestamp>{timestamp}</Timestamp>
      </MessageContent>
      {iscurrentuser && <ProfilePic src={profilePic} alt="User Profile" iscurrentuser />}
    </MessageContainer>
  );
};

export default Message;

