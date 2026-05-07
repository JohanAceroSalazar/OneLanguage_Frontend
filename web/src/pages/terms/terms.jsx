import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import "./Terms.css";

function Terms() {
    const [accepted, setAccepted] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="terms-container">

            <h1 className="title">Términos y condiciones</h1>

            <p className="paragraph">Aplicación de Traducción de Señas a Texto</p>
            <p className="paragraph">Última actualización: 2025</p>
            <p className="paragraph">
                Bienvenido(a) a nuestra aplicación de traducción de señas a texto.
                Al utilizar la aplicación, usted acepta los presentes Términos y Condiciones.
            </p>

            <div className="section">
                <p className="subtitle">1. Aceptación de los Términos</p>
                <p className="paragraph">Al acceder, instalar o utilizar la Aplicación, usted declara que ha leído, comprendido y aceptado estos términos.</p>
            </div>

            <div className="section">
                <p className="subtitle">2. Descripción del Servicio</p>
                <p className="paragraph">La aplicación permite capturar señas, interpretarlas mediante algoritmos y convertirlas en texto y audio.</p>
            </div>

            <div className="section">
                <p className="subtitle">3. Uso Permitido</p>
                <p className="paragraph">El usuario se compromete a usar la aplicación de forma responsable, sin fines ilegales ni maliciosos.</p>
            </div>

            <div className="section">
                <p className="subtitle">4. Registro y Seguridad</p>
                <p className="paragraph">El usuario debe proporcionar información verídica y proteger sus credenciales.</p>
            </div>

            <div className="section">
                <p className="subtitle">5. Privacidad</p>
                <p className="paragraph">Los datos recopilados se utilizan únicamente para mejorar la experiencia del usuario.</p>
            </div>

            <div className="section">
                <p className="subtitle">6. Propiedad Intelectual</p>
                <p className="paragraph">Todo el contenido de la aplicación pertenece a sus desarrolladores.</p>
            </div>

            <div className="section">
                <p className="subtitle">7. Limitación de Responsabilidad</p>
                <p className="paragraph">La aplicación puede tener errores y no garantiza precisión total.</p>
            </div>

            <div className="checkboxContainer">
                <span
                    className="checkboxIcon"
                    onClick={() => {
                        setAccepted(true);
                        localStorage.setItem("acceptedTerms", "true");
                        setTimeout(() => navigate("/register"), 300);
                    }}
                >
                    {accepted ? <FaCheckSquare /> : <FaRegSquare />}
                </span>
                <span className="checkboxText">Acepto los términos y condiciones</span>
            </div>

        </div>
    );
}

export default Terms;