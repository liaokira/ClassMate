import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Groups from "../pages/Groups";
import Logout from "../pages/Logout";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Nav from "../components/Nav";
import ProtectedRoute from "../routes/ProtectedRoute";
import PostLoginRoutes from "../routes/PostLoginRoutes";
import Login from "../pages/Login";

const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
    return (
      <Router>
        <Nav isAuthenticated = {isAuthenticated}/>
        <div style={{marginTop: 6 + 'rem'}}>
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
                    <Groups />
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