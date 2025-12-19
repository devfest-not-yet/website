import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    CalendarClock,
    Utensils,
    Users,
    Menu,
    X,
    Clock,
    Calendar,
    LogOut
} from 'lucide-react';
import { getCurrentMealPeriod } from '@/utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { adminApi } from '@/api/adminApi';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();
    const queryClient = useQueryClient();

    // Warm up the cache by prefetching critical data
    useEffect(() => {
        const prefetchData = async () => {
            queryClient.prefetchQuery({ queryKey: ['admin-analytics'], queryFn: adminApi.getAnalytics });
            queryClient.prefetchQuery({ queryKey: ['admin-stock'], queryFn: adminApi.getStock });
            queryClient.prefetchQuery({ queryKey: ['admin-schedule'], queryFn: adminApi.getSchedule });
            queryClient.prefetchQuery({ queryKey: ['admin-menu'], queryFn: adminApi.getMenu });
            queryClient.prefetchQuery({ queryKey: ['admin-distribution'], queryFn: adminApi.getDistributionTimeslots });
            queryClient.prefetchQuery({ queryKey: ['admin-students'], queryFn: adminApi.getStudentDemands });
        };
        prefetchData();
    }, [queryClient]);

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'Stock Management', href: '/admin/stock', icon: Package },
        { name: 'Cooking Schedule', href: '/admin/schedule', icon: CalendarClock },
        { name: 'Menu Planner', href: '/admin/menu', icon: Utensils },
        { name: 'Meal Distribution', href: '/admin/distribution', icon: Users },
        { name: 'Student Demands', href: '/admin/demands', icon: Users },
    ];

    const getMealPeriodBadge = () => {
        const period = getCurrentMealPeriod();
        const badges = {
            breakfast: { label: 'Breakfast', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
            lunch: { label: 'Lunch', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
            dinner: { label: 'Dinner', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
            closed: { label: 'Closed', color: 'bg-muted text-muted-foreground border-border' },
        };
        return badges[period] || badges.closed;
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    const mealBadge = getMealPeriodBadge();

    return (
        <div className="min-h-screen bg-background flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-72 bg-card border-r border-border/40
                transform transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 flex items-center justify-center">
                                <img src="/src/assets/logo-ai.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight">
                                DevFest <span className="text-primary">Eats</span>
                            </h1>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Current Period</span>
                                        <span className="text-xs font-bold">{mealBadge.label}</span>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full animate-pulse ${mealBadge.label === 'Closed' ? 'bg-muted-foreground' : 'bg-primary'}`} />
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                        <div className="px-4 py-2">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Main Menu</span>
                        </div>
                        {navigation.map((item) => {
                            const isActive = item.exact
                                ? location.pathname === item.href
                                : location.pathname.startsWith(item.href);

                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={`
                                        group flex items-center gap-3 px-4 py-3 rounded-xl
                                        transition-all duration-200
                                        ${isActive
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-semibold'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }
                                    `}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    <span className="text-sm">{item.name}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-border/40">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-semibold">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Bar */}
                <header className="h-20 glass border-b border-border/40 px-6 lg:px-10 flex items-center justify-between flex-shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-muted text-foreground"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-bold tracking-tight items-center flex gap-2">
                                {navigation.find(item =>
                                    item.exact
                                        ? location.pathname === item.href
                                        : location.pathname.startsWith(item.href)
                                )?.name || 'Dashboard'}
                            </h2>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Workspace • Admin</span>
                        </div>
                    </div>

                    <div className="flex-1" />

                    <div className="flex items-center gap-3 lg:gap-6">
                        <div className="h-8 w-px bg-border/60 mx-1" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold leading-none">Ali</p>
                                <p className="text-[10px] font-bold text-primary uppercase mt-1">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 p-1">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Ali`}
                                    alt="User"
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-background/50 custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

