import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Terms from "../pages/terms/Terms";
import Home from "../pages/home/Home";
import RecoverPassword from "../pages/recoverpassword/RecoverPassword";
import Translate from "../pages/translate/Translate";
import History from "../pages/history/History";

function AppRoutes() {
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/home" element={<Home />} />
            <Route path="/recoverpassword" element={<RecoverPassword />} />
            <Route path="/translate" element={<Translate />} />
            <Route path="/historial" element={<History />} />
        </Routes>
    </BrowserRouter>
    );
}

export default AppRoutes;