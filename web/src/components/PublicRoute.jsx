import { Navigate } from "react-router-dom";
import { hasValidSession } from "../services/authSession";

function PublicRoute({ children }) {
    return hasValidSession() ? <Navigate to="/home" replace /> : children;
}

export default PublicRoute;
