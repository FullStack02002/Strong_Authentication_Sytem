import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { verifyEmailThunk, resendVerificationThunk } from "../../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { resetVerifyState } from "../../features/auth/authSlice";

const RESEND_COOLDOWN = 60;

const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    const masked = local[0] + "*".repeat(Math.max(local.length - 1, 3));
    return `${masked}@${domain}`;
};

const VerifyEmail = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email") || localStorage.getItem("pendingEmail") || "";

    const verifying = useAppSelector((state) => state.auth.verifyingemail);
    const verified = useAppSelector((state) => state.auth.emailverified);
    const resending = useAppSelector((state) => state.auth.resendingemail);
    const verifyEmailFailed = useAppSelector((state) => state.auth.verifyEmailFailed)

    const [countdown, setCountdown] = useState(0);

    // guard — redirect if no token and no pendingEmail

    useEffect(() => {
        const hasPendingEmail = localStorage.getItem("pendingEmail");
        const hasTokenInURL = token && searchParams.get("email");

        if (!hasPendingEmail && !hasTokenInURL) {
            navigate(ROUTES.REGISTER, { replace: true });
        }
    }, []);




    //  auto verify when token is in URL
    useEffect(() => {
        dispatch(resetVerifyState())
        if (token && email) {
            handleVerify();
        }
    }, []);


    //  countdown timer for resend
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);


    //  call verify API 
    const handleVerify = async () => {
        if (!token || !email) return;

        const result = await (dispatch as any)(verifyEmailThunk({ token, email }));


        if (result.meta.requestStatus === "fulfilled" && result.payload !== null) {
            localStorage.removeItem("pendingEmail");
            setTimeout(() => navigate(ROUTES.LOGIN), 2000);
        }
    };


    //  resend verification email using thunk
    const handleResend = async () => {
        if (countdown > 0 || resending || !email) return;

        const result = await (dispatch as any)(resendVerificationThunk({ email }));

        if (result.meta.requestStatus === "fulfilled" && result.payload !== null) {
            setCountdown(RESEND_COOLDOWN);
        }
    };


    // ─────────────────────────────────────────
    // UI — Verifying state
    // ─────────────────────────────────────────
    if (verifying) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">
                    <div className="text-5xl mb-4">⏳</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Verifying your email...
                    </h2>
                    <p className="text-sm text-gray-500">Please wait a moment</p>

                    {/* ── Spinner ── */}
                    <div className="mt-6 flex justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        );
    }


    // ─────────────────────────────────────────
    // UI — Verified state
    // ─────────────────────────────────────────
    if (verified) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Email Verified!
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Your email has been verified successfully.
                        Redirecting to login...
                    </p>

                    {/* ── Spinner ── */}
                    <div className="flex justify-center mb-6">
                        <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>

                    <Link
                        to={ROUTES.LOGIN}
                        className="block w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition text-center"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (verifyEmailFailed) {
        return (
            <div className="h-screen overflow-hidden flex items-center justify-center px-4">
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 w-full max-w-md rounded-2xl p-8 text-center shadow-2xl">

                    <div className="text-5xl mb-4">❌</div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        Link Expired or Invalid
                    </h2>
                    <p className="text-sm text-gray-400 mb-8">
                        This verification link has expired or is invalid.
                        Request a new one below.
                    </p>

                    {/* ── Resend Button ── */}
                    <button
                        onClick={handleResend}
                        disabled={countdown > 0 || resending}
                        className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                        ${countdown > 0 || resending
                                ? "bg-purple-800/50 cursor-not-allowed text-purple-300"
                                : "bg-purple-600 hover:bg-purple-500 cursor-pointer shadow-lg shadow-purple-900/30"
                            }`}
                    >
                        {resending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                                Sending...
                            </>
                        ) : countdown > 0
                            ? `Resend in ${countdown}s`
                            : "Send New Verification Email"
                        }
                    </button>

                    {/* ── masked email ── */}
                    {email && (
                        <p className="text-xs text-gray-500 mt-4">
                            Sending to{" "}
                            <span className="text-purple-400 font-semibold">
                                {maskEmail(email)}
                            </span>
                        </p>
                    )}

                    <p className="text-sm text-gray-500 mt-4">
                        Already verified?{" "}
                        <Link
                            to={ROUTES.LOGIN}
                            className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        );
    }


    // ─────────────────────────────────────────
    // UI — Waiting / Resend
    // ─────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">

                <div className="text-5xl mb-4">📧</div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Verify Your Email
                </h2>

                <p className="text-sm text-gray-500 mb-1">
                    We sent a verification link to
                </p>
                <p className="text-base font-semibold text-indigo-600 mb-3">
                    {email ? maskEmail(email) : "your email"}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    Click the link in the email to verify your account.
                    The link expires in{" "}
                    <span className="font-semibold">10 minutes</span>.
                </p>

                {/* ── Resend Button ── */}
                <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-3">
                        Didn't receive the email?
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={countdown > 0 || resending}
                        className={`w-full py-3 rounded-lg text-white font-semibold text-sm transition
                            ${countdown > 0 || resending
                                ? "bg-indigo-300 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                            }`}
                    >
                        {resending
                            ? "Sending..."
                            : countdown > 0
                                ? `Resend in ${countdown}s`
                                : "Resend Verification Email"
                        }
                    </button>
                </div>

                {/* ── Wrong email ── */}
                <p className="text-xs text-gray-400 mt-4">
                    Wrong email?{" "}
                    <Link
                        to={ROUTES.REGISTER}
                        className="text-indigo-600 font-semibold hover:underline"
                        onClick={() => localStorage.removeItem("pendingEmail")}
                    >
                        Register again
                    </Link>
                </p>

                <p className="text-sm text-gray-500 mt-3">
                    Already verified?{" "}
                    <Link
                        to={ROUTES.LOGIN}
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;