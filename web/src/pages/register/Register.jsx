import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
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

function validateField(field, value, form, t) {
    switch (field) {
        case "name":
            if (!value.trim()) return t("auth.nameRequired");
            if (value.trim().length < 3) return t("auth.minChars");
            return "";
        case "email":
            if (!value.trim()) return t("auth.emailRequired");
            if (!emailRegex.test(value)) return t("auth.emailInvalid");
            return "";
        case "password":
            if (!value) return t("auth.passwordRequired");
            if (!passwordRegex.test(value)) {
                return t("auth.passwordRules");
            }
            return "";
        case "confirmPassword":
            if (!value) return t("auth.confirmRequired");
            if (value !== form.password) return t("auth.passwordMismatch");
            return "";
        case "acceptedTerms":
            return value ? "" : t("auth.acceptTerms");
        default:
            return "";
    }
}

function validateForm(form, t) {
    return {
        name: validateField("name", form.name, form, t),
        email: validateField("email", form.email, form, t),
        password: validateField("password", form.password, form, t),
        confirmPassword: validateField("confirmPassword", form.confirmPassword, form, t),
        acceptedTerms: validateField("acceptedTerms", form.acceptedTerms, form, t),
    };
}

function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState(initialErrors);
    const [touched, setTouched] = useState(initialTouched);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
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
            return t("auth.weak");
        }

        if (passwordRegex.test(form.password)) {
            return t("auth.strong");
        }

        return t("auth.medium");
    }, [form.password, t]);

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
            const nextErrors = validateForm(nextForm, t);
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
            [name]: validateField(name, form[name], form, t),
            ...(name === "password" || name === "confirmPassword"
                ? {
                    confirmPassword: validateField("confirmPassword", form.confirmPassword, form, t),
                    }
                : {}),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextErrors = validateForm(form, t);
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
                title: t("auth.registerReview"),
                message: t("auth.registerReviewMessage"),
                tone: "error",
                confirmText: t("auth.correct"),
                onConfirm: closeModal,
            });
            return;
        }

        try {
            await registerUser(form);
            openModal({
                title: t("auth.registerSuccess"),
                message: t("auth.registerSuccessMessage"),
                tone: "success",
                confirmText: t("auth.goLogin"),
                onConfirm: () => {
                    closeModal();
                    navigate("/login");
                },
            });
        } catch (error) {
            openModal({
                title: t("auth.registerError"),
                message: error?.message || t("auth.registerErrorMessage"),
                tone: "error",
                confirmText: t("modal.understood"),
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
                    <h1>ONE<br />LANGUAGE</h1>
                    <p className="register-brand-copy">
                        {t("auth.brandCopy")}
                    </p>
                </div>

                <div className="register-form-column">
                <h2 className="register-form-title">{t("auth.createAccount")}</h2>
                <form className="form-card" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <span className="form-step">{t("auth.step")}</span>
                        <h2>{t("auth.register")}</h2>
                    </div>

                    <label htmlFor="name">{t("common.fullName")}</label>
                    <Input
                        name="name"
                        type="text"
                        placeholder={t("common.fullName")}
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={showFieldError("name") && !!errors.name}
                        autoComplete="name"
                    />
                    {showFieldError("name") && errors.name && <p className="error-text">{errors.name}</p>}

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
                            placeholder={t("auth.passwordMin")}
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
                    {form.password && <p className="password-hint">{t("misc.passwordStrength")}: {passwordStrength}</p>}
                    {showFieldError("password") && errors.password && <p className="error-text">{errors.password}</p>}

                    <label htmlFor="confirmPassword">{t("common.confirmPassword")}</label>
                    <div className="password-field">
                        <Input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t("auth.repeatPassword")}
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
                            {t("auth.terms")}{" "}
                            <button
                                type="button"
                                className="terms-link"
                                onClick={() => setShowTerms(true)}
                                aria-haspopup="dialog"
                            >
                                {t("terms.title")}
                            </button>
                        </span>
                    </label>
                    {showFieldError("acceptedTerms") && errors.acceptedTerms && (
                        <p className="terms-alert" role="alert">{errors.acceptedTerms}</p>
                    )}

                    <Button text={t("auth.createAccount")} className="auth-submit-button" />
                </form>
                <p className="login-text">
                    {t("auth.hasAccount")}
                    <Link to="/login"> {t("auth.login")}</Link>
                </p>
                </div>
            </div>

            {showTerms ? <div className="register-terms-backdrop" role="presentation">
                <section className="register-terms-dialog" role="dialog" aria-modal="true" aria-labelledby="register-terms-title">
                    <header className="register-terms-header">
                        <h2 id="register-terms-title">{t("terms.title")}</h2>
                        <button type="button" onClick={() => setShowTerms(false)} aria-label={t("common.back")}>
                            <FaTimes aria-hidden="true" />
                        </button>
                    </header>
                    <div className="register-terms-body">
                        <p>{t("terms.app")}</p>
                        <p>{t("terms.updated")}</p>
                        <p>{t("terms.welcome")}</p>
                        {[1, 2, 3, 4, 5, 6, 7].map((section) => (
                            <div key={section}>
                                <strong>{t(`terms.s${section}`)}</strong>
                                <p>{t(`terms.p${section}`)}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div> : null}
        </div>
    );
}

export default Register;
