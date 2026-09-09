import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeBootstrap from "../components/ThemeBootstrap/ThemeBootstrap";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Terms from "../pages/terms/Terms";
import Home from "../pages/home/Home";
import Landing from "../pages/landing/Landing";
import ForgotPassword from "../pages/forgotpassword/ForgotPassword";
import Translate from "../pages/translate/Translate";
import History from "../pages/history/History";
import Accessibility from "../pages/accessibility/Accessibility";
import Profile from "../pages/profile/Profile";
import ResetPassword from "../pages/resetpassword/ResetPassword";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

function AppRoutes() {
    return (
    <BrowserRouter>
        <ThemeBootstrap />
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/translate" element={<Translate />} />
                <Route path="/history" element={<History />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="/profile" element={<Profile />} />
            </Route>
        </Routes>
    </BrowserRouter>
    );
}

export default AppRoutes;
