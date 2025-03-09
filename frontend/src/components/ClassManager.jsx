import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 340px;
  padding: 20px;
  border: 3px solid var(--tertiary);
  border-radius: 1rem;
`;

const ClassInput = styled.div`
  display:flex;
  justify-content:space-between;
`;

const ClassList = styled.div`
  display:flex;
  flex-wrap:wrap;
  padding-top:10px;
`;

const ClassItem = styled.div`
  border-radius: 1rem;
    padding:10px;
    background-color: var(--secondary);
    margin:5px;
    display:flex;
    justify-content: space-between;
    align-items:center;
`;

const RemoveButton = styled.button`
  border: none;
  align-items:center;
  display:flex;
  transition:none;
  cursor: pointer;
  padding:0px;
  padding-left:5px;

  &:hover {
    background: none;
    color: inherit;
    border: none;
  }
`;

const ClassManager = ({ userId, refreshClasses }) => {
  const [userClasses, setUserClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUserClasses();
  }, []);

  const fetchUserClasses = async () => {
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

  const handleAddClass = async () => {
    if (!newClassName.trim()) return;

    try {
      const response = await fetch(`http://localhost:3010/v0/profile/${userId}/classes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ class_name: newClassName.toUpperCase() }), // Convert to lowercase for case-insensitivity
      });

      if (response.ok) {
        const newClass = await response.json();
        setUserClasses([...userClasses, newClass]);
        setNewClassName("");
        setSuccess("Class added successfully");
        setError("");
        refreshClasses();
      } else if (response.status === 400) {
        setError("Invalid class data");
        setSuccess("");
      } else {
        setError("Unexpected error while adding class");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add class");
      setSuccess("");
    }
  };

  const handleRemoveClass = async (classId) => {
    try {
      const response = await fetch(`http://localhost:3010/v0/profile/${userId}/classes/${classId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        setUserClasses(userClasses.filter((c) => c.id !== classId));
        setSuccess("Class removed successfully");
        setError("");
        refreshClasses();
      } else if (response.status === 404) {
        setError("Class not found");
        setSuccess("");
      } else {
        setError("Could not remove class");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to remove class");
      setSuccess("");
    }
  };

  return (
    <Container>      
      <h3>Change Classes</h3>
      <ClassInput>
      <input
        type="text"
        placeholder="Course Number"
        value={newClassName}
        maxLength={10}
        onChange={(e) => setNewClassName(e.target.value)}
      />
      <button onClick={handleAddClass}>Add</button>
      </ClassInput>

      <ClassList>
        {userClasses.map((c) => (
          <ClassItem key={c.id}>
            {c.class_name}
            <RemoveButton onClick={() => handleRemoveClass(c.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg></RemoveButton>
          </ClassItem>
        ))}
      </ClassList>
    </Container>
  );
};

export default ClassManager;
