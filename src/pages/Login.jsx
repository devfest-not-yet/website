import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { validateEmail } from "@/utilities/validators";

const Login = () => {
    const navigate = useNavigate();
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
            navigate("/dashboard");
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
            // Navigation happens automatically via useEffect when isAuthenticated changes
        } catch (error) {
            setApiError(error.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-lg shadow-lg p-8 animate-fade-in">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* API Error Message */}
                    {apiError && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                            <p className="text-sm text-destructive text-center">{apiError}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            disabled={isLoading}
                            autoComplete="email"
                        />

                        <div>
                            <div className="relative">
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
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Checkbox
                                name="rememberMe"
                                label="Remember me"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-primary font-medium hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-4 text-center">
                        <Link
                            to="/"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
