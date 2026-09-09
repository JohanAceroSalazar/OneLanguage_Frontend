import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import AuthModal from "../../components/AuthModal/AuthModal";
import logo from "../../assets/Logo.png";
import "./Login.css";
import { loginUser } from "../../services/authService";

const emailRegex = /\S+@\S+\.\S+/;

const initialForm = {
    email: "",
    password: "",
};

const initialErrors = {
    email: "",
    password: "",
};

const initialTouched = {
    email: false,
    password: false,
};

function validateField(field, value) {
    switch (field) {
        case "email":
            if (!value.trim()) return "El correo es obligatorio";
            if (!emailRegex.test(value)) return "Ingresa un correo válido";
            return "";
        case "password":
            if (!value) return "La contraseña es obligatoria";
            if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres";
            return "";
        default:
            return "";
    }
}

function validateForm(form) {
    return {
        email: validateField("email", form.email),
        password: validateField("password", form.password),
    };
}

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState(initialErrors);
    const [touched, setTouched] = useState(initialTouched);
    const [showPassword, setShowPassword] = useState(false);
    const [modal, setModal] = useState({
        open: false,
        title: "",
        message: "",
        tone: "success",
        confirmText: "Entendido",
        onConfirm: null,
    });

    const openModal = (nextModal) => {
        setModal({ open: true, ...nextModal });
    };

    const closeModal = () => {
        setModal((current) => ({ ...current, open: false }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => {
            const nextForm = { ...current, [name]: value };
            setErrors(validateForm(nextForm));
            return nextForm;
        });

        setTouched((current) => ({ ...current, [name]: true }));
    };

    const handleBlur = (event) => {
        const { name } = event.target;
        setTouched((current) => ({ ...current, [name]: true }));
        setErrors((current) => ({
            ...current,
            [name]: validateField(name, form[name]),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextErrors = validateForm(form);
        const hasErrors = Object.values(nextErrors).some(Boolean);

        setErrors(nextErrors);
        setTouched({
            email: true,
            password: true,
        });

        if (hasErrors) {
            openModal({
                title: "Revisa tus datos",
                message: "Todavía hay campos por corregir para poder entrar a la plataforma.",
                tone: "error",
                confirmText: "Corregir datos",
                onConfirm: closeModal,
            });
            return;
        }

        try {

        const response = await loginUser({
            email: form.email,
            password: form.password,
        });

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        openModal({
            title: "Sesión Exitosa",
            message: "Inicio de sesión exitoso. Vamos a llevarte al panel principal.",
            tone: "success",
            confirmText: "Entrar ahora",
        onConfirm: () => {
            closeModal();
            navigate("/home");
        },
    });

        } catch {

        openModal({
            title: "No se pudo iniciar sesión",
            message: "Correo o contraseña incorrectos.",
            tone: "error",
            confirmText: "Intentar nuevamente",
        onConfirm: closeModal,
        });
    }
};

    const showFieldError = (field) => touched[field] || modal.open;

    return (
        <div className="login-container">
            <AuthModal
                open={modal.open}
                title={modal.title}
                message={modal.message}
                tone={modal.tone}
                confirmText={modal.confirmText}
                onConfirm={modal.onConfirm || closeModal}
            />

            <div className="login-left">
                <img src={logo} alt="One Language" className="logo-img" />
                <h2 className="brand-name">ONE<br />LANGUAGE</h2>
                <p className="login-brand-copy">
                    Traduce, revisa tu historial y configura la experiencia de accesibilidad desde un solo lugar.
                </p>
            </div>

            <div className="login-right">
                <form className="login-card" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <span className="form-step">Acceso seguro</span>
                        <h1>Inicia sesión</h1>
                    </div>

                    <label htmlFor="email">Correo electrónico</label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="andres@gmail.com"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={showFieldError("email") && !!errors.email}
                        autoComplete="email"
                    />
                    {showFieldError("email") && errors.email && <p className="error-text">{errors.email}</p>}

                    <label htmlFor="password">Contraseña</label>
                    <div className="password-field">
                        <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showFieldError("password") && !!errors.password}
                            autoComplete="current-password"
                        />
                        <span className="toggle-password" onClick={() => setShowPassword((current) => !current)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {showFieldError("password") && errors.password && <p className="error-text">{errors.password}</p>}

                    <Button text="Iniciar sesión" className="auth-submit-button" />
                </form>

                <p className="recover-text" onClick={() => navigate("/forgotPassword")}>
                    Restablecer contraseña
                </p>
                <p className="register-text">
                    ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;