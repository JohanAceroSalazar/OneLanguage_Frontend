import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ResetPassword.css";
import logo from "../../assets/Logo.png";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import Input from "../../components/Input/Input";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tokenIdentifier = searchParams.get("id");
    const token = searchParams.get("token");

    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const passwordValid =
        form.password.length >= 8 &&
        /[A-Z]/.test(form.password) &&
        /[a-z]/.test(form.password) &&
        /\d/.test(form.password);

    const confirmTouched = form.confirmPassword.length > 0;
    const passwordsMatch = form.password === form.confirmPassword;
    const confirmError = confirmTouched && !passwordsMatch;
    const confirmSuccess = confirmTouched && passwordsMatch && passwordValid;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!tokenIdentifier || !token) {
            setError(t("auth.invalidLink"));
            return;
        }

        if (!passwordValid) {
            setError(t("auth.passwordRules"));
            return;
        }

        if (!form.confirmPassword) {
            setError(t("auth.confirmRequired"));
            return;
        }

        if (!passwordsMatch) {
            setError(t("misc.passwordMismatch"));
            return;
        }

        try {
            setLoading(true);

            await resetPassword(
                tokenIdentifier,
                token,
                form.password,
                form.confirmPassword
            );

            setSuccess(t("auth.resetSuccess"));

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.message || t("auth.resetError"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-container">
            <BrandLogo className="reset-logo" />

            <h2 className="reset-title">{t("auth.resetTitle")}</h2>

            <img
                src={logo}
                alt="logo"
                className="reset-img"
            />

            <form
                className="reset-card"
                onSubmit={handleSubmit}
            >
                <label htmlFor="password">{t("auth.newPassword")}</label>

                <div className="password-field">
                    <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.passwordMin")}
                        value={form.password}
                        onChange={handleChange}
                        error={form.password.length > 0 && !passwordValid}
                        autoComplete="new-password"
                    />

                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? t("auth.hide") : t("auth.show")}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <p className={`password-info ${passwordValid ? "is-valid" : ""}`}>
                    Minimo 8 caracteres, una mayuscula, una minuscula y un numero.
                </p>

                <label htmlFor="confirmPassword">{t("common.confirmPassword")}</label>

                <div className="password-field">
                    <Input
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder={t("auth.confirmNew")}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        error={confirmError}
                        autoComplete="new-password"
                    />

                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirm((current) => !current)}
                        aria-label={showConfirm ? t("auth.hide") : t("auth.show")}
                    >
                        {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {confirmError && (
                    <p className="match-message is-error">
                        Las contrasenas no coinciden.
                    </p>
                )}

                {confirmSuccess && (
                    <p className="match-message is-success">
                        Las contrasenas coinciden.
                    </p>
                )}

                {error && (
                    <p className="reset-error-text">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="reset-success">
                        {success}
                    </p>
                )}

                <button
                    type="submit"
                    className="reset-btn"
                    disabled={loading}
                >
                    {loading ? "Restableciendo..." : "Restablecer contrasena"}
                </button>
            </form>

            <p
                className="reset-back"
                onClick={() => navigate("/login")}
            >
                {t("auth.backLogin")}
            </p>
        </div>
    );
}

export default ResetPassword;
