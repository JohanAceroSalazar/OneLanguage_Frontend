import { useState } from "react";
import { useTranslation } from "react-i18next";
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

function validateField(field, value, t) {
    switch (field) {
        case "email":
            if (!value.trim()) return t("auth.emailRequired");
            if (!emailRegex.test(value)) return t("auth.emailInvalid");
            return "";
        case "password":
            if (!value) return t("auth.passwordRequired");
            if (value.length < 6) return t("auth.passwordLength");
            return "";
        default:
            return "";
    }
}

function validateForm(form, t) {
    return {
        email: validateField("email", form.email, t),
        password: validateField("password", form.password, t),
    };
}

function Login() {
    const { t } = useTranslation();
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
            setErrors(validateForm(nextForm, t));
            return nextForm;
        });

        setTouched((current) => ({ ...current, [name]: true }));
    };

    const handleBlur = (event) => {
        const { name } = event.target;
        setTouched((current) => ({ ...current, [name]: true }));
        setErrors((current) => ({
            ...current,
            [name]: validateField(name, form[name], t),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextErrors = validateForm(form, t);
        const hasErrors = Object.values(nextErrors).some(Boolean);

        setErrors(nextErrors);
        setTouched({
            email: true,
            password: true,
        });

        if (hasErrors) {
            openModal({
                title: t("auth.review"),
                message: t("auth.reviewMessage"),
                tone: "error",
                confirmText: t("auth.correct"),
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
            title: t("auth.success"),
            message: t("auth.successMessage"),
            tone: "success",
            confirmText: t("auth.enterNow"),
        onConfirm: () => {
            closeModal();
            navigate("/home");
        },
    });

        } catch {

        openModal({
            title: t("auth.loginError"),
            message: t("auth.credentialsError"),
            tone: "error",
            confirmText: t("common.ok"),
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
                    {t("auth.loginCopy")}
                </p>
            </div>

            <div className="login-right">
                <form className="login-card" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <span className="form-step">{t("auth.secure")}</span>
                        <h1>{t("auth.login")}</h1>
                    </div>

                    <label htmlFor="email">{t("common.email")}</label>
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

                    <label htmlFor="password">{t("common.password")}</label>
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

                    <Button text={t("auth.login")} className="auth-submit-button" />
                </form>

                <p className="recover-text" onClick={() => navigate("/forgotPassword")}>
                    {t("auth.reset")}
                </p>
                <p className="register-text">
                    {t("auth.noAccount")} <Link to="/register">{t("auth.register")}</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
