import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hook";
import { ROUTES } from "../routes/routePaths";


const features = [
    {
        icon: "🔑",
        title: "JWT Authentication",
        description: "Secure access tokens with 15-minute expiry and automatic refresh via httpOnly cookies.",
    },
    {
        icon: "📧",
        title: "Email Verification",
        description: "Crypto-secure tokens sent to email. Hashed storage in Redis with 10-minute expiry.",
    },
    {
        icon: "🔢",
        title: "OTP Login",
        description: "Two-step login with 6-digit OTP. Rate limited to prevent brute force attacks.",
    },
    {
        icon: "🛡️",
        title: "Role Based Access",
        description: "Admin and user roles with middleware-level protection on every sensitive route.",
    },
    {
        icon: "⚡",
        title: "Redis Caching",
        description: "User sessions and tokens cached in Redis for lightning-fast authentication.",
    },
    {
        icon: "🔒",
        title: "Security First",
        description: "bcrypt hashing, mongo sanitization, Zod validation and CORS protection built in.",
    },
];

const steps = [
    { step: "01", title: "Register", desc: "Create your account with name, email and password." },
    { step: "02", title: "Verify Email", desc: "Click the link sent to your email to activate." },
    { step: "03", title: "Login + OTP", desc: "Sign in and confirm identity with a 6-digit OTP." },
    { step: "04", title: "Access Dashboard", desc: "You're in. Secure, fast, and seamless." },
];

const Home = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="min-h-screen">
            <Header />

            {/* ════════════════════════════
                Hero
            ════════════════════════════ */}
            <section className="pt-32 pb-24 px-6 text-center relative overflow-hidden">

                {/* ── glow ── */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto">

                    {/* ── badge ── */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                        Production Ready Authentication
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Auth that just
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600"> works</span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                        A fullstack authentication system built with React, Node.js, Redis and MongoDB.
                        JWT tokens, OTP login, email verification — secure by default.
                    </p>

                    {/* ── CTA ── */}
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <div className="px-6 py-3 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-300 text-sm">
                                    👋 Welcome back, <span className="font-bold text-white">{user?.name}</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to={ROUTES.REGISTER}
                                    className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-lg shadow-purple-900/30 hover:shadow-purple-800/40"
                                >
                                    Get Started Free →
                                </Link>
                                <Link
                                    to={ROUTES.LOGIN}
                                    className="px-8 py-3.5 rounded-xl border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-semibold transition-all"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════
                Features
            ════════════════════════════ */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Everything you need
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Built with modern security practices so you don't have to think about it.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 hover:border-purple-800/50 hover:bg-gray-900/80 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-600/20 transition-all">
                                    <span className="text-2xl">{f.icon}</span>
                                </div>
                                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════
                How it works
            ════════════════════════════ */}
            <section id="security" className="py-24 px-6">
                <div className="max-w-4xl mx-auto">

                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            How it works
                        </h2>
                        <p className="text-gray-400">
                            From zero to authenticated in four simple steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {steps.map((s, i) => (
                            <div
                                key={s.step}
                                className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 flex gap-4 hover:border-purple-800/50 transition-all"
                            >
                                <div className="text-3xl font-bold text-purple-800/60 leading-none mt-1">
                                    {s.step}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════
                CTA Banner
            ════════════════════════════ */}
            {!isAuthenticated && (
                <section className="py-24 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="bg-gray-900/80 border border-purple-800/30 rounded-3xl p-12 relative overflow-hidden">

                            {/* glow */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 rounded-full bg-purple-600/10 blur-3xl" />
                            </div>

                            <div className="relative">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Ready to get started?
                                </h2>
                                <p className="text-gray-400 mb-8">
                                    Create your account in seconds. No credit card required.
                                </p>
                                <Link
                                    to={ROUTES.REGISTER}
                                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-lg shadow-purple-900/30"
                                >
                                    Create Free Account →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
};

export default Home;