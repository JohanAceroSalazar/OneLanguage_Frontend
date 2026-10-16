import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./BrandLogo.css";
import logo from "../../assets/Logo.png";

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
            <img src={logo} alt="" className="brand-logo-image" />
            <span>One Language</span>
        </button>
    );
}

export default BrandLogo;
