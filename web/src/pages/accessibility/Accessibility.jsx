import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Accessibility.css";
import { FaFont, FaPalette, FaGlobe, FaCheck } from "react-icons/fa";

function Accessibility() {
    const navigate = useNavigate();
    const location = useLocation();

    const [fontSize, setFontSize] = useState("Mediano");
    const [language, setLanguage] = useState("Español");
    const [color, setColor] = useState("#3A78C2");
    const [showFontMenu, setShowFontMenu] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        setShowFontMenu(false);
        setShowLangMenu(false);
        setShowColorPicker(false);
        setShowSuccess(true);
    };

    return (
        <div className="access-container">

            {/* HEADER */}
            <div className="access-header">
                <div className="access-logo">
                    <span>ONE<br/>LANGUAGE</span>
                </div>
                <nav className="navbar">
                    <span className={location.pathname === "/home" ? "nav-item active" : "nav-item"} onClick={() => navigate("/home")}>Home</span>
                    <span className={location.pathname === "/translate" ? "nav-item active" : "nav-item"} onClick={() => navigate("/translate")}>Traducir</span>
                    <span className={location.pathname === "/history" ? "nav-item active" : "nav-item"} onClick={() => navigate("/history")}>Historial</span>
                    <span className={location.pathname === "/accessibility" ? "nav-item active" : "nav-item"} onClick={() => navigate("/accessibility")}>Accesibilidad</span>
                    <span className={location.pathname === "/profile" ? "nav-item active" : "nav-item"} onClick={() => navigate("/profile")}>Perfil</span>
                </nav>
            </div>

            {/* TÍTULO */}
            <p className="access-title">Accesibilidad</p>

            {/* TARJETA */}
            <div className="access-card">

                {/* AJUSTAR TEXTO */}
                <div className="access-row">
                    <div className="access-label">
                        <FaFont size={20} />
                        <span>Ajustar texto</span>
                    </div>
                    <div className="access-control">
                        <button className="access-btn" onClick={() => {
                            setShowFontMenu(!showFontMenu);
                            setShowLangMenu(false);
                            setShowColorPicker(false);
                        }}>
                            Ajustar
                        </button>
                        {showFontMenu && (
                            <div className="access-dropdown">
                                {["Pequeño", "Mediano", "Grande"].map(size => (
                                    <p key={size} className={fontSize === size ? "selected" : ""} onClick={() => { setFontSize(size); }}>
                                        {size} {fontSize === size && <FaCheck size={12} />}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="access-divider" />

                {/* CAMBIAR COLORES */}
                <div className="access-row">
                    <div className="access-label">
                        <FaPalette size={20} />
                        <span>Cambiar colores</span>
                    </div>
                    <div className="access-control">
                        <button className="access-btn" onClick={() => {
                            setShowColorPicker(!showColorPicker);
                            setShowFontMenu(false);
                            setShowLangMenu(false);
                        }}>
                            Ajustar
                        </button>
                        {showColorPicker && (
                            <div className="access-color-picker">
                                <p className="color-title">Colores</p>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="color-input"
                                />
                                <button className="apply-btn" onClick={() => setShowColorPicker(false)}>
                                    Aplicar cambios
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="access-divider" />

                {/* IDIOMA */}
                <div className="access-row">
                    <div className="access-label">
                        <FaGlobe size={20} />
                        <span>Idioma</span>
                    </div>
                    <div className="access-control">
                        <button className="access-btn" onClick={() => {
                            setShowLangMenu(!showLangMenu);
                            setShowFontMenu(false);
                            setShowColorPicker(false);
                        }}>
                            Cambiar
                        </button>
                        {showLangMenu && (
                            <div className="access-dropdown">
                                {["Español", "Inglés", "Portugués", "Francés"].map(lang => (
                                    <p key={lang} className={language === lang ? "selected" : ""} onClick={() => { setLanguage(lang); }}>
                                        {lang} {language === lang && <FaCheck size={12} />}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="access-divider" />

                {/* GUARDAR */}
                <button className="save-btn" onClick={handleSave}>
                    Guardar cambios
                </button>
            </div>

            {/* MODAL ÉXITO */}
            {showSuccess && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <p className="modal-text">Cambios de accesibilidad<br/>guardados correctamente</p>
                        <button className="modal-btn" onClick={() => setShowSuccess(false)}>Ok</button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Accessibility;