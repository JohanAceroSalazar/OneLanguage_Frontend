import { useState } from "react";
import { createInstance } from "i18next";
import { I18nextProvider, useTranslation } from "react-i18next";
import { languageOptions, resources } from "../i18n";
import "./PublicLanguageLayout.css";

const STORAGE_KEY = "publicLanguage";
const stored = localStorage.getItem(STORAGE_KEY);
const initial = languageOptions.some(({ code }) => code === stored) ? stored : "es";
const publicI18n = createInstance();
void publicI18n.init({ resources, lng: initial, fallbackLng: "es", interpolation: { escapeValue: false } });

function LanguageFooter() {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    const changeLanguage = (event) => {
        const next = event.target.value;
        setLanguage(next);
        localStorage.setItem(STORAGE_KEY, next);
        void i18n.changeLanguage(next);
    };

    return <footer className="public-language-footer">
        <label htmlFor="public-language">{t("common.language")}</label>
        <select id="public-language" value={language} onChange={changeLanguage}>
            {languageOptions.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
        </select>
    </footer>;
}

export default function PublicLanguageLayout({ children }) {
    return <I18nextProvider i18n={publicI18n}>
        <div className="public-language-layout">
            <div className="public-language-content">{children}</div>
            <LanguageFooter />
        </div>
    </I18nextProvider>;
}
