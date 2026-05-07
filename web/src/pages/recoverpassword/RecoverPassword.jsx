import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecoverPassword.css";
import logo from "../../assets/Logo.png";

function RecoverPassword() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({ email: false });
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setErrors({ email: true });
            setTimeout(() => setErrors({ email: false }), 3000);
            return;
        }
        setSent(true);
        // aquí conectas tu servicio de recuperación
    };

    return (
        <div className="recover-container">

            {/* LOGO ARRIBA IZQUIERDA */}
            <div className="recover-logo">
                <span>ONE<br/>LANGUAGE</span>
            </div>

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
                    }}
                />
                <p className="recover-error-text">
                    {errors.email ? "Este campo es obligatorio" : ""}
                </p>

                {sent && (
                    <p className="recover-success">¡Código enviado a tu correo!</p>
                )}

                <button className="recover-btn" onClick={handleSubmit}>
                    Enviar código al correo
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