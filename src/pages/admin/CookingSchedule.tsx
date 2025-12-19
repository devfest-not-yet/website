import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useSchedule } from '@/hooks/useAdmin';
import type { MealAssignment } from '@/api/types';
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

const CookingSchedule: React.FC = () => {
    const { data: scheduleResponse, isLoading } = useSchedule();
    const schedule: MealAssignment[] = (scheduleResponse?.success && scheduleResponse.data) ? scheduleResponse.data : [];

    const getMealTypeColor = (mealType: string): string => {
        switch (mealType.toLowerCase()) {
            case 'breakfast': return '#f59e0b';
            case 'lunch': return '#6366f1';
            case 'dinner': return '#8b5cf6';
            default: return '#94a3b8';
        }
    };

    const mealDistribution = React.useMemo(() => {
        const stats: Record<string, number> = {};
        schedule.forEach(item => {
            const type = item.meal_type.toLowerCase();
            stats[type] = (stats[type] || 0) + 1;
        });
        return Object.entries(stats).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            fill: getMealTypeColor(name)
        }));
    }, [schedule]);

    const totalMeals = schedule.length;
    const completedMeals = schedule.filter(m => m.picked_up).length;
    const completionRate = totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0;

    const columns = [
        {
            key: 'meal',
            label: 'Meal Name',
            sortable: true,
            render: (value: any) => (
                <div className="flex items-center gap-3 text-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ChefHat size={14} className="text-primary" />
                    </div>
                    <div>
                        <div className="font-bold">{value?.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-tight">{value?.category}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'pickup_time_start',
            label: 'Schedule Slot',
            sortable: true,
            render: (value: any, row: any) => (
                <div className="flex items-center gap-2 font-bold text-muted-foreground">
                    <Clock size={14} />
                    <span>{value} - {row.pickup_time_end}</span>
                </div>
            ),
        },
        {
            key: 'quantity',
            label: 'Servings',
            sortable: true,
            render: (value: any) => (
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
            render: (value: any, row: any) => <StatusBadge status={row.picked_up ? 'completed' : 'pending'} />,
        },
    ];

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading daily schedule...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6 text-foreground">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 italic">
                        Cooking Schedule
                        <div className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20">Active</div>
                    </h1>
                    <p className="text-muted-foreground font-medium">Real-time status of kitchen production and preparation times.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
                        <Timer className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-black text-orange-500 uppercase tracking-wider">Live Service</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Timeline Section - 7 columns */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="glass-card p-6 border-border/40">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <Clock size={20} className="text-primary" />
                                Production Pipeline
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Filters:</span>
                                <div className="flex gap-1">
                                    {['Breakfast', 'Lunch', 'Dinner'].map(t => (
                                        <div key={t} className="w-2 h-2 rounded-full" style={{ backgroundColor: getMealTypeColor(t) }} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {schedule.map((assignment, index) => (
                                <motion.div
                                    key={assignment.assignment_id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative pl-10 border-l-2 border-dashed border-border/40 pb-6 last:pb-0"
                                >
                                    {/* Timeline Node */}
                                    <div
                                        className="absolute left-[-11px] top-1 w-5 h-5 rounded-full z-10 p-1 bg-background border-2 transition-transform group-hover:scale-125 duration-300"
                                        style={{ borderColor: getMealTypeColor(assignment.meal_type) }}
                                    >
                                        <div className="w-full h-full rounded-full" style={{ backgroundColor: getMealTypeColor(assignment.meal_type) }} />
                                    </div>

                                    <div className="glass-card p-4 hover:shadow-premium transition-all duration-500 border-border/40 group-hover:border-primary/30 group-hover:transform group-hover:-translate-y-1 bg-white/50 dark:bg-muted/5">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-background border border-border/50 shadow-inner">
                                                    <span className="text-[9px] font-black text-muted-foreground uppercase opacity-60 tracking-tighter">Ready At</span>
                                                    <span className="text-lg font-black tracking-tighter text-primary">{assignment.pickup_time_start.split(':')[0]}:{assignment.pickup_time_start.split(':')[1]}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                                                        {assignment.meal.name}
                                                        {assignment.picked_up && <CheckCircle2 size={16} className="text-success" />}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md text-white uppercase tracking-widest shadow-sm" style={{ backgroundColor: getMealTypeColor(assignment.meal_type) }}>
                                                            {assignment.meal_type}
                                                        </span>
                                                        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                                            <Users size={12} /> {assignment.quantity} servings
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-border/20">
                                                <StatusBadge status={assignment.picked_up ? 'completed' : 'pending'} />
                                                {!assignment.picked_up && (
                                                    <button className="flex items-center justify-center p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90 shadow-sm">
                                                        <Play size={16} className="ml-0.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-0 overflow-hidden border-border/40 text-foreground">
                        <div className="p-6 border-b border-border/40 flex items-center justify-between">
                            <h3 className="text-xl font-bold">Service Logistics</h3>
                            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-muted border border-border uppercase tracking-widest text-muted-foreground">{schedule.length} Total Units</span>
                        </div>
                        <div className="p-2">
                            <DataTable columns={columns} data={schedule} />
                        </div>
                    </div>
                </div>

                {/* Insights Section - 5 columns */}
                <div className="lg:col-span-5 space-y-6">
                    <div className=" top-24 space-y-6">
                        <div className="glass-card p-6 bg-gradient-to-br from-primary via-primary/90 to-violet-600 text-white border-none shadow-premium relative overflow-hidden group min-h-[220px] flex flex-col justify-center">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tight">
                                    <div className="p-2 rounded-lg bg-white/20">
                                        <Play size={18} fill="currentColor" />
                                    </div>
                                    Active Production
                                </h3>
                                {(() => {
                                    const activeMeal = schedule.find(m => !m.picked_up);
                                    if (!activeMeal) return (
                                        <div className="p-8 text-center bg-white/10 rounded-2xl border border-dashed border-white/20">
                                            <p className="text-sm font-bold text-white/70">ALL SERVICE COMPLETE</p>
                                        </div>
                                    );
                                    return (
                                        <div className="space-y-6">
                                            <div>
                                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1 block">
                                                    Currently Preparing ({activeMeal.meal_type})
                                                </span>
                                                <h4 className="text-2xl font-black leading-tight drop-shadow-sm">{activeMeal.meal.name}</h4>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black text-white/80">PREP PROGRESS</span>
                                                    <span className="text-xs font-black">45%</span>
                                                </div>
                                                <div className="h-3 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/10">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "45%" }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <ChefHat size={220} />
                            </div>
                        </div>

                        <div className="glass-card p-6 border-border/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <TrendingUp size={18} />
                                </div>
                                Production Mix
                            </h3>

                            <div className="h-[240px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={mealDistribution}
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {mealDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '16px',
                                                border: 'none',
                                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                                                fontWeight: '700',
                                                fontSize: '12px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Total Units</span>
                                    <span className="text-4xl font-black text-foreground">{totalMeals}</span>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 gap-3">
                                {mealDistribution.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/20 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.fill }} />
                                            <span className="text-xs font-black text-foreground/80 group-hover:text-foreground">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-foreground">{item.value}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground">({Math.round((item.value / totalMeals) * 100)}%)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 rounded-2xl bg-success/5 border border-success/10 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center text-lg font-black">
                                    {completionRate}%
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-success uppercase tracking-widest">Service Efficiency</p>
                                    <p className="text-xs font-bold text-success/70 leading-tight mt-0.5">{completedMeals}/{totalMeals} sessions optimized and completed.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookingSchedule;
