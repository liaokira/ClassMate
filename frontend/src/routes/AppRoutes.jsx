import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Nav from "../components/Nav";
import ProtectedRoute from "../routes/ProtectedRoute";
import Login from "../pages/Login";
import GroupsPage from "../pages/Groups";

const AppRoutes = ({ isAuthenticated }) => {
    return (
      <Router>
        <Nav />
        <div style={{marginTop: 6 + 'rem'}}>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/groups" element={<GroupsPage />} />
            
            <Route
                path="/profile"
                element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Profile />
                </ProtectedRoute>
                }
            />
            </Routes>
        </div>
      </Router>
    );
  };

export default AppRoutes;