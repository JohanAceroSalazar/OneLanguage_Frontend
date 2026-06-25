import { useLocation, useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="navbar">
            <span className={location.pathname === "/home" ? "nav-item active" : "nav-item"} onClick={() => navigate("/home")}>Inicio</span>
            <span className={location.pathname === "/translate" ? "nav-item active" : "nav-item"} onClick={() => navigate("/translate")}>Traducir</span>
            <span className={location.pathname === "/history" ? "nav-item active" : "nav-item"} onClick={() => navigate("/history")}>Historial</span>
            <span className={location.pathname === "/accessibility" ? "nav-item active" : "nav-item"} onClick={() => navigate("/accessibility")}>Accesibilidad</span>
            <span className={location.pathname === "/profile" ? "nav-item active" : "nav-item"} onClick={() => navigate("/profile")}>Perfil</span>
        </nav>
    );
}

export default NavBar;
