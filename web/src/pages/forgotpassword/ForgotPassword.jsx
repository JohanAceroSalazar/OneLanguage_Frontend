import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import logo from "../../assets/Logo.png";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import { forgotPassword } from "../../services/authService";

function RecoverPassword() {
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
                "No se pudo enviar el enlace de recuperación."
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
            <h2 className="recover-title">Restablecer<br/>contraseña</h2>

            {/* IMAGEN */}
            <img src={logo} alt="logo" className="recover-img" />

            {/* TARJETA */}
            <div className="recover-card">
                <label className="recover-label">Correo electrónico</label>
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
                    {errors.email ? "Este campo es obligatorio" : ""}
                </p>

                {sent && (
                    <p className="recover-success">¡Enlace de recuperación enviado a tu correo!</p>
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
                        ? "Enviando..."
                        : "Enviar enlace de recuperación"}
                </button>
            </div>

            {/* VOLVER */}
            <p className="recover-back" onClick={() => navigate("/login")}>
                ← Volver al inicio de sesión
            </p>

        </div>
    );
}

export default RecoverPassword;
