import React, { useEffect, useRef, useState } from "react";
import logoV2 from "@/assets/logo-v2.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  Rocket,
  ShieldCheck,
  Smartphone,
  Palette,
  ArrowRight,
  LayoutDashboard,
  Utensils,
  Warehouse,
  Calculator,
  TrendingUp,
  Clock,
  Zap,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Redirect to admin panel if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Meal Management",
      description:
        "Efficiently manage meal planning and distribution for large-scale events and conferences.",
    },
    {
      icon: <Warehouse className="w-6 h-6" />,
      title: "Stock Control",
      description:
        "Real-time stock tracking and intelligent reorder recommendations based on demand.",
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Demand Prediction",
      description:
        "AI-powered forecasting to minimize waste and ensure everyone gets fed.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Secure Access",
      description:
        "Role-based access control for kitchen staff, admins, and distribution teams.",
    },
  ];

  const stats = [
    {
      label: "Meals Served",
      value: 10000,
      suffix: "+",
      icon: <Utensils className="w-8 h-8" />,
    },
    {
      label: "On-Time Delivery",
      value: 99.8,
      suffix: "%",
      icon: <Clock className="w-8 h-8" />,
    },
    {
      label: "Waste Reduction",
      value: 85,
      suffix: "%",
      icon: <TrendingUp className="w-8 h-8" />,
    },
    {
      label: "Active Users",
      value: 500,
      suffix: "+",
      icon: <Users className="w-8 h-8" />,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Kitchen Manager",
      company: "Tech Conference 2024",
      image: "/images/avatar-1.png",
      quote:
        "This platform transformed how we handle meal distribution. The AI forecasting is incredibly accurate, and we've reduced food waste by over 80%!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Event Coordinator",
      company: "Tech Summit 2024",
      image: "/images/avatar-2.png",
      quote:
        "Managing 2,000+ attendees was seamless. Real-time stock tracking meant we never ran out, and the dashboard gave us complete visibility.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Tech Lead",
      company: "Innovation Week",
      image: "/images/avatar-3.png",
      quote:
        "The best meal management system we've used. Intuitive, powerful, and the demand predictions have saved us thousands in food costs.",
      rating: 5,
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background selection:bg-primary/10 overflow-x-hidden"
    >
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10 bg-background">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] left-[30%] w-[30%] h-[30%] rounded-full bg-violet-500/5 blur-[100px]"
        />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={logoV2}
              alt="SmartMeal AI Logo"
              className="w-12 h-12 object-contain"
            />
            <img
              src="/images/smartmeal-logo-text.png"
              alt="SmartMeal AI"
              className="h-8 object-contain"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-background/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all active:scale-95"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="font-medium hover:bg-primary/5"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Powered by AI Demand Forecasting
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Manage Meals at <br />
              <span className="text-primary italic">Scale.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              The ultimate meal distribution and stock management platform
              designed for massive events. Smart, seamless, and efficient.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="h-14 px-8 text-lg rounded-2xl magnetic-button group transition-all duration-300 hover:shadow-premium"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              {/* <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-8 text-lg rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/70"
                            >
                                <BarChart3 className="mr-2 w-5 h-5" />
                                View Demo
                            </Button> */}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full" />

            {/* Hero Image */}
            <div className="relative overflow-hidden animate-float max-h-[500px] rounded-[2rem] shadow-2xl">
              <img
                src="/images/hero-illustration.png"
                alt="AI-Powered Meal Management"
                className="w-full h-full object-cover max-h-[500px] rounded-[2rem]"
              />
            </div>

            {/* Floating Stats Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 glass-card p-4 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-success/20">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  System Status
                </div>
                <div className="text-sm font-bold">100% Operational</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  AI Powered
                </div>
                <div className="text-sm font-bold">Smart Predictions</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-6 sm:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 sm:px-12 bg-muted/20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4">
              Built for modern organizers
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              Everything you need to manage meals at scale, powered by
              cutting-edge AI technology.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card p-8 group hover:bg-primary/[0.02] transition-all tilt-card"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  {React.cloneElement(feature.icon, {
                    className:
                      "w-6 h-6 text-primary transition-colors duration-300 group-hover:text-white",
                  })}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 sm:px-12 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4">
              Loved by event organizers
            </h2>
            <p className="text-muted-foreground text-lg mt-4">
              See what our customers have to say about their experience.
            </p>
          </div>

          <div className="relative">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8 sm:p-12 rounded-[2rem]"
            >
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="flex-1">
                  <h4 className="text-xl font-bold">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[currentTestimonial].role}
                  </p>
                  <p className="text-xs text-primary font-semibold">
                    {testimonials[currentTestimonial].company}
                  </p>
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    )
                  )}
                </div>
              </div>
              <blockquote className="text-lg sm:text-xl leading-relaxed text-foreground italic">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full glass hover:bg-primary/10 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentTestimonial
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30"
                      }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full glass hover:bg-primary/10 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 relative z-10">
            Join the future of event catering.
          </h2>
          <p className="text-white/90 text-lg sm:text-xl mb-12 max-w-2xl mx-auto relative z-10 font-medium">
            Stop guessing demand. Start delivering excellence with our
            data-driven meal management ecosystem.
          </p>
          <div className="relative z-10">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/login")}
              className="h-16 px-10 text-xl rounded-2xl bg-white text-primary hover:bg-white/90 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 magnetic-button"
            >
              Enter Admin Workspace
              <LayoutDashboard className="ml-3 w-6 h-6" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 px-6 sm:px-12 bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={logoV2}
                  alt="SmartMeal AI Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="font-bold tracking-tight">SmartMeal AI</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
                The ultimate AI-powered meal management platform for events at
                scale. Reduce waste, optimize planning, and deliver excellence.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm font-medium">
              © 2025 SmartMeal AI. Crafted with React & Framer Motion.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

// Animated Stat Card Component
const StatCard = ({ stat, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [hasAnimated, setHasAnimated] = useState(false);
  const count = useMotionValue(0);
  const rounded = useSpring(count, { damping: 50, stiffness: 100 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const controls = count.set(stat.value);
    }
  }, [isInView, hasAnimated, stat.value, count]);

  useEffect(() => {
    const unsubscribe = rounded.onChange((latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return unsubscribe;
  }, [rounded]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { y: 30, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { delay: index * 0.1 },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="glass-card p-8 text-center group hover:border-primary/20 transition-all tilt-card"
    >
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 glow-effect">
          {stat.icon}
        </div>
      </div>
      <div className="text-4xl sm:text-5xl font-bold mb-2 text-primary">
        {displayValue}
        {stat.suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
        {stat.label}
      </div>
    </motion.div>
  );
};

export default Landing;
