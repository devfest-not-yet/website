import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { useSchedule } from '@/hooks/useAdmin';
import {
    Loader2,
    ChefHat,
    Clock,
    Users,
    Timer,
    CheckCircle2,
    Play,
    TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';

const CookingSchedule = () => {
    const { data: scheduleResponse, isLoading, error } = useSchedule();
    const schedule = scheduleResponse?.data || [];

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading daily schedule...</p>
            </div>
        );
    }

    // Compute preparation times from schedule data
    const prepTimes = schedule.map(meal => ({
        meal: meal.mealName?.substring(0, 15) + '...' || 'Unknown',
        duration: 120, // Default 2 hours, can be computed from start/end time if available
        mealType: meal.mealType
    }));

    const columns = [
        {
            key: 'mealName',
            label: 'Meal Name',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ChefHat size={14} className="text-primary" />
                    </div>
                    <div>
                        <div className="font-bold">{value}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{row.mealType}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'startTime',
            label: 'Schedule Slot',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-2 font-bold text-muted-foreground">
                    <Clock size={14} />
                    <span>{value} - {row.endTime}</span>
                </div>
            ),
        },
        {
            key: 'quantity',
            label: 'Servings',
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

    const getMealTypeColor = (mealType) => {
        switch (mealType.toLowerCase()) {
            case 'breakfast': return '#f59e0b';
            case 'lunch': return '#6366f1';
            case 'dinner': return '#8b5cf6';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="space-y-6 pb-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cooking Schedule</h1>
                    <p className="text-muted-foreground font-medium mt-1">Real-time status of kitchen production and preparation times.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
                        <Timer className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-bold text-orange-500">Live Service</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Timeline Section - 7 columns */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="glass-card p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Clock size={20} className="text-muted-foreground" />
                                Production Pipeline
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {schedule.map((meal, index) => (
                                <motion.div
                                    key={meal.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative pl-8 border-l border-border/60 pb-4 last:pb-0"
                                >
                                    {/* Timeline Node */}
                                    <div
                                        className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full z-10 transition-transform group-hover:scale-150 duration-300"
                                        style={{ backgroundColor: getMealTypeColor(meal.mealType), boxShadow: `0 0 10px ${getMealTypeColor(meal.mealType)}40` }}
                                    />

                                    <div className="glass-card p-3 hover:shadow-premium transition-all duration-300 border-border/20 group-hover:border-primary/20 bg-muted/10 group-hover:bg-background">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-xl bg-muted/50 border border-border/50 min-w-[60px]">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{meal.startTime.split(' ')[1]}</span>
                                                    <span className="text-base font-bold">{meal.startTime.split(' ')[0]}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-foreground flex items-center gap-2">
                                                        {meal.mealName}
                                                        {meal.status === 'completed' && <CheckCircle2 size={14} className="text-success" />}
                                                        {meal.status === 'in-progress' && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{meal.mealType}</span>
                                                        <span className="w-1 h-1 rounded-full bg-border" />
                                                        <span className="text-xs font-medium text-muted-foreground">{meal.quantity} Servings</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                    <Users size={14} />
                                                    <span>{meal.assignedStaff}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <StatusBadge status={meal.status} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-4">
                        <h3 className="text-lg font-bold mb-4">Service Logistics</h3>
                        <DataTable columns={columns} data={schedule} />
                    </div>
                </div>

                {/* Insights Section - 5 columns */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="glass-card p-5 bg-primary text-white border-none shadow-premium relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Play size={20} fill="currentColor" />
                                Current Active Unit
                            </h3>
                            {schedule.find(m => m.status === 'in-progress') || schedule.find(m => m.status === 'pending') ? (
                                (() => {
                                    const activeMeal = schedule.find(m => m.status === 'in-progress') || schedule.find(m => m.status === 'pending');
                                    return (
                                        <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md mb-4">
                                            <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">
                                                {activeMeal.status === 'in-progress' ? 'In Production' : 'Up Next'}
                                            </p>
                                            <h4 className="text-xl font-bold mb-4">{activeMeal.mealName}</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: activeMeal.status === 'in-progress' ? "65%" : "0%" }}
                                                        className="h-full bg-white shadow-glow"
                                                    />
                                                </div>
                                                <span className="text-xs font-bold">{activeMeal.status === 'in-progress' ? '65%' : '0%'}</span>
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-sm font-bold text-white/60">No Active Production</p>
                                </div>
                            )}
                        </div>
                        <div className="absolute top-0 right-0 opacity-10 -mr-8 -mt-8 scale-150 rotate-12">
                            <ChefHat size={150} />
                        </div>
                    </div>

                    <div className="glass-card p-5">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Timer size={18} className="text-muted-foreground" />
                            Efficiency Analytics
                        </h3>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={prepTimes}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                    <XAxis dataKey="meal" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                    <Bar dataKey="duration" radius={[4, 4, 0, 0]} barSize={32}>
                                        {prepTimes.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getMealTypeColor(index === 0 ? 'breakfast' : index === 1 ? 'lunch' : 'dinner')} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {schedule.length > 0 && (
                            <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/10">
                                <div className="p-2 rounded-lg bg-success/10 text-success">
                                    <TrendingUp size={16} />
                                </div>
                                <p className="text-[10px] font-bold text-success capitalize">Preparation efficiency is being tracked based on current schedule.</p>
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default CookingSchedule;

