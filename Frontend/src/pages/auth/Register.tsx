import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { registerThunk } from "../../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import GoogleButton from "../../components/shared/GoogleButton";
import { useRecaptcha } from "../../hooks/useRecaptcha";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.auth.registerLoading);
  const { getToken } = useRecaptcha();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    const captchaToken = await getToken("register");
    if (!captchaToken) return;

    const result = await (dispatch as any)(registerThunk({
      name: data.name,
      email: data.email,
      password: data.password,
      captchaToken,
    }));

    if (result.meta.requestStatus === "fulfilled" && result.payload !== null) {
      localStorage.setItem("pendingEmail", data.email);
      setTimeout(() => navigate(ROUTES.VERIFY_EMAIL), 2000);
    }
  };

  const getStrength = (v: string) => {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[a-z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[@$!%*?&#^]/.test(v)) s++;
    return s;
  };

  const strengthBar = ["w-0", "w-1/5 bg-red-500", "w-2/5 bg-orange-500", "w-3/5 bg-yellow-500", "w-4/5 bg-blue-500", "w-full bg-green-500"];
  const strengthColor = ["", "text-red-500", "text-orange-500", "text-yellow-500", "text-blue-500", "text-green-500"];
  const strengthLabel = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex items-center gap-12">

        {/* ── Left — Brand ── */}
        <div className="hidden md:flex flex-col flex-1 gap-6">

          {/* logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <span className="text-xl">🔐</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Auth<span className="text-purple-400">System</span>
            </span>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Start your journey
              <span className="block text-purple-400">with us today</span>
            </h1>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Create your account in seconds and get access to all features. Secured with industry-standard authentication.
            </p>
          </div>

          {/* ── feature pills ── */}
          <div className="flex flex-col gap-3">
            {[
              { icon: "⚡", text: "OTP-based secure login" },
              { icon: "🔑", text: "Google OAuth 2.0 support" },
              { icon: "🛡️", text: "JWT + Redis token management" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-sm flex-shrink-0">
                  {icon}
                </div>
                <span className="text-sm text-gray-400">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — Form ── */}
        <div className="flex-1 w-full">

          {/* mobile only logo */}
          <div className="md:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 mb-3">
              <span className="text-xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 text-xs mt-1">Join us today — it's free</p>
          </div>

          {/* ── Card ── */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col gap-4">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                {/* ── Name + Email row ── */}
                <div className="flex gap-3">

                  {/* Name */}
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-medium text-gray-300 tracking-wide">
                      Full Name
                    </label>
                    <input
                      placeholder="John Doe"
                      className={`w-full px-3 py-2.5 rounded-xl bg-gray-800/80 border text-white text-sm outline-none transition-all duration-200 placeholder-gray-600
                                                ${errors.name
                          ? "border-red-500/70 focus:border-red-400"
                          : "border-gray-700/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                        }`}
                      {...register("name", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Min 2 characters" },
                        maxLength: { value: 50, message: "Name too long" },
                        setValueAs: (v) => v.trim(),
                      })}
                    />
                    {errors.name && (
                      <span className="text-xs text-red-400 flex items-center gap-1">
                        <span>⚡</span> {errors.name.message}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-medium text-gray-300 tracking-wide">
                      Email Address
                    </label>
                    <input
                      placeholder="john@example.com"
                      className={`w-full px-3 py-2.5 rounded-xl bg-gray-800/80 border text-white text-sm outline-none transition-all duration-200 placeholder-gray-600
                                                ${errors.email
                          ? "border-red-500/70 focus:border-red-400"
                          : "border-gray-700/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                        }`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                        setValueAs: (v) => v.trim().toLowerCase(),
                      })}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-400 flex items-center gap-1">
                        <span>⚡</span> {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Password ── */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-300 tracking-wide">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    className={`w-full px-3 py-2.5 rounded-xl bg-gray-800/80 border text-white text-sm outline-none transition-all duration-200 placeholder-gray-600
                                            ${errors.password
                        ? "border-red-500/70 focus:border-red-400"
                        : "border-gray-700/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                      }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "At least 8 characters" },
                      maxLength: { value: 32, message: "At most 32 characters" },
                      validate: {
                        hasUppercase: (v) => /[A-Z]/.test(v) || "Must contain uppercase",
                        hasLowercase: (v) => /[a-z]/.test(v) || "Must contain lowercase",
                        hasNumber: (v) => /[0-9]/.test(v) || "Must contain number",
                        hasSpecialChar: (v) => /[@$!%*?&#^]/.test(v) || "Must contain special char (@$!%*?&#^)",
                      },
                    })}
                  />
                  {errors.password && (
                    <span className="text-xs text-red-400 flex items-center gap-1">
                      <span>⚡</span> {errors.password.message}
                    </span>
                  )}

                  {/* ── Strength ── */}
                  {watch("password") && (
                    <div className="mt-0.5">
                      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strengthBar[getStrength(watch("password"))]}`} />
                      </div>
                      <p className={`text-xs mt-0.5 ${strengthColor[getStrength(watch("password"))]}`}>
                        {strengthLabel[getStrength(watch("password"))]}
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Confirm Password ── */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-300 tracking-wide">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Repeat your password"
                    className={`w-full px-3 py-2.5 rounded-xl bg-gray-800/80 border text-white text-sm outline-none transition-all duration-200 placeholder-gray-600
                                            ${errors.confirmPassword
                        ? "border-red-500/70 focus:border-red-400"
                        : "border-gray-700/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                      }`}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === watch("password") || "Passwords do not match",
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
                  className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                                        ${loading
                      ? "bg-purple-800/50 cursor-not-allowed text-purple-300"
                      : "bg-purple-600 hover:bg-purple-500 cursor-pointer shadow-lg shadow-purple-900/30"
                    }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account →"
                  )}
                </button>
              </form>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-xs text-gray-500">or</span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>

              <GoogleButton label="Sign up with Google" />
            </div>
          </div>

          {/* ── Login link ── */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
