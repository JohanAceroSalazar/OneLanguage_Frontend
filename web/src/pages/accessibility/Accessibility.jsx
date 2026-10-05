import { useEffect, useRef, useState } from "react";
import { FaFont, FaCheck, FaGlobe, FaMoon, FaSun } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18n, { languageOptions } from "../../i18n";
import NavBar from "../../components/NavBar/NavBar";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import { updateAccessibilitySettings } from "../../services/accessibilityService";
import "./Accessibility.css";

const fontSizeOptions = {
    small: 0.92,
    medium: 1,
    large: 1.08,
};

function Accessibility() {
    const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "medium");
    const [savedTheme, setSavedTheme] = useState(() => localStorage.getItem("theme") || "light");
    const [selectedTheme, setSelectedTheme] = useState(savedTheme);
    const [savedLanguage, setSavedLanguage] = useState(() => {
        const stored = localStorage.getItem("language");
        return languageOptions.some((option) => option.code === stored) ? stored : (i18n.language || "es");
    });
    const [selectedLanguage, setSelectedLanguage] = useState(savedLanguage);
    const [showFontMenu, setShowFontMenu] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const controlsRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        const zoom = fontSizeOptions[fontSize] || 1;
        document.body.style.zoom = String(zoom);
        document.documentElement.dataset.textSize = fontSize;
    }, [fontSize]);

    useEffect(() => {
        document.documentElement.dataset.theme = savedTheme;
        document.documentElement.style.colorScheme = savedTheme;
    }, [savedTheme]);

    useEffect(() => {
        const closeMenusOnOutsideClick = (event) => {
            if (!controlsRef.current?.contains(event.target)) {
                setShowFontMenu(false);
                setShowLangMenu(false);
                setShowThemeMenu(false);
            }
        };

        document.addEventListener("pointerdown", closeMenusOnOutsideClick);
        return () => document.removeEventListener("pointerdown", closeMenusOnOutsideClick);
    }, []);

    const handleSave = async () => {
        setShowSuccess(false);
        setSaveError(false);
        setSavedTheme(selectedTheme);
        setSavedLanguage(selectedLanguage);

        localStorage.setItem("theme", selectedTheme);
        const languageText = String(selectedLanguage).toLowerCase();
        const languageCode = languageText.startsWith("ingl") ? "en"
            : languageText.startsWith("port") ? "pt"
            : languageText.startsWith("ital") ? "it"
            : languageOptions.some((option) => option.code === selectedLanguage) ? selectedLanguage
            : "es";
        localStorage.setItem("language", languageCode);
        i18n.changeLanguage(languageCode);
        localStorage.setItem("fontSize", fontSize);

        try {
            await updateAccessibilitySettings({
                language: languageCode,
                textSize: fontSize,
                theme: selectedTheme,
            });
        } catch (error) {
            console.error("No se pudieron sincronizar las preferencias de accesibilidad", error);
            setSaveError(true);
            return;
        }

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

    const previewTheme = (theme) => {
        setSelectedTheme(theme);
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
    };

    return (
        <div className="access-container">
            <div className="access-header">
                <BrandLogo className="access-logo" />
                <NavBar />
            </div>

            <div className="access-card" ref={controlsRef} data-supported-languages={languageOptions.map(({ code }) => code).join(",")}>
                <div className="access-row">
                    <div className="access-label">
                        <FaFont size={20} />
                        <span>{t("accessibility.textSize")}</span>
                    </div>
                    <div className="access-control">
                        <button type="button" className="access-btn" onClick={() => openMenu(showFontMenu ? null : "font")}>
                            {t("accessibility.adjust")}
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
                                        <span>{t("accessibility." + size)}</span>
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
                        <span>{t("accessibility.colors")}</span>
                    </div>
                    <div className="access-control">
                        <button type="button" className="access-btn" onClick={() => openMenu(showThemeMenu ? null : "theme")}>
                            {t("accessibility.adjust")}
                        </button>
                        {showThemeMenu && (
                            <div className="access-theme-picker">
                                <p className="color-title">{t("accessibility.visualTheme")}</p>
                                <div className="theme-options">
                                    <button
                                        type="button"
                                        className={selectedTheme === "light" ? "theme-option selected" : "theme-option"}
                                        onClick={() => previewTheme("light")}
                                    >
                                        <FaSun /> {t("accessibility.light")}
                                    </button>
                                    <button
                                        type="button"
                                        className={selectedTheme === "dark" ? "theme-option selected" : "theme-option"}
                                        onClick={() => previewTheme("dark")}
                                    >
                                        <FaMoon /> {t("accessibility.dark")}
                                    </button>
                                </div>
                                <p className="theme-hint">
                            {t("accessibility.preview", {
                                theme: t(selectedTheme === "dark" ? "accessibility.dark" : "accessibility.light").toLowerCase(),
                            })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="access-divider" />

                <div className="access-row">
                    <div className="access-label">
                        <FaGlobe size={20} />
                        <span>{t("accessibility.language")}</span>
                    </div>
                    <div className="access-control">
                        <button type="button" className="access-btn" onClick={() => openMenu(showLangMenu ? null : "lang")}>
                            {t("accessibility.change")}
                        </button>
                        {showLangMenu && (
                            <div className="access-dropdown">
                                {languageOptions.map(({ code, label }) => (
                                    <button
                                        key={code}
                                        type="button"
                                        className={selectedLanguage === code ? "selected" : ""}
                                        onClick={() => {
                                            setSelectedLanguage(code);
                                            i18n.changeLanguage(code);
                                        }}
                                    >
                                        <span>{label}</span>
                                        {selectedLanguage === code && <FaCheck size={12} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="access-divider" />

                <button type="button" className="access-save-btn" onClick={handleSave}>
                    {t("common.save")}
                </button>
            </div>

            {showSuccess && (
                <div className="modal-overlay">
                    <div className="access-modal-box">
                        <p className="access-modal-text">{t("misc.accessibilitySaved")}</p>
                        <button type="button" className="access-modal-btn" onClick={() => setShowSuccess(false)}>
                            {t("common.ok")}
                        </button>
                    </div>
                </div>
            )}

            {saveError && (
                <div className="modal-overlay">
                    <div className="access-modal-box">
                        <p className="access-modal-text">{t("misc.accessibilitySaveError")}</p>
                        <button type="button" className="access-modal-btn" onClick={() => setSaveError(false)}>
                            {t("common.ok")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Accessibility;
