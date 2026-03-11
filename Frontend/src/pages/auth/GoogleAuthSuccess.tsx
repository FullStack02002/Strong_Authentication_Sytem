import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hook";
import { setAccessToken } from "../../features/auth/authSlice";
import { getCurrentUserThunk } from "../../features/auth/authThunks";
import { ROUTES } from "../../routes/routePaths";

const GoogleAuthSuccess = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("accessToken");

        if (!token) {
            navigate(ROUTES.LOGIN, { replace: true });
            return;
        }

        const finish = async () => {

            dispatch(setAccessToken(token));

            window.history.replaceState({}, "", "/auth/google/success");

            const result = await (dispatch as any)(getCurrentUserThunk());

            if (result.meta.requestStatus === "fulfilled" && result.payload !== null) {
                navigate(ROUTES.HOME, { replace: true });
            } else {
                navigate(ROUTES.LOGIN, { replace: true });
            }
        };

        finish();
    }, []);

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Signing you in with Google...</p>
            </div>
        </div>
    );
};

export default GoogleAuthSuccess;