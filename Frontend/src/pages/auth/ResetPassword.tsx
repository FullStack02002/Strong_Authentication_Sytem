import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { resetPasswordThunk } from "../../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "../../app/hook";

interface ResetFormData {
    newPassword: string;
    confirmPassword: string;
}

const ResetPassword = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const loading = useAppSelector((state) => state.auth.resetPasswordLoading);

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetFormData>();

    // redirect if no token or email
    if (!token || !email) {
        return (
            <div className="h-screen overflow-hidden flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl text-center">
                        <div className="text-5xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Invalid Link</h2>
                        <p className="text-sm text-gray-400 mb-6">
                            This reset link is invalid or has expired.
                        </p>
                        <Link
                            to={ROUTES.FORGOT_PASSWORD}
                            className="block w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all text-center"
                        >
                            Request New Link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const onSubmit = async (data: ResetFormData) => {
        const result = await (dispatch as any)(resetPasswordThunk({
            token,
            email,
            newPassword: data.newPassword,
        }));

        if (result.meta.requestStatus === "fulfilled" && result.payload !== null) {
            setSuccess(true);
        }
    };

    // ─────────────────────────────────────────
    // UI — Success
    // ─────────────────────────────────────────
    if (success) {
        return (
            <div className="h-screen overflow-hidden flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-600/20 border border-green-500/30 mb-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Password Reset!
                        </h1>
                        <p className="text-gray-400 text-sm mt-2">
                            Your password has been updated successfully
                        </p>
                    </div>

                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl text-center">
                        <div className="text-4xl mb-4">🎉</div>
                        <p className="text-sm text-gray-400 mb-8">
                            You can now sign in with your new password.
                        </p>
                        <button
                            onClick={() => navigate(ROUTES.LOGIN)}
                            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-purple-900/30"
                        >
                            Go to Login →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────
    // UI — Form
    // ─────────────────────────────────────────
    return (
        <div className="h-screen overflow-hidden flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* ── Brand ── */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 mb-4">
                        <span className="text-2xl">🔐</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Enter your new password below
                    </p>
                </div>

                {/* ── Card ── */}
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                        {/* ── New Password ── */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-300 tracking-wide">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Min 8 characters"
                                className={`w-full px-4 py-3 rounded-xl bg-gray-800/80 border text-white text-sm outline-none transition-all duration-200 placeholder-gray-600
                                    ${errors.newPassword
                                        ? "border-red-500/70 focus:border-red-400"
                                        : "border-gray-700/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                                    }`}
                                {...register("newPassword", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "At least 8 characters" },
                                    maxLength: { value: 32, message: "At most 32 characters" },
                                    validate: {
                                        hasUppercase: (v) => /[A-Z]/.test(v) || "Must contain uppercase letter",
                                        hasLowercase: (v) => /[a-z]/.test(v) || "Must contain lowercase letter",
                                        hasNumber: (v) => /[0-9]/.test(v) || "Must contain a number",
                                        hasSpecialChar: (v) => /[@$!%*?&#^]/.test(v) || "Must contain special character (@$!%*?&#^)",
                                    },
                                })}
                            />
                            {errors.newPassword && (
                                <span className="text-xs text-red-400 flex items-center gap-1">
                                    <span>⚡</span> {errors.newPassword.message}
                                </span>
                            )}
                        </div>

                        {/* ── Confirm Password ── */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-300 tracking-wide">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Repeat your password"
                                className={`w-full px-4 py-3 rounded-xl bg-gray-800/80 border text-white text-sm outline-none transition-all duration-200 placeholder-gray-600
                                    ${errors.confirmPassword
                                        ? "border-red-500/70 focus:border-red-400"
                                        : "border-gray-700/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                                    }`}
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (v) => v === watch("newPassword") || "Passwords do not match",
                                })}
                            />
                            {errors.confirmPassword && (
                                <span className="text-xs text-red-400 flex items-center gap-1">
                                    <span>⚡</span> {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        {/* ── Submit ── */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-2 w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                                ${loading
                                    ? "bg-purple-800/50 cursor-not-allowed text-purple-300"
                                    : "bg-purple-600 hover:bg-purple-500 cursor-pointer shadow-lg shadow-purple-900/30"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                "Reset Password →"
                            )}
                        </button>

                        <div className="border-t border-gray-800/50" />

                        <Link
                            to={ROUTES.LOGIN}
                            className="text-sm text-gray-400 hover:text-gray-300 transition-colors text-center"
                        >
                            ← Back to login
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;