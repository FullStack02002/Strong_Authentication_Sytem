import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

const Footer = () => {
    return (
        <footer className="border-t border-gray-800/50 mt-24">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

                    {/* ── Brand ── */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                <span className="text-sm">🔐</span>
                            </div>
                            <span className="text-white font-bold text-lg">
                                Auth<span className="text-purple-400">System</span>
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Production-ready authentication built with security-first principles.
                            JWT, OTP, email verification — all out of the box.
                        </p>
                    </div>

                    {/* ── Product ── */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><a href="#features" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Features</a></li>
                            <li><a href="#security" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Security</a></li>
                            <li><a href="#docs"     className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Docs</a></li>
                        </ul>
                    </div>

                    {/* ── Account ── */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-4">Account</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to={ROUTES.LOGIN}    className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Sign In</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.REGISTER} className="text-gray-500 text-sm hover:text-gray-300 transition-colors">Register</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ── Bottom ── */}
                <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-xs">
                        © {new Date().getFullYear()} AuthSystem. Built with ❤️ using React + Node.js
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">Privacy</a>
                        <a href="#" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">Terms</a>
                        <a href="#" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;