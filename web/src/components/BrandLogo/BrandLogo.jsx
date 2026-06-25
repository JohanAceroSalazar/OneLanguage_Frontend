import { useNavigate } from "react-router-dom";
import "./BrandLogo.css";

function BrandLogo({ className = "" }) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            className={`brand-logo ${className}`.trim()}
            onClick={() => navigate("/home")}
            aria-label="Ir al inicio"
        >
            <span>ONE<br />LANGUAGE</span>
        </button>
    );
}

export default BrandLogo;