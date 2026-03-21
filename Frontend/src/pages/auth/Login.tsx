import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { loginThunk, verifyLoginOTPThunk, resendLoginOTPThunk } from "../../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import GoogleButton from "../../components/shared/GoogleButton";
import { useSearchParams } from "react-router-dom";

interface LoginFormData {
    email: string;
    password: string;
}

interface OTPFormData {
    otp: string;
}

const OTP_COOLDOWN = 60;

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const googleError = searchParams.get("error");

    const loginLoading = useAppSelector((state) => state.auth.loginLoading);
    const otpLoading = useAppSelector((state) => state.auth.loginOtpLoading);
    const resendLoading = useAppSelector((state) => state.auth.resendOtpLoading);

    const [step, setStep] = useState<"login" | "otp">("login");
    const [email, setEmail] = useState("");
    const [countdown, setCountdown] = useState(OTP_COOLDOWN);

    // ── Login Form ──
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    // ── OTP Form ──
    const {
        register: registerOTP,
        handleSubmit: handleSubmitOTP,
        formState: { errors: otpErrors },
        setValue: setOTPValue,
        watch: watchOTP,
    } = useForm<OTPFormData>();

    //  start countdown when step changes to otp
    useEffect(() => {
        if (step !== "otp") return;

        setCountdown(OTP_COOLDOWN);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [step]);

    // ── Step 1 — Login ──
    const onLogin = async (data: LoginFormData) => {
        const result = await (dispatch as any)(loginThunk({
            email: data.email,
            password: data.password,
        }));

        if (result.meta.requestStatus === "fulfilled" && result.payload !== null) {
            setEmail(data.email);
            localStorage.setItem("pendingEmail", data.email);
            setStep("otp");
        }

        if (result.meta.requestStatus === "rejected") {
            const payload = result.payload as { message: string; status: number };
            if (payload?.status === 403) {
                localStorage.setItem("pendingEmail", data.email);
            }
        }
    };

    // ── Step 2 — Verify OTP ──
    const onVerifyOTP = async (data: OTPFormData) => {
        const result = await (dispatch as any)(verifyLoginOTPThunk({
            email,
            otp: data.otp,
        }));

        if (result.meta.requestStatus === "fulfilled" && result.payload !== null) {
            localStorage.removeItem("pendingEmail");
            navigate(ROUTES.HOME);
        }
    };

    // ── Resend OTP ──
    const handleResendOTP = async () => {
        if (countdown > 0 || resendLoading) return;

        const result = await (dispatch as any)(resendLoginOTPThunk({ email }));

        if (result.meta.requestStatus === "fulfilled" && result.payload !== null) {
            setCountdown(OTP_COOLDOWN); // restart countdown

            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) { clearInterval(timer); return 0; }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    // ── OTP digit only input ──
    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
        setOTPValue("otp", val);
    };

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* ── Brand ── */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 mb-4">
                        <span className="text-2xl">🔐</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {step === "login" ? "Welcome Back" : "Check Your Email"}
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        {step === "login"
                            ? "Sign in to your account"
                            : `We sent a 6-digit OTP to ${email}`
                        }
                    </p>
                </div>

                {/* ── Card ── */}
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">

                    {/* ════════════════════
                        STEP 1 — Login
                    ════════════════════ */}
                    {step === "login" && (
                        <div className="flex flex-col gap-5">
                            {googleError === "google_failed" && (
                                <div className="bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3 flex items-center gap-3">
                                    <span className="text-base">❌</span>
                                    <div>
                                        <p className="text-xs text-red-400 font-semibold">
                                            Google sign in failed
                                        </p>
                                        <p className="text-xs text-red-400/70 mt-0.5">
                                            Please try again or use email and password
                                        </p>
                                    </div>
                                </div>
                            )}
                            <form onSubmit={handleSubmit(onLogin)} className="flex flex-col gap-5">

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

                                {/* ── Password ── */}

                                <div className="flex flex-col gap-1.5">

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-300 tracking-wide">
                                            Password
                                        </label>
                                    </div>

                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        className={`w-full px-4 py-3 rounded-xl bg-gray-800/80 border text-white text-sm outline-none transition-all duration-200 placeholder-gray-600
            ${errors.password ? "border-red-500/70 focus:border-red-400" : "border-gray-700/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                                            }`}
                                        {...register("password", {
                                            required: "Password is required",
                                        })}
                                    />
                                    <div className="flex items-center justify-between min-h-[16px]">
                                        {errors.password ? (
                                            <span className="text-xs text-red-400 flex items-center gap-1">
                                                <span>⚡</span> {errors.password.message}
                                            </span>
                                        ) : (
                                            <span />
                                        )}
                                        <Link
                                            to={ROUTES.FORGOT_PASSWORD}
                                            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>

                                {/* ── Submit ── */}
                                <button
                                    type="submit"
                                    disabled={loginLoading}
                                    className={`mt-2 w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                                    ${loginLoading
                                            ? "bg-purple-800/50 cursor-not-allowed text-purple-300"
                                            : "bg-purple-600 hover:bg-purple-500 cursor-pointer shadow-lg shadow-purple-900/30"
                                        }`}
                                >
                                    {loginLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign In →"
                                    )}
                                </button>
                            </form>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-800" />
                                <span className="text-xs text-gray-500">or</span>
                                <div className="flex-1 h-px bg-gray-800" />
                            </div>

                            <GoogleButton label="Continue with Google" />

                        </div>
                    )}

                    {/* ════════════════════
                        STEP 2 — OTP
                    ════════════════════ */}
                    {step === "otp" && (
                        <form onSubmit={handleSubmitOTP(onVerifyOTP)} className="flex flex-col gap-5">

                            {/* ── OTP hint ── */}
                            <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl px-4 py-3 text-center">
                                <p className="text-xs text-purple-300">
                                    OTP expires in <span className="font-bold">10 minutes</span>
                                </p>
                            </div>

                            {/* ── OTP Input ── */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-300 tracking-wide text-center">
                                    Enter 6-digit OTP
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="000000"
                                    className={`w-full px-4 py-4 rounded-xl bg-gray-800/80 border text-white text-3xl font-bold outline-none transition-all duration-200 text-center tracking-[1rem]
                                        ${otpErrors.otp
                                            ? "border-red-500/70 focus:border-red-400"
                                            : "border-gray-700/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                                        }`}
                                    {...registerOTP("otp", {
                                        required: "OTP is required",
                                        minLength: { value: 6, message: "OTP must be 6 digits" },
                                        maxLength: { value: 6, message: "OTP must be 6 digits" },
                                        pattern: { value: /^\d{6}$/, message: "OTP must be 6 digits" },
                                    })}
                                    onChange={handleOTPChange}
                                />
                                {otpErrors.otp && (
                                    <span className="text-xs text-red-400 flex items-center justify-center gap-1">
                                        <span>⚡</span> {otpErrors.otp.message}
                                    </span>
                                )}
                            </div>

                            {/* ── Verify Submit ── */}
                            <button
                                type="submit"
                                disabled={otpLoading || (watchOTP("otp") || "").length < 6}
                                className={`mt-2 w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                                    ${otpLoading || (watchOTP("otp") || "").length < 6
                                        ? "bg-purple-800/50 cursor-not-allowed text-purple-300"
                                        : "bg-purple-600 hover:bg-purple-500 cursor-pointer shadow-lg shadow-purple-900/30"
                                    }`}
                            >
                                {otpLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify OTP →"
                                )}
                            </button>

                            {/* ── Resend OTP ── */}
                            <div className="flex flex-col items-center gap-2 pt-1">
                                <p className="text-xs text-gray-500">Didn't receive the OTP?</p>
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={countdown > 0 || resendLoading}
                                    className={`text-sm font-semibold transition-all flex items-center gap-2
                                        ${countdown > 0 || resendLoading
                                            ? "text-gray-600 cursor-not-allowed"
                                            : "text-purple-400 hover:text-purple-300 cursor-pointer"
                                        }`}
                                >
                                    {resendLoading ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : countdown > 0 ? (
                                        // ✅ countdown ring
                                        <span className="flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-700 text-xs text-gray-400 font-bold">
                                                {countdown}
                                            </span>
                                            Resend OTP
                                        </span>
                                    ) : (
                                        "Resend OTP"
                                    )}
                                </button>
                            </div>

                            {/* ── Divider ── */}
                            <div className="border-t border-gray-800/50" />

                            {/* ── Back ── */}
                            <button
                                type="button"
                                onClick={() => setStep("login")}
                                className="text-sm text-gray-400 hover:text-gray-300 transition-colors text-center"
                            >
                                ← Back to login
                            </button>
                        </form>
                    )}
                </div>

                {/* ── Register link ── */}
                {step === "login" && (
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to={ROUTES.REGISTER}
                            className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                        >
                            Create one
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;