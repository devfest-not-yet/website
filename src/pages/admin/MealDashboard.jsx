import React from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { UtensilsCrossed, Users, AlertTriangle, TrendingUp, Calendar, Zap, ArrowUpRight, ChefHat, Package, Utensils, CheckCircle2, Loader2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAdmin';
import MetricCard from '@/components/ui/MetricCard';
import { motion } from 'framer-motion';

const MealDashboard = () => {
    const { data: analyticsResponse, isLoading, error } = useAnalytics();
    const analytics = analyticsResponse?.data;

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading real-time analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-lg font-bold">Failed to load analytics</h3>
                <p className="text-muted-foreground max-w-md">There was an error connecting to the backend API. Please make sure the server is running.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-6 py-2 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-transform"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    // Computed data from analytics response or fallback to empty arrays
    const mealDistribution = analytics?.mealDistribution || [
        { meal: 'Breakfast', count: 0, capacity: 500 },
        { meal: 'Lunch', count: 0, capacity: 600 },
        { meal: 'Dinner', count: 0, capacity: 500 }
    ];

    const stockOverview = analytics?.stockOverview || [
        { name: 'In Stock', value: 0, color: '#10b981' },
        { name: 'Low Stock', value: 0, color: '#f59e0b' },
        { name: 'Out of Stock', value: 0, color: '#ef4444' }
    ];

    const weeklyTrends = analytics?.weeklyTrends || [];

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-8 pb-10">
            {/* Header section with Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Morning, Ali! 👋</h1>
                    <p className="text-muted-foreground font-medium mt-1">Here's what's happening with the meal services today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Metrics Cards Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <MetricCard
                    title="Active Attendees"
                    value={analytics?.totalStudents?.toLocaleString() || '0'}
                    icon={Users}
                    trend={analytics?.trends?.activeAttendees}
                />
                <MetricCard
                    title="Today's Pickups"
                    value={analytics?.todayPickups?.toLocaleString() || '0'}
                    icon={Zap}
                    trend={analytics?.trends?.todayPickups || { value: "Live", isPositive: true }}
                />
                <MetricCard
                    title="Meals Assigned"
                    value={`${analytics?.todayMeals || 0} / ${analytics?.totalStudents || 0}`}
                    icon={CheckCircle2}
                    trend={analytics?.trends?.mealsAssigned || { value: "AI Optimized", isPositive: true }}
                />
                <motion.div
                    whileHover={{ y: -4 }}
                    className="glass-card p-6 bg-primary text-white border-transparent overflow-hidden relative group"
                >
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="p-3 rounded-2xl bg-white/20 w-fit mb-4">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Efficiency Rate</p>
                        <h3 className="text-3xl font-bold tracking-tight text-white">{(analytics?.pickupRate || 0).toFixed(1)}%</h3>
                        <div className="h-10 mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.efficiencyTrend || []}>
                                    <Area type="monotone" dataKey="v" stroke="#fff" strokeWidth={2} fillOpacity={0} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs font-bold text-white/90">
                            <ArrowUpRight className="w-4 h-4" />
                            Optimizing Preparation
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bento Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Production Hub - 8 columns */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Weekly Trends - Large Card */}
                    <div className="glass-card p-8 group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Consumption Trends</h3>
                                    <p className="text-xs text-muted-foreground font-medium">Weekly analysis of meal performance</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyTrends}>
                                    <defs>
                                        <linearGradient id="colorLunch" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="breakfast"
                                        stroke="#f59e0b"
                                        strokeWidth={3}
                                        fill="transparent"
                                        name="Breakfast"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="lunch"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorLunch)"
                                        name="Lunch"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="dinner"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        fill="transparent"
                                        name="Dinner"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>


                </div>

                {/* Side Insights Hub - 4 columns */}
                <div className="lg:col-span-4 space-y-6">


                    <div className="glass-card p-6 h-[100%]">
                        <h4 className="font-bold mb-6">Inventory Composition</h4>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stockOverview}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stockOverview.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 space-y-3">
                            {stockOverview.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-bold">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>

            {/* Secondary Row: Distribution Hub - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <UtensilsCrossed size={18} />
                        </div>
                        <h4 className="font-bold">Meal Load Balance</h4>
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mealDistribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                                <XAxis dataKey="meal" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                                <Bar dataKey="capacity" fill="#E2E8F0" radius={[6, 6, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-6 h-full overflow-hidden relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                            <ChefHat size={18} />
                        </div>
                        <h4 className="font-bold">AI Stock Insights</h4>
                    </div>
                    <div className="space-y-4 relative z-10">
                        {analytics?.lowStockItems?.length > 0 ? (
                            analytics.lowStockItems.slice(0, 3).map((item, i) => (
                                <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.name}</span>
                                        <span className="text-xs font-bold text-amber-600 px-2 py-0.5 bg-amber-500/10 rounded-full">Low Stock</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${(item.currentStock / 50) * 100}%` }} className="h-full bg-amber-500" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-emerald-500/5 rounded-2xl border border-dashed border-emerald-500/20">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-bold text-emerald-600">All stock levels are currently within safe thresholds.</p>
                            </div>
                        )}
                    </div>
                    <div className="absolute top-2 right-2 opacity-5 scale-150 pointer-events-none">
                        <Zap size={120} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealDashboard;

