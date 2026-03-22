import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { forgotPasswordThunk } from "../../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { maskEmail } from "../../utils/maskEmail";
import { useRecaptcha } from "../../hooks/useRecaptcha";




interface ForgotFormData {
    email: string;
}

const ForgotPassword = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state) => state.auth.forgotPasswordLoading);

    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState("");
    const [countdown, setCountdown] = useState(60);

    const { getToken } = useRecaptcha();



    // start countdown when submitted becomes true
    useEffect(() => {
        if (!submitted) return;

        setCountdown(60);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [submitted]);


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotFormData>();

    const onSubmit = async (data: ForgotFormData) => {
        const captchaToken = await getToken("forgot_password");
        if (!captchaToken) return;
        const result = await (dispatch as any)(forgotPasswordThunk({ email: data.email, captchaToken }));

        //  always show success UI — don't reveal if email exists
        if (result.meta.requestStatus === "fulfilled") {
            setEmail(data.email);
            setSubmitted(true);
        }
    };

    // ─────────────────────────────────────────
    // UI — After submit
    // ─────────────────────────────────────────
    if (submitted) {
        return (
            <div className="h-screen overflow-hidden flex items-center justify-center px-4">
                <div className="w-full max-w-md">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 mb-4">
                            <span className="text-2xl">📬</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Check Your Email
                        </h1>
                        <p className="text-gray-400 text-sm mt-2">
                            We sent a reset link to your email
                        </p>
                    </div>

                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl text-center">

                        <p className="text-sm text-gray-400 mb-2">Reset link sent to</p>
                        <p className="text-base font-semibold text-purple-400 mb-6">
                            {maskEmail(email)}
                        </p>

                        <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl px-4 py-3 mb-6">
                            <p className="text-xs text-purple-300">
                                Link expires in <span className="font-bold">15 minutes</span>
                            </p>
                        </div>

                        <p className="text-sm text-gray-500 mb-6">
                            Didn't receive it? Check your spam folder or try again.
                        </p>

                        <div className="flex flex-col items-center gap-2 mb-6">
                            <p className="text-xs text-gray-500">Didn't receive it?</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                disabled={countdown > 0 || loading}
                                className={`text-sm font-semibold transition-all flex items-center gap-2
            ${countdown > 0 || loading
                                        ? "text-gray-600 cursor-not-allowed"
                                        : "text-purple-400 hover:text-purple-300 cursor-pointer"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : countdown > 0 ? (
                                    <span className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-700 text-xs text-gray-400 font-bold">
                                            {countdown}
                                        </span>
                                        Resend Link
                                    </span>
                                ) : (
                                    "Resend Link"
                                )}
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Remembered your password?{" "}
                        <Link
                            to={ROUTES.LOGIN}
                            className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
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
                        <span className="text-2xl">🔑</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Forgot Password
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Enter your email to receive a reset link
                    </p>
                </div>

                {/* ── Card ── */}
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                        <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl px-4 py-3 text-center">
                            <p className="text-xs text-purple-300">
                                Reset link expires in <span className="font-bold">15 minutes</span>
                            </p>
                        </div>

                        {/* ── Email ── */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-300 tracking-wide">
                                Email Address
                            </label>
                            <input
                                placeholder="john@example.com"
                                className={`w-full px-4 py-3 rounded-xl bg-gray-800/80 border text-white text-sm outline-none transition-all duration-200 placeholder-gray-600
                                    ${errors.email
                                        ? "border-red-500/70 focus:border-red-400"
                                        : "border-gray-700/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                                    }`}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email format",
                                    },
                                    setValueAs: (v) => v.trim().toLowerCase(),
                                })}
                            />
                            {errors.email && (
                                <span className="text-xs text-red-400 flex items-center gap-1">
                                    <span>⚡</span> {errors.email.message}
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
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link →"
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

export default ForgotPassword;