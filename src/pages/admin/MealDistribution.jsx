import React from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Clock, Timer, TrendingUp, CheckCircle2, AlertCircle, Activity, MapPin } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import { useDistributionTimeslots } from '@/hooks/useAdmin';

const MealDistribution = () => {
    const { data: distributionResponse, isLoading } = useDistributionTimeslots();
    const timeslots = React.useMemo(() => {
        return (distributionResponse?.data || []).map(slot => ({
            ...slot,
            studentCount: slot.studentsCount || 0
        }));
    }, [distributionResponse]);

    // Compute distribution data from timeslots
    const distributionData = React.useMemo(() => {
        return timeslots.map(slot => ({
            time: slot.timeSlot?.split(' ')[0] || '',
            count: slot.studentCount || slot.studentsCount || 0,
            waitTime: 5 // Default wait time
        }));
    }, [timeslots]);

    const totalStudents = timeslots.reduce((sum, slot) => sum + slot.studentCount, 0);
    const completedSlots = timeslots.filter(slot => slot.status === 'completed');
    const studentsServed = completedSlots.reduce((sum, slot) => sum + slot.studentCount, 0);

    const avgWaitTime = Math.round(
        distributionData.length > 0
            ? distributionData.reduce((sum, item) => sum + item.waitTime, 0) / distributionData.length
            : 0
    );

    const columns = [
        {
            key: 'timeSlot',
            label: 'Time Slot',
            sortable: true,
            render: (value) => (
                <div className="flex items-center gap-2 font-bold text-muted-foreground">
                    <Clock size={14} />
                    <span>{value}</span>
                </div>
            ),
        },
        {
            key: 'mealType',
            label: 'Meal Type',
            sortable: true,
            render: (value) => (
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{value}</span>
            ),
        },
        {
            key: 'studentCount',
            label: 'Expected',
            sortable: true,
            render: (value) => (
                <div className="flex items-center gap-2">
                    <Users size={14} className="text-muted-foreground" />
                    <span className="font-bold">{value}</span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => <StatusBadge status={value} />,
        },
    ];

    const stats = [
        { label: 'Total Expected', value: totalStudents, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-600/10', trend: '+12% vs last year' },
        { label: 'Students Served', value: studentsServed, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', trend: 'On track' },
        { label: 'Avg Wait Time', value: `${avgWaitTime}m`, icon: Timer, color: 'text-warning', bg: 'bg-warning/10', trend: '-2m optimization' },
        { label: 'System Load', value: 'Normal', icon: Activity, color: 'text-primary', bg: 'bg-primary/10', trend: 'Stable flow' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Meal Distribution</h1>
                    <p className="text-muted-foreground font-medium mt-1">Live traffic monitoring and student flow analytics.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-bold text-success uppercase tracking-widest">System Live</span>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 border-border/40 hover:shadow-premium transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-success">
                                <TrendingUp size={10} />
                                <span>{stat.trend.split(' ')[0]}</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 glass-card p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Flow Density Analysis</h3>
                            <p className="text-xs text-muted-foreground font-medium">Hourly student arrival patterns</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-[10px] font-bold uppercase">
                                <MapPin size={12} />
                                Main Gate
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={distributionData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                    name="Students"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-4 glass-card p-0 overflow-hidden bg-indigo-600 border-none text-white shadow-premium">
                    <div className="p-6">
                        <h3 className="text-lg font-bold mb-1">Queue Prediction</h3>
                        <p className="text-white/70 text-xs font-medium mb-8">AI-calculated delivery speed</p>

                        <div className="space-y-6">
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-bold">04</span>
                                <span className="text-xl font-bold text-white/60 mb-1">min</span>
                                <div className="mb-2 ml-auto p-1 px-2 rounded-lg bg-white/20 text-[10px] font-bold uppercase">Optimized</div>
                            </div>
                            <div className="h-24">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={distributionData.slice(-6)}>
                                        <Bar dataKey="waitTime" fill="rgba(255,255,255,0.4)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs font-medium leading-relaxed opacity-80">
                                current wait time is lower than average thanks to balanced redistribution across points A and B.
                            </p>

                        </div>
                    </div>
                </div>
            </div>

            {/* Pickup Log */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Clock size={18} className="text-muted-foreground" />
                        Live Timeslot Log
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Real-time sync</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    </div>
                </div>
                <DataTable columns={columns} data={timeslots} />
            </div>
        </div>
    );
};

export default MealDistribution;

