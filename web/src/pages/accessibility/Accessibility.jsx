import { useEffect, useState } from "react";
import { FaFont, FaCheck, FaGlobe, FaMoon, FaSun } from "react-icons/fa";
import NavBar from "../../components/NavBar/NavBar";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import "./Accessibility.css";

const fontSizeOptions = {
    Pequeño: 0.92,
    Mediano: 1,
    Grande: 1.08,
};

function Accessibility() {
    const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "Mediano");
    const [savedTheme, setSavedTheme] = useState(() => localStorage.getItem("theme") || "light");
    const [selectedTheme, setSelectedTheme] = useState(savedTheme);
    const [savedLanguage, setSavedLanguage] = useState(() => localStorage.getItem("language") || "Español");
    const [selectedLanguage, setSelectedLanguage] = useState(savedLanguage);
    const [showFontMenu, setShowFontMenu] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const zoom = fontSizeOptions[fontSize] || 1;
        document.body.style.zoom = String(zoom);
        document.documentElement.dataset.textSize = fontSize;
    }, [fontSize]);

    useEffect(() => {
        document.documentElement.dataset.theme = savedTheme;
        document.documentElement.style.colorScheme = savedTheme;
    }, [savedTheme]);

    const handleSave = () => {
        setSavedTheme(selectedTheme);
        setSavedLanguage(selectedLanguage);

        localStorage.setItem("theme", selectedTheme);
        localStorage.setItem("language", selectedLanguage);
        localStorage.setItem("fontSize", fontSize);

        document.documentElement.dataset.theme = selectedTheme;
        document.documentElement.style.colorScheme = selectedTheme;

        setShowFontMenu(false);
        setShowLangMenu(false);
        setShowThemeMenu(false);
        setShowSuccess(true);
    };

    const openMenu = (menu) => {
        setShowFontMenu(menu === "font");
        setShowLangMenu(menu === "lang");
        setShowThemeMenu(menu === "theme");
    };

    return (
        <div className="access-container">
            <div className="access-header">
                <BrandLogo className="access-logo" />
                <NavBar />
            </div>

            <div className="access-card">
                <div className="access-row">
                    <div className="access-label">
                        <FaFont size={20} />
                        <span>Ajustar texto</span>
                    </div>
                    <div className="access-control">
                        <button type="button" className="access-btn" onClick={() => openMenu(showFontMenu ? null : "font")}>
                            Ajustar
                        </button>
                        {showFontMenu && (
                            <div className="access-dropdown">
                                {Object.keys(fontSizeOptions).map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={fontSize === size ? "selected" : ""}
                                        onClick={() => setFontSize(size)}
                                    >
                                        <span>{size}</span>
                                        {fontSize === size && <FaCheck size={12} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="access-divider" />

                <div className="access-row">
                    <div className="access-label">
                        <FaMoon size={20} />
                        <span>Cambiar colores</span>
                    </div>
                    <div className="access-control">
                        <button type="button" className="access-btn" onClick={() => openMenu(showThemeMenu ? null : "theme")}>
                            Ajustar
                        </button>
                        {showThemeMenu && (
                            <div className="access-theme-picker">
                                <p className="color-title">Tema visual</p>
                                <div className="theme-options">
                                    <button
                                        type="button"
                                        className={selectedTheme === "light" ? "theme-option selected" : "theme-option"}
                                        onClick={() => setSelectedTheme("light")}
                                    >
                                        <FaSun /> Claro
                                    </button>
                                    <button
                                        type="button"
                                        className={selectedTheme === "dark" ? "theme-option selected" : "theme-option"}
                                        onClick={() => setSelectedTheme("dark")}
                                    >
                                        <FaMoon /> Oscuro
                                    </button>
                                </div>
                                <p className="theme-hint">
                                    {selectedTheme === "dark" ? "Oscuro" : "Claro"} seleccionado. Se aplica solo al guardar.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="access-divider" />

                <div className="access-row">
                    <div className="access-label">
                        <FaGlobe size={20} />
                        <span>Idioma</span>
                    </div>
                    <div className="access-control">
                        <button type="button" className="access-btn" onClick={() => openMenu(showLangMenu ? null : "lang")}>
                            Cambiar
                        </button>
                        {showLangMenu && (
                            <div className="access-dropdown">
                                {["Español", "Inglés", "Portugués", "Francés"].map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        className={selectedLanguage === lang ? "selected" : ""}
                                        onClick={() => setSelectedLanguage(lang)}
                                    >
                                        <span>{lang}</span>
                                        {selectedLanguage === lang && <FaCheck size={12} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="access-divider" />

                <button type="button" className="access-save-btn" onClick={handleSave}>
                    Guardar cambios
                </button>
            </div>

            {showSuccess && (
                <div className="modal-overlay">
                    <div className="access-modal-box">
                        <p className="access-modal-text">Cambios de accesibilidad<br />guardados correctamente</p>
                        <button type="button" className="access-modal-btn" onClick={() => setShowSuccess(false)}>
                            Ok
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Accessibility;
