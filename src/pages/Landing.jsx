import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

const Landing = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Redirect to dashboard if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const features = [
        {
            icon: "🚀",
            title: "Fast & Modern",
            description: "Built with React and Vite for lightning-fast performance and modern development experience.",
        },
        {
            icon: "🔒",
            title: "Secure Authentication",
            description: "Industry-standard authentication with secure token-based session management.",
        },
        {
            icon: "📱",
            title: "Fully Responsive",
            description: "Seamless experience across all devices - mobile, tablet, and desktop.",
        },
        {
            icon: "🎨",
            title: "Beautiful UI",
            description: "Clean and modern interface built with Tailwind CSS and shadcn/ui components.",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 -z-10" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in">
                            Welcome to{" "}
                            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                DevFest
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
                            A modern React application with authentication, beautiful UI components, and
                            responsive design. Get started in seconds and build amazing experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
                            <Button
                                size="lg"
                                onClick={() => navigate("/signup")}
                                className="w-full sm:w-auto"
                            >
                                Get Started
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate("/login")}
                                className="w-full sm:w-auto"
                            >
                                Sign In
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Why Choose DevFest?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to build modern web applications with confidence
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-8 sm:p-12 border border-primary/20">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Ready to get started?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Join thousands of users already building with DevFest
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                onClick={() => navigate("/signup")}
                                className="w-full sm:w-auto"
                            >
                                Create Account
                            </Button>
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() => navigate("/login")}
                                className="w-full sm:w-auto"
                            >
                                Sign In
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-muted-foreground">
                        <p>&copy; 2025 DevFest. Built with React + Vite + Tailwind CSS.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
