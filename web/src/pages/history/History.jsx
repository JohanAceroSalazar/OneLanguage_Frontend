import { useEffect, useMemo, useRef, useState } from "react";
import { FaCamera, FaChevronDown, FaClock, FaEyeSlash, FaPlay, FaTrash, FaVolumeUp } from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import NavBar from "../../components/NavBar/NavBar";
import { deleteAllTranslations, deleteTranslation, getTranslationRecording, getTranslations } from "../../services/translationService";
import "./History.css";
import { useTranslation } from "react-i18next";

function formatDate(dateValue, language, t) {
    if (!dateValue) return t("history.dateUnavailable");
    const locale = language === "en" ? "en-US" : language === "pt" ? "pt-BR" : language === "it" ? "it-IT" : "es-CO";
    return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(dateValue));
}

function History() {
    const { t, i18n } = useTranslation();
    const [translations, setTranslations] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
    const [recordingUrls, setRecordingUrls] = useState({});
    const [loadingRecordingId, setLoadingRecordingId] = useState(null);
    const filterRef = useRef(null);
    const recordingUrlsRef = useRef({});

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
                if (active) setError(t("history.loadError"));
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [t]);

    useEffect(() => () => {
        Object.values(recordingUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
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
            if (recordingUrls[id]) URL.revokeObjectURL(recordingUrls[id]);
            setRecordingUrls((urls) => {
                const next = { ...urls };
                delete next[id];
                recordingUrlsRef.current = next;
                return next;
            });
            setTranslations((items) => items.filter((item) => item.id !== id));
        } catch {
            setError(t("history.deleteError"));
        } finally {
            setDeletingId(null);
        }
    };

    const deleteAll = async () => {
        if (!translations.length) return;
        setDeleteAllDialogOpen(false);
        setDeletingId("all");
        try {
            await deleteAllTranslations();
            Object.values(recordingUrls).forEach((url) => URL.revokeObjectURL(url));
            recordingUrlsRef.current = {};
            setRecordingUrls({});
            setTranslations([]);
        } catch {
            setError(t("history.deleteHistoryError"));
        } finally {
            setDeletingId(null);
        }
    };

    const toggleRecording = async (translation) => {
        if (recordingUrls[translation.id]) {
            URL.revokeObjectURL(recordingUrls[translation.id]);
            setRecordingUrls((urls) => {
                const next = { ...urls };
                delete next[translation.id];
                recordingUrlsRef.current = next;
                return next;
            });
            return;
        }
        if (loadingRecordingId) return;
        setLoadingRecordingId(translation.id);
        try {
            const blob = await getTranslationRecording(translation.id);
            setRecordingUrls((urls) => {
                const next = { ...urls, [translation.id]: URL.createObjectURL(blob) };
                recordingUrlsRef.current = next;
                return next;
            });
        } catch {
            setError(t("history.recordingError"));
        } finally {
            setLoadingRecordingId(null);
        }
    };

    const speakTranslation = (text) => {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-CO";
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="history-container">
            <header className="history-header">
                <BrandLogo className="history-logo" />
                <NavBar />
            </header>

            <section className="history-title-section">
                <h1 className="history-title">{t("history.subtitle")}</h1>
            </section>

            {error && <p className="history-error" role="alert">{error}</p>}
            {loading ? (
                <div className="history-empty"><p className="empty-text">{t("history.loading")}</p></div>
            ) : visibleTranslations.length === 0 ? (
                <div className="history-empty">
                    <div className="history-card">
                        <FaCamera size={48} color="#999" />
                        <p className="empty-title">{t("history.empty")}</p>
                        <p className="empty-text">{t("history.emptyText")}</p>
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
                                    <button type="button" onClick={() => selectSortOrder("newest")}>{t("history.newest")}</button>
                                    <button type="button" onClick={() => selectSortOrder("oldest")}>{t("history.oldest")}</button>
                                </div>
                            )}
                        </div>
                        <button className="delete-all-btn" type="button" onClick={() => setDeleteAllDialogOpen(true)} disabled={deletingId === "all"} aria-label={t("history.deleteAll")} title={t("history.deleteAll")}><FaTrash aria-hidden="true" /></button>
                    </div>

                    <div className="history-list">
                        {visibleTranslations.map((translation) => (
                            <article key={translation.id} className="history-item">
                                <div className="history-item-img"><FaCamera size={24} color="white" aria-hidden="true" /></div>
                                <div className="history-item-info">
                                    <p className="item-title">{translation.translatedText}</p>
                                    <p className="item-date"><FaClock size={12} aria-hidden="true" /> {formatDate(translation.createdAt, i18n.language, t)}</p>
                                </div>
                                <div className="history-item-actions">
                                    <button className="history-action-btn" type="button" onClick={() => speakTranslation(translation.translatedText)} aria-label={t("history.listen")} title={t("history.listen")}><FaVolumeUp aria-hidden="true" /></button>
                                    {translation.hasRecording && <button className="history-action-btn" type="button" onClick={() => toggleRecording(translation)} disabled={loadingRecordingId === translation.id} aria-label={recordingUrls[translation.id] ? t("history.hideRecording") : t("history.playRecording")} title={recordingUrls[translation.id] ? t("history.hideRecording") : t("history.playRecording")}>{recordingUrls[translation.id] ? <FaEyeSlash aria-hidden="true" /> : <FaPlay aria-hidden="true" />}</button>}
                                    <button className="delete-one-btn" type="button" onClick={() => deleteOne(translation.id)} disabled={deletingId === translation.id} aria-label={t("history.delete")} title={t("history.delete")}><FaTrash aria-hidden="true" /></button>
                                </div>
                                {recordingUrls[translation.id] && <div className="history-recording"><video controls autoPlay preload="metadata" src={recordingUrls[translation.id]} /></div>}
                            </article>
                        ))}
                    </div>
                </>
            )}

            {deleteAllDialogOpen ? <div className="history-confirm-backdrop" role="presentation">
                <section className="history-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="history-confirm-title" aria-describedby="history-confirm-message">
                    <h2 id="history-confirm-title">{t("history.deleteAll")}</h2>
                    <p id="history-confirm-message">{t("history.deleteAllConfirm")}</p>
                    <div className="history-confirm-actions">
                        <button type="button" className="history-confirm-cancel" onClick={() => setDeleteAllDialogOpen(false)}>{t("common.cancel")}</button>
                        <button type="button" className="history-confirm-delete" onClick={deleteAll}>{t("history.deleteAll")}</button>
                    </div>
                </section>
            </div> : null}
        </div>
    );
}

export default History;
