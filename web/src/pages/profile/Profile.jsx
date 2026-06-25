import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { FaCamera, FaMusic, FaFolder, FaUser } from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import NavBar from "../../components/NavBar/NavBar";

function Profile() {
    const navigate = useNavigate();

    const [view, setView] = useState("profile"); // profile | password | camera | audio | files
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [form, setForm] = useState({ name: "Juan Pablo", email: "juan@gmail.com" });
    const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });

    // VISTA CAMBIAR CONTRASEÑA
    if (view === "password") {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <BrandLogo className="profile-logo" />
                    <NavBar />
                </div>
                <div className="profile-center">
                    <div className="password-card">
                        <p className="password-title">Cambiar la contraseña</p>
                        <label>Contraseña actual</label>
                        <input type="password" className="profile-input" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} />
                        <label>Nueva contraseña</label>
                        <input type="password" className="profile-input" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} />
                        <label>Confirmar la contraseña nueva</label>
                        <input type="password" className="profile-input" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} />
                        <button className="save-btn" onClick={() => setView("profile")}>Guardar cambios</button>
                    </div>
                </div>
            </div>
        );
    }

    // VISTA CÁMARA
    if (view === "camera") {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <BrandLogo className="profile-logo" />
                    <NavBar />
                </div>
                <div className="profile-center">
                    <div className="permission-card">
                        <FaCamera size={140} color="#333" />
                    </div>
                    <button className="yellow-btn" onClick={() => setView("profile")}>Activar cámara</button>
                </div>
            </div>
        );
    }

    // VISTA AUDIO
    if (view === "audio") {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <BrandLogo className="profile-logo" />
                    <NavBar />
                </div>
                <div className="profile-center">
                    <div className="permission-card">
                        <FaMusic size={140} color="#333" />
                    </div>
                    <button className="yellow-btn" onClick={() => setView("profile")}>Activar micrófono</button>
                </div>
            </div>
        );
    }

    // VISTA ARCHIVOS
    if (view === "files") {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <BrandLogo className="profile-logo" />
                    <NavBar />
                </div>
                <div className="profile-center">
                    <div className="permission-card">
                        <FaFolder size={140} color="#333" />
                    </div>
                    <button className="yellow-btn" onClick={() => setView("profile")}>Dar acceso archivos</button>
                </div>
            </div>
        );
    }

    // VISTA PRINCIPAL
    return (
        <div className="profile-container">
            <div className="profile-header">
                <BrandLogo className="profile-logo" />
                <NavBar />
            </div>

            <div className="profile-card">

                {/* INFO PERSONAL */}
                <div className="profile-section">
                    <div className="profile-avatar-col">
                        <div className="profile-avatar">
                            <FaUser size={40} color="#333" />
                        </div>
                    </div>
                    <div className="profile-info-col">
                        <p className="section-title">Información personal</p>
                        <p className="section-subtitle">Visualiza tus datos personales</p>
                        <label className="field-label">Nombre Completo</label>
                        <input className="profile-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                        <label className="field-label">Correo Electrónico</label>
                        <input className="profile-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                        <button className="change-pass-btn" onClick={() => setView("password")}>Cambiar contraseña</button>
                    </div>
                </div>

                <div className="profile-divider" />

                {/* PERMISOS */}
                <div className="permissions-section">
                    <p className="section-title">Permisos del dispositivo</p>
                    <p className="section-subtitle">Gestiona los permisos de acceso a funciones del dispositivo</p>

                    <div className="permission-row">
                        <div className="permission-left">
                            <FaCamera size={20} />
                            <div>
                                <p className="perm-name">Cámara</p>
                                <p className="perm-desc">Necesaria para reconocimiento de señas</p>
                            </div>
                        </div>
                        <button className="activate-btn" onClick={() => setView("camera")}>Activar</button>
                    </div>

                    <div className="permission-row">
                        <div className="permission-left">
                            <FaMusic size={20} />
                            <div>
                                <p className="perm-name">Audio</p>
                                <p className="perm-desc">Para funciones de convertir y escuchar el audio</p>
                            </div>
                        </div>
                        <button className="activate-btn" onClick={() => setView("audio")}>Activar</button>
                    </div>

                    <div className="permission-row">
                        <div className="permission-left">
                            <FaFolder size={20} />
                            <div>
                                <p className="perm-name">Archivos</p>
                                <p className="perm-desc">Acceso para los archivos</p>
                            </div>
                        </div>
                        <button className="activate-btn" onClick={() => setView("files")}>Activar</button>
                    </div>
                </div>

                <div className="profile-divider" />

                {/* CERRAR SESIÓN */}
                <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
                    Cerrar Sesión
                </button>
            </div>

            {/* MODAL CERRAR SESIÓN */}
            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <p className="modal-text">¿Está seguro que<br/>desea cerrar sesión?</p>
                        <div className="modal-actions">
                            <button className="modal-logout-btn" onClick={() => navigate("/login")}>Cerrar sesión</button>
                            <button className="modal-cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
