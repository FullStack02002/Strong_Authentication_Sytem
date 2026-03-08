import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { ROUTES } from "../../routes/routePaths";

interface ProtectedRouteProps {
    children: React.ReactNode;
    authentication: boolean;
}

const ProtectedRoute = ({ children, authentication }: ProtectedRouteProps) => {
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

    if (loading) return <div>Loading...</div>;

    if (authentication && !isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;