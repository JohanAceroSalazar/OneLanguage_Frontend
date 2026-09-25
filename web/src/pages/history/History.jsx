import { useEffect, useMemo, useRef, useState } from "react";
import { FaCamera, FaChevronDown, FaClock, FaTrash } from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import NavBar from "../../components/NavBar/NavBar";
import { deleteAllTranslations, deleteTranslation, getTranslations } from "../../services/translationService";
import "./History.css";

function formatDate(dateValue) {
    if (!dateValue) return "Fecha no disponible";
    return new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(dateValue));
}

function History() {
    const [translations, setTranslations] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const filterRef = useRef(null);

    useEffect(() => {
        const closeFilterOnOutsideClick = (event) => {
            if (!filterRef.current?.contains(event.target)) setFilterOpen(false);
        };
        document.addEventListener("pointerdown", closeFilterOnOutsideClick);
        return () => document.removeEventListener("pointerdown", closeFilterOnOutsideClick);
    }, []);

    useEffect(() => {
        let active = true;
        getTranslations()
            .then((items) => {
                if (active) setTranslations(items);
            })
            .catch(() => {
                if (active) setError("No se pudo cargar el historial.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const visibleTranslations = useMemo(() => [...translations].sort((first, second) => {
        const firstDate = new Date(first.createdAt).getTime();
        const secondDate = new Date(second.createdAt).getTime();
        return sortOrder === "newest" ? secondDate - firstDate : firstDate - secondDate;
    }), [sortOrder, translations]);

    const selectSortOrder = (nextOrder) => {
        setSortOrder(nextOrder);
        setFilterOpen(false);
    };

    const deleteOne = async (id) => {
        setDeletingId(id);
        try {
            await deleteTranslation(id);
            setTranslations((items) => items.filter((item) => item.id !== id));
        } catch {
            setError("No se pudo eliminar la traduccion.");
        } finally {
            setDeletingId(null);
        }
    };

    const deleteAll = async () => {
        if (!translations.length || !window.confirm("Se eliminaran todas las traducciones guardadas.")) return;
        setDeletingId("all");
        try {
            await deleteAllTranslations();
            setTranslations([]);
        } catch {
            setError("No se pudo eliminar el historial.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="history-container">
            <header className="history-header">
                <BrandLogo className="history-logo" />
                <NavBar />
            </header>

            <section className="history-title-section">
                <h1 className="history-title">Revisa tus traducciones anteriores</h1>
            </section>

            {error && <p className="history-error" role="alert">{error}</p>}
            {loading ? (
                <div className="history-empty"><p className="empty-text">Cargando historial...</p></div>
            ) : visibleTranslations.length === 0 ? (
                <div className="history-empty">
                    <div className="history-card">
                        <FaCamera size={48} color="#999" />
                        <p className="empty-title">No hay traducciones guardadas</p>
                        <p className="empty-text">Finaliza una traduccion y selecciona Guardar en historial para verla aqui.</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="history-controls">
                        <div className="filter-wrapper" ref={filterRef}>
                            <button className="filter-btn" type="button" onClick={() => setFilterOpen((open) => !open)}>
                                {sortOrder === "newest" ? "Mas reciente" : "Mas antiguo"} <FaChevronDown aria-hidden="true" />
                            </button>
                            {filterOpen && (
                                <div className="filter-dropdown">
                                    <button type="button" onClick={() => selectSortOrder("newest")}>Mas reciente</button>
                                    <button type="button" onClick={() => selectSortOrder("oldest")}>Mas antiguo</button>
                                </div>
                            )}
                        </div>
                        <button className="delete-all-btn" type="button" onClick={deleteAll} disabled={deletingId === "all"} aria-label="Eliminar todo el historial" title="Eliminar todo el historial"><FaTrash aria-hidden="true" /></button>
                    </div>

                    <div className="history-list">
                        {visibleTranslations.map((translation) => (
                            <article key={translation.id} className="history-item">
                                <div className="history-item-img"><FaCamera size={24} color="white" aria-hidden="true" /></div>
                                <div className="history-item-info">
                                    <p className="item-title">{translation.translatedText}</p>
                                    <p className="item-date"><FaClock size={12} aria-hidden="true" /> {formatDate(translation.createdAt)}</p>
                                </div>
                                <button className="delete-one-btn" type="button" onClick={() => deleteOne(translation.id)} disabled={deletingId === translation.id} aria-label="Eliminar traduccion" title="Eliminar traduccion"><FaTrash aria-hidden="true" /></button>
                            </article>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default History;
