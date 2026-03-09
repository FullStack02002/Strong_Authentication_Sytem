import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { logoutThunk } from "../../features/auth/authThunks";
import { ROUTES } from "../../routes/routePaths";

const Header = () => {
    const dispatch        = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user            = useAppSelector((state) => state.auth.user);
    const loading         = useAppSelector((state) => state.auth.logoutLoading);

    const handleLogout = () => {
        (dispatch as any)(logoutThunk());
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-gray-950/95 backdrop-blur-md border-b border-gray-800/50">
      
            <div className="max-w-6xl mx-auto flex items-center justify-between">

                {/* ── Logo ── */}
                <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-600/30 transition-all">
                        <span className="text-sm">🔐</span>
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">
                        Auth<span className="text-purple-400">System</span>
                    </span>
                </Link>

                {/* ── Nav ── */}
                <nav className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
                    <a href="#security" className="text-sm text-gray-400 hover:text-white transition-colors">Security</a>
                    <a href="#docs"     className="text-sm text-gray-400 hover:text-white transition-colors">Docs</a>
                </nav>

                {/* ── Auth Buttons ── */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            {/* ── User greeting ── */}
                            <span className="text-sm text-gray-400 hidden md:block">
                                Hey,{" "}
                                <span className="text-purple-400 font-semibold">
                                    {user?.name?.split(" ")[0]}
                                </span>
                            </span>

                            {/* ── Logout ── */}
                            <button
                                onClick={handleLogout}
                                disabled={loading}
                                className={`text-sm text-white px-4 py-2 rounded-lg border transition-all flex items-center gap-2
                                    ${loading
                                        ? "bg-red-900/20 border-red-900/30 cursor-not-allowed text-red-400"
                                        : "bg-red-600/20 border-red-800/50 hover:bg-red-600/30 hover:border-red-600 cursor-pointer"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                        Logging out...
                                    </>
                                ) : (
                                    "Logout"
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to={ROUTES.LOGIN}
                                className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
                            >
                                Sign In
                            </Link>
                            <Link
                                to={ROUTES.REGISTER}
                                className="text-sm text-white px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/30"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
