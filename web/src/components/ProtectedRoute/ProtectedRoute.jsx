import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasValidSession } from "../../services/authSession";

function ProtectedRoute() {
    const location = useLocation();

    if (!hasValidSession()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
