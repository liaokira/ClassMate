import { useState } from 'react';
import styled from "styled-components";
import ClassManager from "../components/ClassManager";

const PageContainer = styled.body`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

const Schedule = ({profileData, ownPage}) => {

  return (
    <PageContainer>
      {ownPage &&
        <ClassManager  userId={profileData.id}/>
      }
    </PageContainer>
  );
};

export default Schedule
