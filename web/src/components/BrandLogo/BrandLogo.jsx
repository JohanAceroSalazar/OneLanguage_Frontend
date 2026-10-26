import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./BrandLogo.css";

function BrandLogo({ className = "" }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <button
            type="button"
            className={`brand-logo ${className}`.trim()}
            onClick={() => navigate("/home")}
            aria-label={t("nav.home")}
        >
            <span>ONE<br />LANGUAGE</span>
        </button>
    );
}

export default BrandLogo;
