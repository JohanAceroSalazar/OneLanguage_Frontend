import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiShield, FiStar, FiUsers } from "react-icons/fi";
import logo from "../../assets/Logo.png";
import "./Landing.css";
import { useTranslation } from "react-i18next";

function Landing() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.classList.add("landing-scroll");
        document.body.classList.add("landing-scroll");
        return () => {
            document.documentElement.classList.remove("landing-scroll");
            document.body.classList.remove("landing-scroll");
        };
    }, []);

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
                        {t("landing.login")}
                    </button>
                    <button type="button" className="landing-primary-button" onClick={() => navigate("/register")}>
                        {t("landing.create")}
                    </button>
                </nav>
            </header>

            <section className="landing-hero">
                <div className="landing-copy">
                    <p className="landing-badge">{t("landing.badge")}</p>
                    <p className="landing-value">{t("landing.value")}</p>
                    <h2>{t("landing.title")}</h2>
                    <p className="landing-description">
                        {t("landing.description")}
                    </p>

                    <div className="landing-cta-row">
                        <button type="button" className="landing-primary-button landing-cta-main" onClick={() => navigate("/register")}>
                            {t("landing.start")} <FiArrowRight />
                        </button>
                        <button type="button" className="landing-secondary-button" onClick={() => navigate("/login")}>
                            {t("landing.hasAccount")}
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
