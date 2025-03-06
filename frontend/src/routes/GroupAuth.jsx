import {Navigate, useParams} from 'react-router-dom';
import { useState, useEffect } from "react";
import Blank from '../pages/Blank'
import PropTypes from 'prop-types';

const GroupAuth = ({children}) => {
    const { groupid } = useParams();
    const [isMember, setIsMember] = useState(null);
    console.log(groupid);

    const decodeToken = (token) => {
        const payload = token.split('.')[1];
        const decode = atob(payload);
        return JSON.parse(decode);
      }
    
      const token = localStorage.getItem('accessToken');
      const decodeId = decodeToken(token);
      const userId = decodeId?.id;

useEffect(() => {
  const checkMembership = async () => {
    try {
      const response = await fetch(`http://localhost:3010/v0/group/${groupid}/membership/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // If authentication is required
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to check membership");
      }

      const data = await response.json(); // Assuming the backend returns a boolean
      console.log(data.member);
      setIsMember(data.member); 
    } catch (error) {
      console.error("Error checking membership:", error);
      setIsMember(false); // Default to false in case of an error
    }
  };

  checkMembership();
}, [groupid, userId]);

if (isMember === null) {
    return <Blank/>; // Avoid premature redirection
}

return isMember ? children : <Navigate to={`/group/${groupid}`} replace />;
};

export default GroupAuth;