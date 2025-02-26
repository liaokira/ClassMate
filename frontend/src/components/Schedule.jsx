import { useState } from 'react';
import styled from "styled-components";
import ClassManager from "../components/ClassManager";

const PageContainer = styled.body`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

const Classes = styled.body`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 3px solid var(--tertiary);
  border-radius: 1rem;
`;

const Schedule = ({profileData, ownPage}) => {

  return (
    <PageContainer>
      {ownPage &&
        <ClassManager  userId={profileData.id}/>
      }
      <h2>{ownPage ? 'Your Schedule' : 'Their Schedule'}</h2>
      <Classes>
        <div>List 1</div>
        <div>List 2</div>
        <div>List 3</div>
        <div>List 4</div>
      </Classes>
    </PageContainer>
  );
};

export default Schedule
