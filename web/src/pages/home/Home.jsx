import { useNavigate, useLocation } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const userName = "usuario";

    return (
        <div className="home-container">

            {/* HEADER */}
            <div className="home-header">
                <div className="home-logo">
                    <span>ONE<br/>LANGUAGE</span>
                </div>

                {/* NAVBAR */}
                <nav className="navbar">
                    <span className={location.pathname === "/home" ? "nav-item active" : "nav-item"} onClick={() => navigate("/home")}>Home</span>
                    <span className={location.pathname === "/translate" ? "nav-item active" : "nav-item"} onClick={() => navigate("/translate")}>Traducir</span>
                    <span className={location.pathname === "/historial" ? "nav-item active" : "nav-item"} onClick={() => navigate("/historial")}>Historial</span>
                    <span className={location.pathname === "/accesibilidad" ? "nav-item active" : "nav-item"} onClick={() => navigate("/accesibilidad")}>Accesibilidad</span>
                    <span className={location.pathname === "/perfil" ? "nav-item active" : "nav-item"} onClick={() => navigate("/perfil")}>Perfil</span>
                </nav>
            </div>

            {/* SALUDO */}
            <p className="home-greeting">Hola {userName} bienvenido</p>

            {/* TARJETA */}
            <div className="home-card">
                <h1>¡Bienvenido a One Language!</h1>
                <p>
                    One Language es una aplicación diseñada para traducir el lenguaje
                    de señas colombiano a texto y audio en tiempo real, promoviendo
                    la inclusión y la comunicación sin barreras en Colombia.
                </p>
                <button className="home-btn" onClick={() => navigate("/translate")}>
                    Comenzar a traducir
                </button>
            </div>

        </div>
    );
}

export default Home;