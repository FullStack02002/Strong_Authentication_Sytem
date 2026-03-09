import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routePaths";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import { Login, Register, Home, VerifyEmail } from "../pages/index.ts"

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

            <Route path={ROUTES.VERIFY_EMAIL} element={
                <ProtectedRoute authentication={false}>
                    <VerifyEmail />
                </ProtectedRoute>
            } />




            {/* ── Protected Routes ── */}

            <Route path={ROUTES.HOME} element={
                <Home />
            }
            />

        </Routes>
    );
};

export default AppRoutes;