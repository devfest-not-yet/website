import React from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { UtensilsCrossed, Users, AlertTriangle, TrendingUp, Calendar, Zap, ArrowUpRight, ChefHat, CheckCircle2, Loader2 } from 'lucide-react';
import { useAnalytics, useDistributionTimeslots, useStock, useLaunchAI } from '@/hooks/useAdmin';
import type { AnalyticsData } from '@/api/types';
import MetricCard from '@/components/ui/MetricCard';
import { motion } from 'framer-motion';

const MealDashboard: React.FC = () => {
    const { data: analyticsResponse, isLoading: isAnalyticsLoading, error } = useAnalytics();
    const { data: distributionResponse, isLoading: isDistLoading } = useDistributionTimeslots();
    const { data: stockResponse, isLoading: isStockLoading } = useStock();
    const [launchSuccess, setLaunchSuccess] = React.useState(false);
    const { mutate: launchAI, isPending: isLaunchingAI } = useLaunchAI();

    // AI launch state logic (Restriction removed for demo)
    React.useEffect(() => {
        setLaunchSuccess(false);
    }, []);

    const handleLaunchAI = () => {
        launchAI(undefined, {
            onSuccess: () => {
                setLaunchSuccess(true);
                localStorage.setItem('lastAILaunch', Date.now().toString());
                // Reset after 5 seconds for demo purposes so it can be shown again
                setTimeout(() => setLaunchSuccess(false), 5000);
            }
        });
    };

    const isLoading = isAnalyticsLoading || isDistLoading || isStockLoading;

    const analytics: AnalyticsData | null = (analyticsResponse?.success && analyticsResponse.data) ? analyticsResponse.data : null;

    // =========================================================================
    // CRITICAL: RULES OF HOOKS
    // All hooks (useMemo, etc.) MUST be called before any conditional returns
    // (like the loading/error states below). Moving these below returns will
    // cause a React crash because the hook order changes between renders.
    // =========================================================================

    const mealDistribution = analytics?.mealDistribution || React.useMemo(() => {
        const dist = distributionResponse?.data || [];
        const breakfast = dist.filter(d => d.meal_type.toUpperCase() === 'BREAKFAST').reduce((sum, d) => sum + d.count, 0);
        const lunch = dist.filter(d => d.meal_type.toUpperCase() === 'LUNCH').reduce((sum, d) => sum + d.count, 0);
        const dinner = dist.filter(d => d.meal_type.toUpperCase() === 'DINNER').reduce((sum, d) => sum + d.count, 0);

        return [
            { meal: 'Breakfast', count: breakfast, capacity: 500 },
            { meal: 'Lunch', count: lunch, capacity: 600 },
            { meal: 'Dinner', count: dinner, capacity: 500 }
        ];
    }, [distributionResponse]);

    const stockOverview = analytics?.stockOverview || React.useMemo(() => {
        const stock = stockResponse?.data || [];
        if (stock.length === 0) return [
            { name: 'In Stock', value: 0, color: '#10b981' },
            { name: 'Low Stock', value: 0, color: '#f59e0b' },
            { name: 'Out of Stock', value: 0, color: '#ef4444' }
        ];

        const lowStock = stock.filter(s => s.available_quantity < 10 && s.available_quantity > 0).length;
        const outOfStock = stock.filter(s => s.available_quantity <= 0).length;
        const inStock = stock.length - lowStock - outOfStock;

        return [
            { name: 'In Stock', value: Math.round((inStock / stock.length) * 100), color: '#10b981' },
            { name: 'Low Stock', value: Math.round((lowStock / stock.length) * 100), color: '#f59e0b' },
            { name: 'Out of Stock', value: Math.round((outOfStock / stock.length) * 100), color: '#ef4444' }
        ];
    }, [stockResponse]);

    const weeklyTrends = analytics?.weeklyTrends || [
        { day: 'Mon', breakfast: 210, lunch: 450, dinner: 280 },
        { day: 'Tue', breakfast: 230, lunch: 480, dinner: 310 },
        { day: 'Wed', breakfast: 190, lunch: 420, dinner: 250 },
        { day: 'Thu', breakfast: 250, lunch: 510, dinner: 340 },
        { day: 'Fri', breakfast: 220, lunch: 470, dinner: 300 },
        { day: 'Sat', breakfast: 150, lunch: 300, dinner: 200 },
        { day: 'Sun', breakfast: 160, lunch: 320, dinner: 220 }
    ];

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
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLaunchAI}
                        disabled={isLaunchingAI || launchSuccess}
                        className={`
                            relative overflow-hidden px-6 py-2.5 rounded-xl font-bold text-sm
                            flex items-center gap-2 transition-all duration-300
                            ${isLaunchingAI
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : launchSuccess
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                                    : 'bg-gradient-to-r from-primary to-violet-600 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40'
                            }
                        `}
                    >
                        {isLaunchingAI ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Launching...</span>
                            </>
                        ) : launchSuccess ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>AI Launcher</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4 fill-current" />
                                <span>AI Launcher</span>
                            </>
                        )}

                        {/* Shimmer effect when not loading or successful */}
                        {!isLaunchingAI && !launchSuccess && (
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            />
                        )}
                    </motion.button>

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
                    title="Meals Assigned"
                    value={analytics?.todayMeals?.toLocaleString() || '0'}
                    icon={CheckCircle2}
                    trend={analytics?.trends?.mealsAssigned || { value: "AI Optimized", isPositive: true }}
                />
                <MetricCard
                    title="Today's Pickups"
                    value={analytics?.todayPickups?.toLocaleString() || '0'}
                    icon={Zap}
                    trend={analytics?.trends?.todayPickups || { value: "Live", isPositive: true }}
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
                                        data={stockOverview as any[]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stockOverview.map((_, index) => (
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
                                        <span className="text-sm font-medium text-muted-foreground">{item?.name}</span>
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
                        <h4 className="font-bold">Restock Priority</h4>
                    </div>
                    <div className="space-y-4 relative z-10">
                        {analytics?.lowStockItems && analytics.lowStockItems.length > 0 ? (
                            analytics.lowStockItems.slice(0, 3).map((item, i) => (
                                <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-foreground">{item.ingredient.name}</span>
                                        <span className="px-2 py-0.5 rounded-lg bg-destructive/10 text-[10px] font-bold text-destructive uppercase">Critical</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Inventory</p>
                                        <p className="text-xs font-bold text-destructive">{item.available_quantity} {item.ingredient.unit} left</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-2xl">
                                <CheckCircle2 size={32} className="text-success/20 mb-3" />
                                <p className="text-xs font-bold text-muted-foreground">All stock levels healthy</p>
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

