import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { loginThunk, verifyLoginOTPThunk } from "../../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "../../app/hook";

interface LoginFormData {
  email: string;
  password: string;
}

interface OTPFormData {
  otp: string;
}

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  const loginLoading = useAppSelector((state) => state.auth.loginLoading);
  const otpLoading = useAppSelector((state) => state.auth.loginOtpLoading);

  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");

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

  // ── Step 1 — Login ──
  const onLogin = async (data: LoginFormData) => {

    const result = await (dispatch as any)(loginThunk({
      email: data.email,
      password: data.password,
    }));


    if (result.meta.requestStatus === "fulfilled" && result.payload !== null) {
      setEmail(data.email);
      localStorage.setItem("pendingEmail", data.email);
      setStep("otp"); // show OTP input
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

  // ── OTP digit input handler ──
  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6); // digits only
    setOTPValue("otp", val);
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* ── Brand ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 mb-4">
            <span className="text-2xl">🔐</span>
          </div>
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

          {/* ════════════════════════════
                        STEP 1 — Login Form
                    ════════════════════════════ */}
          {step === "login" && (
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
                                    {/* <Link
                                        to={ROUTES.FORGOT_PASSWORD}
                                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        Forgot password?
                                    </Link> */}
                                </div>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-800/80 border text-white text-sm outline-none transition-all duration-200 placeholder-gray-600
                                        ${errors.password
                                            ? "border-red-500/70 focus:border-red-400"
                                            : "border-gray-700/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                                        }`}
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                />
                                {errors.password && (
                                    <span className="text-xs text-red-400 flex items-center gap-1">
                                        <span>⚡</span> {errors.password.message}
                                    </span>
                                )}
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
          )}

          {/* ════════════════════════════
                        STEP 2 — OTP Input
                    ════════════════════════════ */}
          {step === "otp" && (
            <form onSubmit={handleSubmitOTP(onVerifyOTP)} className="flex flex-col gap-5">

              {/* ── OTP hint ── */}
              <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-purple-300">
                  OTP expires in <span className="font-bold">10 minutes</span>
                </p>
              </div>

              {/* ── OTP Input — 6 big digits ── */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300 tracking-wide text-center">
                  Enter 6-digit OTP
                </label>

                {/* ── single input styled as boxes ── */}
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

              {/* ── Submit ── */}
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

              {/* ── Back to login ── */}
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