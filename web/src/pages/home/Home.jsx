import { useNavigate } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import NavBar from "../../components/NavBar/NavBar";
import "./Home.css";
import { useTranslation } from "react-i18next";

function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userName = "usuario";

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
                <p>
                    One Language es una aplicación diseñada para traducir el lenguaje
                    de señas colombiano a texto y audio en tiempo real, promoviendo
                    la inclusión y la comunicación sin barreras en Colombia.
                </p>
                <button className="home-btn" onClick={() => navigate("/translate")}>
                    Comenzar a traducir
                </button>
            </div>

        </div>
    );
}

export default Home;
