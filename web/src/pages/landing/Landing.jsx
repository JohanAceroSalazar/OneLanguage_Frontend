import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiShield, FiStar, FiUsers } from "react-icons/fi";
import logo from "../../assets/Logo.png";
import "./Landing.css";

function Landing() {
    const navigate = useNavigate();

    return (
        <main className="landing-page">
            <div className="landing-glow landing-glow-1" />
            <div className="landing-glow landing-glow-2" />

            <header className="landing-header">
                <div className="landing-brand">
                    <img src={logo} alt="One Language" className="landing-logo" />
                    <div>
                        <p className="landing-brand-kicker">Plataforma de inclusión</p>
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
                    <p className="landing-badge">Traducción de lengua de señas colombiana</p>
                    <h2>Una app pensada para conectar personas sin barreras.</h2>
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
                            <strong>Tiempo real</strong>
                            <span>Interfaz lista para traducir con rapidez.</span>
                        </article>
                        <article>
                            <strong>Historial</strong>
                            <span>Guarda conversaciones y revisa resultados.</span>
                        </article>
                        <article>
                            <strong>Accesible</strong>
                            <span>Diseño contrastado y fácil de navegar.</span>
                        </article>
                    </div>
                </div>

                <div className="landing-visual">
                    <div className="landing-card landing-card-main">
                        <img src={logo} alt="Vista principal de One Language" />
                        <div className="landing-card-copy">
                            <p>Diseño central</p>
                            <strong>Una experiencia pensada para traducir sin perderse</strong>
                        </div>
                    </div>

                    <div className="landing-mini-grid">
                        <article>
                            <FiStar />
                            <h3>Interfaz clara</h3>
                            <p>Diseñada para que el usuario no se pierda.</p>
                        </article>
                        <article>
                            <FiUsers />
                            <h3>Enfoque humano</h3>
                            <p>Creada para acercar la comunicación.</p>
                        </article>
                        <article>
                            <FiShield />
                            <h3>Validación segura</h3>
                            <p>Mensajes en vivo y modales para guiar mejor.</p>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Landing;
