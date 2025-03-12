import { Navigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const PostLoginRoutes = ({ isAuthenticated, children }) => {
  return !isAuthenticated ? children : <Navigate to="/groups" />;
};

export default PostLoginRoutes;