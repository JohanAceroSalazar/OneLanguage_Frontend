import { createContext, useContext, useState, useRef } from "react";
import { createInstance } from "i18next";
import { I18nextProvider, useTranslation } from "react-i18next";
import { FiCheck, FiChevronDown, FiGlobe, FiMoon, FiSun } from "react-icons/fi";
import { languageOptions, resources } from "../i18n";
import "./PublicLanguageLayout.css";

const STORAGE_KEY = "publicLanguage";
const THEME_STORAGE_KEY = "publicTheme";
const stored = localStorage.getItem(STORAGE_KEY);
const initial = languageOptions.some(({ code }) => code === stored) ? stored : "es";
const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const initialTheme = storedTheme === "dark" ? "dark" : "light";
const publicI18n = createInstance();
void publicI18n.init({ resources, lng: initial, fallbackLng: "es", interpolation: { escapeValue: false } });
const PublicThemeContext = createContext(null);

export function PublicLanguagePicker() {
    const { t, i18n } = useTranslation();
    const detailsRef = useRef(null);
    const active = languageOptions.find(({ code }) => code === i18n.language) || languageOptions[0];

    const changeLanguage = (code) => {
        localStorage.setItem(STORAGE_KEY, code);
        void i18n.changeLanguage(code);
        detailsRef.current.open = false;
    };

    return <details className="public-language-picker" ref={detailsRef}>
        <summary aria-label={`${t("common.language")}: ${active.label}`}>
            <FiGlobe aria-hidden="true" />
            <span>{active.label}</span>
            <FiChevronDown aria-hidden="true" />
        </summary>
        <div className="public-language-menu" role="group" aria-label={t("common.language")}>
            {languageOptions.map(({ code, label }) => <button
                key={code}
                type="button"
                aria-label={label}
                aria-pressed={code === active.code}
                onClick={() => changeLanguage(code)}
            ><span>{label}</span>{code === active.code && <FiCheck aria-hidden="true" />}</button>)}
        </div>
    </details>;
}

export function PublicThemeToggle() {
    const { t } = useTranslation();
    const theme = useContext(PublicThemeContext);

    if (!theme) return null;

    const isDark = theme.value === "dark";
    const nextTheme = isDark ? "light" : "dark";
    const label = `${t("accessibility.visualTheme")}: ${t(`accessibility.${isDark ? "dark" : "light"}`)}`;

    return <button
        type="button"
        className="public-theme-toggle"
        aria-label={label}
        title={label}
        onClick={() => theme.setValue(nextTheme)}
    >
        {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
    </button>;
}

export function PublicAppearanceControls() {
    return <div className="public-appearance-controls">
        <PublicLanguagePicker />
        <PublicThemeToggle />
    </div>;
}

export default function PublicLanguageLayout({ children, landing = false }) {
    const [theme, setTheme] = useState(initialTheme);
    const setPublicTheme = (value) => {
        localStorage.setItem(THEME_STORAGE_KEY, value);
        setTheme(value);
    };

    return <I18nextProvider i18n={publicI18n}>
        <PublicThemeContext.Provider value={{ value: theme, setValue: setPublicTheme }}>
            <div className={`public-language-layout${landing ? " is-landing" : ""}`} data-public-theme={theme}>
                {!landing && <div className="public-language-toolbar"><PublicAppearanceControls /></div>}
                <div className="public-language-content">{children}</div>
            </div>
        </PublicThemeContext.Provider>
    </I18nextProvider>;
}
