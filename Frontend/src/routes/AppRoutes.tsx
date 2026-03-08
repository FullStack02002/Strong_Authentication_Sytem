import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routePaths";
import ProtectedRoute from "../components/shared/ProtectedRoute";

import Login               from "../pages/auth/Login";
import Register            from "../pages/auth/Register";

const AppRoutes = () => {
    return (
        <Routes>

            {/* ── Public Routes ── */}
            <Route path={ROUTES.LOGIN} element={
                <ProtectedRoute authentication={false}>
                    <Login />
                </ProtectedRoute>
            } />

            <Route path={ROUTES.REGISTER} element={
                <ProtectedRoute authentication={false}>
                    <Register />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;