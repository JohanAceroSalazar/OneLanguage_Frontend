import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import AuthModal from "../../components/AuthModal/AuthModal";
import { registerUser } from "../../services/authService";
import "./Register.css";

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const initialForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
};

const initialErrors = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: "",
};

const initialTouched = {
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    acceptedTerms: false,
};

function validateField(field, value, form) {
    switch (field) {
        case "name":
            if (!value.trim()) return "El nombre es obligatorio";
            if (value.trim().length < 3) return "Ingresa al menos 3 caracteres";
            return "";
        case "email":
            if (!value.trim()) return "El correo es obligatorio";
            if (!emailRegex.test(value)) return "Ingresa un correo válido";
            return "";
        case "password":
            if (!value) return "La contraseña es obligatoria";
            if (!passwordRegex.test(value)) {
                return "Usa 8+ caracteres, una letra y un número";
            }
            return "";
        case "confirmPassword":
            if (!value) return "Confirma tu contraseña";
            if (value !== form.password) return "Las contraseñas no coinciden";
            return "";
        case "acceptedTerms":
            return value ? "" : "Debes aceptar los términos y condiciones";
        default:
            return "";
    }
}

function validateForm(form) {
    return {
        name: validateField("name", form.name, form),
        email: validateField("email", form.email, form),
        password: validateField("password", form.password, form),
        confirmPassword: validateField("confirmPassword", form.confirmPassword, form),
        acceptedTerms: validateField("acceptedTerms", form.acceptedTerms, form),
    };
}

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState(initialErrors);
    const [touched, setTouched] = useState(initialTouched);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [modal, setModal] = useState({
        open: false,
        title: "",
        message: "",
        tone: "success",
        confirmText: "Entendido",
        onConfirm: null,
    });

    const showFieldError = (field) => touched[field] || modal.open;

    const passwordStrength = useMemo(() => {
        if (!form.password) {
            return "";
        }

        if (form.password.length < 8) {
            return "Débil";
        }

        if (passwordRegex.test(form.password)) {
            return "Fuerte";
        }

        return "Media";
    }, [form.password]);

    const openModal = (nextModal) => {
        setModal({ open: true, ...nextModal });
    };

    const closeModal = () => {
        setModal((current) => ({ ...current, open: false }));
    };

    const handleChange = (event) => {
        const { name, type, checked, value } = event.target;
        const nextValue = type === "checkbox" ? checked : value;

        setForm((current) => {
            const nextForm = { ...current, [name]: nextValue };
            const nextErrors = validateForm(nextForm);
            setErrors(nextErrors);
            return nextForm;
        });

        setTouched((current) => ({
            ...current,
            [name]: true,
        }));
    };

    const handleBlur = (event) => {
        const { name } = event.target;
        setTouched((current) => ({ ...current, [name]: true }));

        setErrors((current) => ({
            ...current,
            [name]: validateField(name, form[name], form),
            ...(name === "password" || name === "confirmPassword"
                ? {
                    confirmPassword: validateField("confirmPassword", form.confirmPassword, form),
                    }
                : {}),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextErrors = validateForm(form);
        const hasErrors = Object.values(nextErrors).some(Boolean);

        setErrors(nextErrors);
        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
            acceptedTerms: true,
        });

        if (hasErrors) {
            openModal({
                title: "Revisa tu registro",
                message: "Todavía hay campos por completar antes de crear la cuenta.",
                tone: "error",
                confirmText: "Corregir datos",
                onConfirm: closeModal,
            });
            return;
        }

        try {
            await registerUser(form);
            openModal({
                title: "Registro exitoso",
                message: "Tu cuenta quedó lista. Ahora puedes iniciar sesión y empezar a usar la plataforma.",
                tone: "success",
                confirmText: "Ir al inicio de sesión",
                onConfirm: () => {
                    closeModal();
                    navigate("/login");
                },
            });
        } catch (error) {
            openModal({
                title: "No pudimos registrar tu cuenta",
                message: error?.message || "Ocurrió un problema al crear la cuenta. Inténtalo otra vez.",
                tone: "error",
                confirmText: "Entendido",
                onConfirm: closeModal,
            });
        }
    };

    return (
        <div className="register-container">
            <AuthModal
                open={modal.open}
                title={modal.title}
                message={modal.message}
                tone={modal.tone}
                confirmText={modal.confirmText}
                onConfirm={modal.onConfirm || closeModal}
            />

            <div className="register-shell">
                <div className="register-brand">
                    <p className="register-brand-kicker">Bienvenido a</p>
                    <h1>ONE LANGUAGE</h1>
                    <p className="register-brand-copy">
                        Crea tu cuenta para acceder a traducción, historial y opciones de accesibilidad.
                    </p>
                </div>

                <form className="form-card" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <span className="form-step">Paso 1 de 1</span>
                        <h2>Regístrate en segundos</h2>
                    </div>

                    <label htmlFor="name">Nombre completo</label>
                    <Input
                        name="name"
                        type="text"
                        placeholder="Nombre completo"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={showFieldError("name") && !!errors.name}
                        autoComplete="name"
                    />
                    {showFieldError("name") && errors.name && <p className="error-text">{errors.name}</p>}

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
                            placeholder="Mínimo 8 caracteres"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showFieldError("password") && !!errors.password}
                            autoComplete="new-password"
                        />
                        <span className="toggle-password" onClick={() => setShowPassword((current) => !current)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {form.password && <p className="password-hint">Fortaleza de contraseña: {passwordStrength}</p>}
                    {showFieldError("password") && errors.password && <p className="error-text">{errors.password}</p>}

                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <div className="password-field">
                        <Input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repite tu contraseña"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showFieldError("confirmPassword") && !!errors.confirmPassword}
                            autoComplete="new-password"
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword((current) => !current)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {showFieldError("confirmPassword") && errors.confirmPassword && (
                        <p className="error-text">{errors.confirmPassword}</p>
                    )}

                    <label className="terms-check">
                        <input
                            type="checkbox"
                            name="acceptedTerms"
                            checked={form.acceptedTerms}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <span>
                            Acepto los{" "}
                            <Link to="/terms" className="terms-link">
                                términos y condiciones
                            </Link>
                        </span>
                    </label>
                    {showFieldError("acceptedTerms") && errors.acceptedTerms && (
                        <p className="error-text">{errors.acceptedTerms}</p>
                    )}

                    <Button text="Crear cuenta" className="auth-submit-button" />
                </form>

                <p className="login-text">
                    ¿Ya tienes una cuenta?
                    <Link to="/login"> Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
