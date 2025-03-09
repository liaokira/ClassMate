import { useState, useEffect } from 'react';
import styled from "styled-components";
import ClassManager from "../components/ClassManager";

const PageContainer = styled.body`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

const Classes = styled.body`
  min-width: 24vw;
`;

const ClassItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid var(--tertiary);
`;

const Schedule = ({userId, profileData, ownPage}) => {
  const [userClasses, setUserClasses] = useState([]);

  const refreshClasses = async () => {
    try {
      const response = await fetch(`http://localhost:3010/v0/profile/${userId}/classes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUserClasses(data);
      } else {
        throw new Error("Failed to fetch user classes");
      }
    } catch (err) {
      console.error(err);
      setError("Could not load user classes");
    }
  };
  
  useEffect(() => {
    refreshClasses();
  }, [userId]);

  return (
    <PageContainer>
      {ownPage &&
        <ClassManager userId={profileData.id} refreshClasses={refreshClasses}/>
      }
      <h2>{ownPage ? 'Your Classes' : 'Their Classes'}</h2>
      <Classes>
        {userClasses.map((c) => (
          <ClassItem key={c.id}>
            <h3 style={{ textTransform: 'uppercase' }}>{c.class_name}</h3>
          </ClassItem>
        ))}
      </Classes>
    </PageContainer>
  );
};

export default Schedule
