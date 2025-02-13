import { Navigate } from "react-router-dom";

const PostLoginRoutes = ({ isAuthenticated, children }) => {
  return !isAuthenticated ? children : <Navigate to="/groups" />;
};

export default PostLoginRoutes;