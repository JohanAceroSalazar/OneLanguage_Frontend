import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./NavBar.css";

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const items = [
        ["/home", "nav.home"],
        ["/translate", "nav.translate"],
        ["/history", "nav.history"],
        ["/accessibility", "nav.accessibility"],
        ["/profile", "nav.profile"],
    ];

    const goTo = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <nav className="app-navbar" aria-label="Navegación principal">
            <button
                type="button"
                className="app-nav-toggle"
                aria-expanded={isOpen}
                aria-controls="main-navigation-links"
                onClick={() => setIsOpen((open) => !open)}
            >
                <span aria-hidden="true">☰</span>
                <span className="app-nav-toggle-label">Menú</span>
            </button>
            <div id="main-navigation-links" className={isOpen ? "app-nav-links is-open" : "app-nav-links"}>
                {items.map(([path, key]) => (
                    <button
                        type="button"
                        key={path}
                        className={location.pathname === path ? "app-nav-item active" : "app-nav-item"}
                        onClick={() => goTo(path)}
                    >
                        {t(key)}
                    </button>
                ))}
            </div>
        </nav>
    );
}

export default NavBar;
