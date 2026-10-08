import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./NavBar.css";

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    return (
        <nav className="app-navbar">
            <span className={location.pathname === "/home" ? "app-nav-item active" : "app-nav-item"} onClick={() => navigate("/home")}>{t("nav.home")}</span>
            <span className={location.pathname === "/translate" ? "app-nav-item active" : "app-nav-item"} onClick={() => navigate("/translate")}>{t("nav.translate")}</span>
            <span className={location.pathname === "/history" ? "app-nav-item active" : "app-nav-item"} onClick={() => navigate("/history")}>{t("nav.history")}</span>
            <span className={location.pathname === "/accessibility" ? "app-nav-item active" : "app-nav-item"} onClick={() => navigate("/accessibility")}>{t("nav.accessibility")}</span>
            <span className={location.pathname === "/profile" ? "app-nav-item active" : "app-nav-item"} onClick={() => navigate("/profile")}>{t("nav.profile")}</span>
        </nav>
    );
}

export default NavBar;
