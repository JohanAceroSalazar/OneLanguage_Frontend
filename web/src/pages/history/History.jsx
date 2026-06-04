import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./History.css";
import { FaTrash, FaClock, FaCamera, FaChevronDown } from "react-icons/fa";

const mockTranslations = [
    { id: 1, title: "Traducción", date: "10/12/25", image: null },
    { id: 2, title: "Traducción", date: "8/12/25", image: null },
    { id: 3, title: "Traducción", date: "20/11/25", image: null },
    { id: 4, title: "Traducción", date: "1/10/25", image: null },
];

function History() {
    const [translations, setTranslations] = useState(mockTranslations);
    const [filterOpen, setFilterOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const deleteOne = (id) => {
        setTranslations(translations.filter(t => t.id !== id));
    };

    const deleteAll = () => {
        setTranslations([]);
    };

    return (
        <div className="history-container">

            {/* HEADER */}
            <div className="history-header">
                <div className="history-logo">
                    <span>ONE<br/>LANGUAGE</span>
                </div>
                <nav className="navbar">
                    <span className={location.pathname === "/home" ? "nav-item active" : "nav-item"} onClick={() => navigate("/home")}>Home</span>
                    <span className={location.pathname === "/translate" ? "nav-item active" : "nav-item"} onClick={() => navigate("/translate")}>Traducir</span>
                    <span className={location.pathname === "/historial" ? "nav-item active" : "nav-item"} onClick={() => navigate("/historial")}>Historial</span>
                    <span className={location.pathname === "/accesibilidad" ? "nav-item active" : "nav-item"} onClick={() => navigate("/accesibilidad")}>Accesibilidad</span>
                    <span className={location.pathname === "/perfil" ? "nav-item active" : "nav-item"} onClick={() => navigate("/perfil")}>Perfil</span>
                </nav>
            </div>

            {/* TÍTULO */}
            <div className="history-title-section">
                <h2 className="history-title">Historial de traducción</h2>
                <p className="history-subtitle">Revisa tus traducciones anteriores</p>
            </div>

            {/* SIN TRADUCCIONES */}
            {translations.length === 0 ? (
                <div className="history-empty">
                    <div className="history-card">
                        <FaCamera size={48} color="#999" />
                        <p className="empty-title">No hay traducciones</p>
                        <p className="empty-text">Comienza a usar el reconocimiento de señas para guardar traducciones.</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* FILTRO Y BORRAR TODO */}
                    <div className="history-controls">
                        <div className="filter-wrapper">
                            <button className="filter-btn" onClick={() => setFilterOpen(!filterOpen)}>
                                Filtrar por fecha <FaChevronDown />
                            </button>
                            {filterOpen && (
                                <div className="filter-dropdown">
                                    <p onClick={() => setFilterOpen(false)}>Más reciente</p>
                                    <p onClick={() => setFilterOpen(false)}>Más antiguo</p>
                                </div>
                            )}
                        </div>
                        <button className="delete-all-btn" onClick={deleteAll}>
                            <FaTrash />
                        </button>
                    </div>

                    {/* LISTA */}
                    <div className="history-list">
                        {translations.map(t => (
                            <div key={t.id} className="history-item">
                                <div className="history-item-img">
                                    <FaCamera size={24} color="white" />
                                </div>
                                <div className="history-item-info">
                                    <p className="item-title">{t.title}</p>
                                    <p className="item-date"><FaClock size={12} /> {t.date}</p>
                                </div>
                                <button className="delete-one-btn" onClick={() => deleteOne(t.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default History;