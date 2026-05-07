import { useState, useEffect } from "react";
import "./Register.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { registerUser } from "../../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    // errores por campo
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false
    });

    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [accepted, setAccepted] = useState(false);// estado para términos

    //leer si ya aceptó términos
    useEffect(() => {
        const acceptedTerms = localStorage.getItem("acceptedTerms");
        if (acceptedTerms === "true") {
            setAccepted(true);
        }
    }, []);

    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value
    });

    //quitar error al escribir
    setErrors({
        ...errors,
        [e.target.name]: false
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

    const emailRegex = /\S+@\S+\.\S+/;

    //validación por campo
    const newErrors = {
        name: !form.name,
        email: !form.email,
        password: !form.password
    };

    setErrors(newErrors);

    //si hay campos vacíos
    if (newErrors.name || newErrors.email || newErrors.password) {
        setTimeout(() => {
            setErrors({ name: false, email: false, password: false });
        }, 3000);
        return;
    }

    // validación email
    if (!emailRegex.test(form.email)) {
        setErrors({ ...newErrors, email: true }); // marca email
    return;
    }

    // bloquear si no acepta términos
    if (!accepted) {
        setMessage("Debes aceptar los términos y condiciones");
    return;
        }

    try {
        await registerUser(form);
            setMessage("Registro exitoso");
        } catch (error) {
            setMessage(error.message || "Error en el registro");
        }
    };

    return (
        <div className="register-container">
            <div className="logo">
            ONE <br /> LANGUAGE
        </div>

        <h1>Crea tu cuenta</h1>

        <form className="form-card" onSubmit={handleSubmit}>
        
        <label>Nombre completo</label>
        <Input 
            name="name" 
            placeholder="Nombre" 
            onChange={handleChange}
            error={errors.name} 
        />
        {errors.name && <p className="error-text">Este campo es obligatorio</p>}

        <label>Correo electrónico</label>
        <Input 
            name="email" 
            type="email" 
            placeholder="andres@gmail.com" 
            onChange={handleChange}
            error={errors.email} 
        />
        {errors.email && <p className="error-text">Este campo es obligatorio</p>}

        <label>Contraseña</label>
        <div className="password-field">
            <Input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="********" 
                onChange={handleChange}
                error={errors.password} 
            />
            <span 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </span>
        </div>
        {errors.password && <p className="error-text">Este campo es obligatorio</p>}

        <Button text="Registrarse" />
        </form>

        <p className="login-text">
            Ya tienes una cuenta?
            <Link to="/login"> Inicia sesión</Link>
        </p>

        <p className="terms">
                Acepto los{" "}
            <Link to="/terms" className="terms-link">
                términos y condiciones
            </Link>
        </p>

        <p className="message">{message}</p>
    </div>
    );
}

export default Register;