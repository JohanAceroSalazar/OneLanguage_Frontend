import { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./NavBar.css";

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const toggleRef = useRef(null);
    const panelRef = useRef(null);
    const navigationId = useId();

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

    const closeMenu = () => {
        setIsOpen(false);
        toggleRef.current?.focus();
    };

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") closeMenu();
        };

        window.addEventListener("keydown", handleKeyDown);
        const frame = window.requestAnimationFrame(() => {
            panelRef.current?.querySelector("[data-nav-item]")?.focus();
        });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.cancelAnimationFrame(frame);
        };
    }, [isOpen]);

    return (
        <nav className="app-navbar" aria-label="Navegación principal">
            <button
                type="button"
                className="app-nav-toggle"
                ref={toggleRef}
                aria-expanded={isOpen}
                aria-controls={isOpen ? navigationId : undefined}
                onClick={() => setIsOpen((open) => !open)}
            >
                <span aria-hidden="true">☰</span>
                <span className="app-nav-toggle-label">Menú</span>
            </button>
            <div className="app-nav-links">
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
            {isOpen ? <>
                <button type="button" className="app-nav-backdrop" onClick={closeMenu} aria-label="Cerrar menú" />
                <div id={navigationId} className="app-nav-drawer" ref={panelRef} role="dialog" aria-modal="true" aria-label="Menú principal">
                    <div className="app-nav-drawer-header">
                        <span>{t("nav.menu", { defaultValue: "Menú" })}</span>
                        <button type="button" className="app-nav-close" onClick={closeMenu} aria-label="Cerrar menú">×</button>
                    </div>
                    <div className="app-nav-drawer-links">
                        {items.map(([path, key]) => (
                            <button
                                type="button"
                                key={path}
                                data-nav-item
                                className={location.pathname === path ? "app-nav-item active" : "app-nav-item"}
                                onClick={() => goTo(path)}
                            >
                                {t(key)}
                            </button>
                        ))}
                    </div>
                </div>
            </> : null}
        </nav>
    );
}

export default NavBar;
