import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiShield, FiStar, FiUsers } from "react-icons/fi";
import logo from "../../assets/Logo.png";
import "./Landing.css";
import { useTranslation } from "react-i18next";

function Landing() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <main className="landing-page">
            <div className="landing-glow landing-glow-1" />
            <div className="landing-glow landing-glow-2" />

            <header className="landing-header">
                <div className="landing-brand">
                    <img src={logo} alt="One Language" className="landing-logo" />
                    <div>
                        <p className="landing-brand-kicker">{t("landing.kicker")}</p>
                        <h1>One Language</h1>
                    </div>
                </div>

                <nav className="landing-actions">
                    <button type="button" className="landing-link-button" onClick={() => navigate("/login")}>
                        Iniciar sesión
                    </button>
                    <button type="button" className="landing-primary-button" onClick={() => navigate("/register")}>
                        Crear cuenta
                    </button>
                </nav>
            </header>

            <section className="landing-hero">
                <div className="landing-copy">
                    <p className="landing-badge">{t("landing.badge")}</p>
                    <p className="landing-value">{t("landing.value")}</p>
                    <h2>{t("landing.title")}</h2>
                    <p className="landing-description">
                        Traduce, consulta tu historial y ajusta la accesibilidad desde una experiencia
                        moderna, clara y lista para acompañar a usuarios, familias y equipos de apoyo.
                    </p>

                    <div className="landing-cta-row">
                        <button type="button" className="landing-primary-button landing-cta-main" onClick={() => navigate("/register")}>
                            Empezar ahora <FiArrowRight />
                        </button>
                        <button type="button" className="landing-secondary-button" onClick={() => navigate("/login")}>
                            Ya tengo cuenta
                        </button>
                    </div>

                    <div className="landing-stats">
                        <article>
                            <strong>{t("landing.realtime")}</strong>
                            <span>{t("landing.realtimeText")}</span>
                        </article>
                        <article>
                            <strong>{t("landing.history")}</strong>
                            <span>{t("landing.historyText")}</span>
                        </article>
                        <article>
                            <strong>{t("landing.accessible")}</strong>
                            <span>{t("landing.accessibleText")}</span>
                        </article>
                    </div>
                </div>

                <div className="landing-visual">
                    <div className="landing-card landing-card-main">
                        <img src={logo} alt="Vista principal de One Language" />
                        <div className="landing-card-copy">
                            <p>{t("landing.clear")}</p>
                            <strong>{t("landing.clearText")}</strong>
                        </div>
                    </div>

                    <div className="landing-mini-grid">
                        <article>
                            <FiStar />
                            <h3>{t("landing.clear")}</h3>
                            <p>{t("landing.clearText")}</p>
                        </article>
                        <article>
                            <FiUsers />
                            <h3>{t("landing.human")}</h3>
                            <p>{t("landing.humanText")}</p>
                        </article>
                        <article>
                            <FiShield />
                            <h3>{t("landing.safe")}</h3>
                            <p>{t("landing.safeText")}</p>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Landing;
