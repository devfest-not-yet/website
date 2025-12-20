import React, { useState, useEffect } from "react";
import logoV2 from "@/assets/logo-v2.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { validateEmail } from "@/utilities/validators";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ChevronRight, Loader2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Login = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState("");

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            navigate("/admin");
        }
    }, [isAuthenticated, authLoading, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        // Clear API error
        if (apiError) {
            setApiError("");
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
        } catch (error) {
            setApiError(error.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden"
        >
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px]" />
            </div>

            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full glass hover:bg-primary/10 transition-all active:scale-95 shadow-lg"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            <div className="w-full max-w-[440px] relative">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to landing
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="glass-card p-8 sm:p-10 shadow-premium border-white/20"
                >
                    {/* Brand */}
                    <div className="flex justify-center mb-4">
                        <img src={logoV2} alt="SmartMeal AI Logo" className="w-24 h-24 object-contain filter drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]" />
                    </div>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            Welcome back
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            Enter your credentials to access the workspace
                        </p>
                    </div>

                    {/* API Error Message */}
                    <AnimatePresence mode="wait">
                        {apiError && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, mb: 0 }}
                                animate={{ opacity: 1, height: "auto", mb: 24 }}
                                exit={{ opacity: 0, height: 0, mb: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
                                    <p className="text-xs font-semibold text-destructive">{apiError}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <div className="relative group">
                                <div className="absolute left-4 top-[42px] text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <Input
                                    type="email"
                                    name="email"
                                    label="Email address"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                    disabled={isLoading}
                                    autoComplete="email"
                                    className="pl-11 h-12 rounded-xl bg-muted/30 border-muted-foreground/10 focus:bg-background transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative group">
                                <div className="absolute left-4 top-[42px] text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    label="Password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                    className="pl-11 h-12 rounded-xl bg-muted/30 border-muted-foreground/10 focus:bg-background transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[42px] text-muted-foreground hover:text-primary transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    name="rememberMe"
                                    id="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-4 h-4 rounded border-muted-foreground/20 text-primary focus:ring-primary/20"
                                />
                                <label htmlFor="rememberMe" className="text-xs font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
                                    Stay signed in
                                </label>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Sign In to Dashboard
                                    <ChevronRight className="ml-1 w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </motion.div>

                {/* Footer Info */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 text-center text-xs text-muted-foreground font-medium"
                >
                    Don't have access? <Link to="/contact" className="text-primary font-bold hover:underline">Contact Administrator</Link>
                </motion.p>
            </div>
        </motion.div>
    );
};

export default Login;

