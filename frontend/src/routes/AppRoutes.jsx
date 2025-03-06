import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Logout from "../pages/Logout";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Nav from "../components/Nav";
import ProtectedRoute from "../routes/ProtectedRoute";
import PostLoginRoutes from "../routes/PostLoginRoutes";
import Login from "../pages/Login";
import GroupsPage from "../pages/Groups";
import GroupCreate from "../pages/GroupCreate";
import GroupMessenger from "../pages/GroupMessager";
import JoinGroup from "../pages/JoinGroup";

const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
    return (
      <Router>
        <Nav isAuthenticated = {isAuthenticated}/>
        <div style={{marginTop: 12 + 'vh'}}>
            <Routes>
            <Route
                path="/"
                element={
                <PostLoginRoutes isAuthenticated={isAuthenticated}>
                    <Landing />
                </PostLoginRoutes>
                }
            />
            <Route
                path="/register"
                element={
                <PostLoginRoutes isAuthenticated={isAuthenticated}>
                    <Register />
                </PostLoginRoutes>
                }
            />
            <Route
                path="/login"
                element={
                <PostLoginRoutes isAuthenticated={isAuthenticated}>
                    <Login setIsAuthenticated={setIsAuthenticated}/>
                </PostLoginRoutes>
                }
            />
            <Route
                path="/profile/:userId"
                element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Profile />
                </ProtectedRoute>
                }
            />
            <Route
                path="/groups"
                element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <GroupsPage />
                </ProtectedRoute>
                }
            />
            <Route
                path="/group/:groupId"
                element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <JoinGroup />
                </ProtectedRoute>
                }
            />
            <Route
                path="/creategroup"
                element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <GroupCreate />
                </ProtectedRoute>
                }
            />
            <Route
                path="/messaging/:groupid"
                element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <GroupMessenger />
                </ProtectedRoute>
                }
            />
            <Route
                path="/logout"
                element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Logout setIsAuthenticated={setIsAuthenticated}/>
                </ProtectedRoute>
                }
            />
            </Routes>
        </div>
      </Router>
    );
  };

export default AppRoutes;