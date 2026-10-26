import { useRef } from "react";
import { createInstance } from "i18next";
import { I18nextProvider, useTranslation } from "react-i18next";
import { FiCheck, FiChevronDown, FiGlobe } from "react-icons/fi";
import { languageOptions, resources } from "../i18n";
import "./PublicLanguageLayout.css";

const STORAGE_KEY = "publicLanguage";
const stored = localStorage.getItem(STORAGE_KEY);
const initial = languageOptions.some(({ code }) => code === stored) ? stored : "es";
const publicI18n = createInstance();
void publicI18n.init({ resources, lng: initial, fallbackLng: "es", interpolation: { escapeValue: false } });

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

export default function PublicLanguageLayout({ children, landing = false }) {
    return <I18nextProvider i18n={publicI18n}>
        <div className={`public-language-layout${landing ? " is-landing" : ""}`}>
            {!landing && <div className="public-language-toolbar"><PublicLanguagePicker /></div>}
            <div className="public-language-content">{children}</div>
        </div>
    </I18nextProvider>;
}
