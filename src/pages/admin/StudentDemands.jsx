import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Info, ChevronRight, CheckCircle2, AlertCircle, ChefHat, Sparkles, Loader2 } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDemands = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://backend-t08o.onrender.com/api';
                const response = await fetch(`${BASE_URL}/admin/students-with-assignments`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setStudents(data.data || []);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching students:', error);
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            key: 'name',
            label: 'Student',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {value.charAt(0)}
                    </div>
                    <div>
                        <div className="font-bold">{value}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{row.id}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'dietaryPreferences',
            label: 'Preferences',
            render: (value) => (
                <div className="flex gap-1 flex-wrap">
                    {value.map((pref, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold text-muted-foreground uppercase">
                            {pref}
                        </span>
                    ))}
                </div>
            )
        },
        {
            key: 'assignedMeals',
            label: 'Today\'s Assignment',
            render: (value) => (
                <div className="flex items-center gap-2">
                    {value.lunch ? (
                        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-success/10 text-success border border-success/20">
                            <CheckCircle2 size={12} />
                            <span className="text-xs font-bold">{value.lunch.mealName}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground italic">No lunch assigned</span>
                    )}
                </div>
            )
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                <button
                    onClick={() => setSelectedStudent(row)}
                    className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                >
                    <ChevronRight size={18} />
                </button>
            )
        }
    ];

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading student demands...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Demands</h1>
                    <p className="text-muted-foreground font-medium mt-1">AI-powered personalized meal assignments and reasons.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <div className="glass-card p-6">
                        <DataTable columns={columns} data={filteredStudents} />
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <AnimatePresence mode="wait">
                        {selectedStudent ? (
                            <motion.div
                                key={selectedStudent.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass-card p-8 border-primary/20 bg-primary/5 sticky top-24"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold">
                                            {selectedStudent.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                                            <p className="text-sm font-medium text-muted-foreground">{selectedStudent.id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        className="text-muted-foreground hover:text-foreground p-1"
                                    >
                                        &times;
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Info size={12} />
                                            Student Profile
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedStudent.isAthlete && (
                                                <span className="px-2 py-1 rounded-lg bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[10px] font-bold uppercase">Athlete</span>
                                            )}
                                            {selectedStudent.dietaryPreferences.map((p, i) => (
                                                <span key={i} className="px-2 py-1 rounded-lg bg-muted text-muted-foreground border border-border/50 text-[10px] font-bold uppercase">{p}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-border/50">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                            <Sparkles size={12} />
                                            AI Meal Assignment
                                        </h4>

                                        {selectedStudent.assignedMeals.lunch ? (
                                            <div className="space-y-4">
                                                <div className="p-4 rounded-2xl bg-white dark:bg-background border border-border/50 shadow-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-bold text-success uppercase">Lunch</span>
                                                        <ChefHat size={14} className="text-primary" />
                                                    </div>
                                                    <h5 className="font-bold text-lg mb-2">{selectedStudent.assignedMeals.lunch.mealName}</h5>
                                                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                                                        <p className="text-xs font-bold text-primary mb-1">Why this meal?</p>
                                                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                                                            "{selectedStudent.assignedMeals.lunch.reason}"
                                                        </p>
                                                    </div>
                                                </div>

                                                {selectedStudent.assignedMeals.dinner && (
                                                    <div className="p-4 rounded-2xl bg-white dark:bg-background border border-border/50 shadow-sm">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[10px] font-bold text-indigo-500 uppercase">Dinner</span>
                                                            <ChefHat size={14} className="text-primary" />
                                                        </div>
                                                        <h5 className="font-bold text-lg mb-2">{selectedStudent.assignedMeals.dinner.mealName}</h5>
                                                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                                                            <p className="text-xs font-bold text-primary mb-1">Why this meal?</p>
                                                            <p className="text-xs text-muted-foreground leading-relaxed italic">
                                                                "{selectedStudent.assignedMeals.dinner.reason}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-8 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center">
                                                <AlertCircle size={24} className="text-muted-foreground mb-2" />
                                                <p className="text-xs font-medium text-muted-foreground">No meals assigned for today yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="glass-card p-12 border-dashed border-border flex flex-col items-center justify-center text-center h-[400px]">
                                <Users size={40} className="text-muted-foreground mb-4 opacity-20" />
                                <h3 className="font-bold text-muted-foreground">Select a student</h3>
                                <p className="text-xs text-muted-foreground font-medium mt-1">Review their AI-recommended meal plan and justifications.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StudentDemands;
