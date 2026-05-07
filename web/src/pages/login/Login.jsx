import { useState } from "react";
import "./Login.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/Logo.png";
import { useNavigate } from "react-router-dom";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });

    // errores por campo
    const [errors, setErrors] = useState({
        email: false,
        password: false
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    
        // quitar error cuando el usuario escribe
        setErrors({
            ...errors,
            [e.target.name]: false
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

    // validación por campo
        const newErrors = {
            email: !form.email,
            password: !form.password
        };

        setErrors(newErrors);

    // si hay errores, no continúa
        if (newErrors.email || newErrors.password) {
            setTimeout(() => {
            setErrors({ email: false, password: false });
        }, 3000);
        return;
    }
};

        const navigate = useNavigate();

    return (
        <div className="login-container">

            {/* LADO IZQUIERDO */}
            <div className="login-left">
                <img src={logo} alt="One Language" className="logo-img" />
                    <h2 className="brand-name">ONE<br/>LANGUAGE</h2>
            </div>

            {/* LADO DERECHO */}
            <div className="login-right">
                <form className="login-card" onSubmit={handleSubmit}>
                    <label>Correo electrónico</label>
                    <Input 
                    name="email" 
                    type="email" 
                    placeholder="andres@gmail.com" 
                    onChange={handleChange} 
                    error={errors.email}
                    />

                    <p className="error-text">{errors.email ? "Este campo es obligatorio" : ""}</p>

                    <label>Contraseña</label>
                    <div className="password-field">
                        <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            onChange={handleChange}
                            error={errors.password}
                        />
                        <span className="toggle-password" 
                        onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <p className="error-text">{errors.password ? "Este campo es obligatorio" : ""}</p>

                    <Button text="Iniciar sesión" />
                </form>

                <p className="recover-text" onClick={() => navigate("/recoverpassword")}>
                   Restablecer contraseña
                </p>
                <p className="register-text">
                    ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;