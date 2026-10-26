import { useNavigate } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import NavBar from "../../components/NavBar/NavBar";
import "./Home.css";
import { useTranslation } from "react-i18next";
import { firstName } from "../../services/displayName";

function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    let storedUser = null;
    try { storedUser = JSON.parse(localStorage.getItem("user") || "null"); } catch { /* No cached profile. */ }
    const userName = firstName(storedUser) || t("home.fallbackName", "usuario");
    return (
        <div className="home-container">

            {/* HEADER */}
            <div className="home-header">
                <BrandLogo className="home-logo" />
                <NavBar />
            </div>

            {/* SALUDO */}
            <p className="home-greeting">{t("home.greeting", { name: userName })}</p>

            {/* TARJETA */}
            <div className="home-card">
                <h1>{t("home.title")}</h1>
                <p>{t("home.description")}</p>
                <button className="home-btn" onClick={() => navigate("/translate")}>
                    {t("home.start")}
                </button>
            </div>

        </div>
    );
}

export default Home;
