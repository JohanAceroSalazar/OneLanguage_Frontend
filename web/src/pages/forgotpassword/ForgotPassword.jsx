import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import logo from "../../assets/Logo.png";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import { forgotPassword } from "../../services/authService";

function RecoverPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({ email: false });
    const [sent, setSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSent(false);
        setErrorMessage("");

        if (!email.trim()) {
            setErrors({ email: true });

            setTimeout(() => setErrors({ email: false }), 3000);
            return;
        }

        try {
            setLoading(true);

            await forgotPassword(email);

            setSent(true);
        } catch(error) {
            setErrorMessage(
                error.message ||
                t("auth.recoverError")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recover-container">

            {/* LOGO ARRIBA IZQUIERDA */}
            <BrandLogo className="recover-logo" />

            {/* TÍTULO */}
            <h2 className="recover-title">{t("auth.reset")}</h2>

            {/* IMAGEN */}
            <img src={logo} alt="logo" className="recover-img" />

            <p className="recover-description">{t("auth.recoverHint")}</p>

            {/* TARJETA */}
            <div className="recover-card">
                <label className="recover-label">{t("common.email")}</label>
                <input
                    className={`recover-input ${errors.email ? "input-error" : ""}`}
                    type="email"
                    placeholder="johan@gmail.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ email: false });
                        setErrorMessage("");
                        setSent(false);
                    }}
                />
                <p className="recover-error-text">
                    {errors.email ? t("common.required") : ""}
                </p>

                {sent && (
                    <p className="recover-success">{t("auth.recoverSuccess")}</p>
                )}

                {errorMessage && (
                    <p className="recover-error-text">
                        {errorMessage}
                    </p>
                )}

                <button className="recover-btn" 
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading
                        ? t("auth.sending")
                        : t("auth.send")}
                </button>
            </div>

            {/* VOLVER */}
            <p className="recover-back" onClick={() => navigate("/login")}>
                {t("auth.backLogin")}
            </p>

        </div>
    );
}

export default RecoverPassword;
