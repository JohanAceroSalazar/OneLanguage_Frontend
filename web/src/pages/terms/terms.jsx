import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Terms.css";

function Terms() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="terms-container">

            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >{t("common.back")}</button>

            <div className="terms-content">

                <h1 className="title">{t("terms.title")}</h1>

                <p className="paragraph">{t("terms.app")}</p>
                <p className="paragraph">{t("terms.updated")}</p>
                <p className="paragraph">{t("terms.welcome")}</p>

                <div className="section">
                    <p className="subtitle">{t("terms.s1")}</p>
                    <p className="paragraph">{t("terms.p1")}</p>
                </div>

                <div className="section">
                    <p className="subtitle">{t("terms.s2")}</p>
                    <p className="paragraph">{t("terms.p2")}</p>
                </div>

                <div className="section">
                    <p className="subtitle">{t("terms.s3")}</p>
                    <p className="paragraph">{t("terms.p3")}</p>
                </div>

                <div className="section">
                    <p className="subtitle">{t("terms.s4")}</p>
                    <p className="paragraph">{t("terms.p4")}</p>
                </div>

                <div className="section">
                    <p className="subtitle">{t("terms.s5")}</p>
                    <p className="paragraph">{t("terms.p5")}</p>
                </div>

                <div className="section">
                    <p className="subtitle">{t("terms.s6")}</p>
                    <p className="paragraph">{t("terms.p6")}</p>
                </div>

                <div className="section">
                    <p className="subtitle">{t("terms.s7")}</p>
                    <p className="paragraph">{t("terms.p7")}</p>
                </div>
            </div>
        </div>
    );
}

export default Terms;
