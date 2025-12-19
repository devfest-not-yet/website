import React, { useState } from 'react';
import { Users, Search, Info, AlertCircle, ChefHat, Sparkles, Loader2 } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { motion, AnimatePresence } from 'framer-motion';

import { useStudentDemands } from '@/hooks/useAdmin';
import type { StudentWithProfile } from '@/api/types';

const StudentDemands: React.FC = () => {
    const { data: studentsResponse, isLoading } = useStudentDemands();
    const rawStudents: StudentWithProfile[] = (studentsResponse?.success && studentsResponse.data) ? studentsResponse.data : [];

    const students = React.useMemo(() => {
        // Log raw students to help debug property naming
        if (rawStudents.length > 0) {
            console.log("Mapping raw students. First student sample:", rawStudents[0]);
        }

        // The response might be a list of students OR a list of assignments
        // We aggregate by student ID to handle both cases elegantly
        const studentMap = new Map<string, any>();

        rawStudents.forEach((item: any) => {
            // Determine if 'item' is a student or an assignment containing a student
            const s = item.student || item;

            // Robust ID extraction
            const studentId = s.student_id || s.id || (item.student_id !== item.id ? item.student_id : null) || "ID-MISSING";

            if (!studentMap.has(studentId)) {
                const profile = (s.profiles && s.profiles[0]) || { dietary_type: 'none' };
                const studentName = s.name || s.full_name || s.display_name || s.email || "Unknown Student";

                // Dietary preferences from multiple possible fields
                const dietary = s.dietaryPreferences ||
                    (profile.dietary_type && profile.dietary_type !== 'none' ? [profile.dietary_type] : []) ||
                    [];

                studentMap.set(studentId, {
                    ...s,
                    id: studentId,
                    name: studentName,
                    dietaryPreferences: Array.isArray(dietary) ? dietary : [dietary],
                    isAthlete: (s.sportActivities?.length || 0) > 0 || (s.profiles?.[0]?.sport_activities?.length || 0) > 0,
                    assignedMeals: { breakfast: null, lunch: null, dinner: null }
                });
            }

            const studentEntry = studentMap.get(studentId);

            // If the item is an assignment, extract the meal info
            const mealType = item.meal_type?.toUpperCase();
            if (mealType && item.meal) {
                // Generate a more dynamic reason based on student context
                let reason = item.reason;
                if (!reason || reason === "AI Balanced Nutrition") {
                    const isAthlete = studentEntry.isAthlete;
                    const prefs = studentEntry.dietaryPreferences || [];

                    if (isAthlete) {
                        reason = mealType === 'BREAKFAST'
                            ? "High-protein fuel for peak performance and morning recovery."
                            : "Optimized macro-ratio for athletic endurance and muscle support.";
                    } else if (prefs.includes('vegan') || prefs.includes('vegetarian')) {
                        reason = "Plant-based nutrient density carefully balanced for energy.";
                    } else if (prefs.length > 0) {
                        reason = `Tailored for ${prefs[0]} requirements with optimal nutrient balance.`;
                    } else {
                        reason = "Scientifically balanced for sustained glucose levels and focus.";
                    }
                }

                const mealData = {
                    mealName: item.meal.name,
                    reason: reason
                };

                if (mealType === 'LUNCH') studentEntry.assignedMeals.lunch = mealData;
                if (mealType === 'DINNER') studentEntry.assignedMeals.dinner = mealData;
                if (mealType === 'BREAKFAST') studentEntry.assignedMeals.breakfast = mealData;
            } else if (item.assignedMeals) {
                // Support the mock format where assignments are already pre-mapped
                studentEntry.assignedMeals = { ...studentEntry.assignedMeals, ...item.assignedMeals };
            }
        });

        return Array.from(studentMap.values());
    }, [rawStudents]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

    const filteredStudents = students.filter(student =>
        student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.id?.toLowerCase().includes(searchTerm.toLowerCase())
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
            label: "Today's Assignments",
            render: (value) => (
                <div className="flex flex-wrap gap-2">
                    {value.breakfast && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 border border-orange-500/15">
                            <span className="text-[10px] font-black uppercase">B</span>
                            <span className="text-[11px] font-bold">{value.breakfast.mealName}</span>
                        </div>
                    )}
                    {value.lunch && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-success/10 text-success border border-success/15">
                            <span className="text-[10px] font-black uppercase">L</span>
                            <span className="text-[11px] font-bold">{value.lunch.mealName}</span>
                        </div>
                    )}
                    {value.dinner && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 border border-indigo-500/15">
                            <span className="text-[10px] font-black uppercase">D</span>
                            <span className="text-[11px] font-bold">{value.dinner.mealName}</span>
                        </div>
                    )}
                    {!value.breakfast && !value.lunch && !value.dinner && (
                        <span className="text-[11px] text-muted-foreground italic">No assignments</span>
                    )}
                </div>
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
                        <DataTable
                            columns={columns}
                            data={filteredStudents}
                            onRowClick={setSelectedStudent}
                            selectedRowId={selectedStudent?.id}
                        />
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
                                className="glass-card p-8 border-primary/20 bg-primary/5  top-24"
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
                                            AI Meal Assignments
                                        </h4>

                                        <div className="space-y-4">
                                            {selectedStudent.assignedMeals.breakfast && (
                                                <div className="p-4 rounded-2xl bg-white dark:bg-background border border-border/50 shadow-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-bold text-orange-500 uppercase">Breakfast</span>
                                                        <ChefHat size={14} className="text-primary" />
                                                    </div>
                                                    <h5 className="font-bold text-lg mb-0">{selectedStudent.assignedMeals.breakfast.mealName}</h5>
                                                </div>
                                            )}

                                            {selectedStudent.assignedMeals.lunch && (
                                                <div className="p-4 rounded-2xl bg-white dark:bg-background border border-border/50 shadow-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-bold text-success uppercase">Lunch</span>
                                                        <ChefHat size={14} className="text-primary" />
                                                    </div>
                                                    <h5 className="font-bold text-lg mb-0">{selectedStudent.assignedMeals.lunch.mealName}</h5>
                                                </div>
                                            )}

                                            {selectedStudent.assignedMeals.dinner && (
                                                <div className="p-4 rounded-2xl bg-white dark:bg-background border border-border/50 shadow-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-bold text-indigo-500 uppercase">Dinner</span>
                                                        <ChefHat size={14} className="text-primary" />
                                                    </div>
                                                    <h5 className="font-bold text-lg mb-0">{selectedStudent.assignedMeals.dinner.mealName}</h5>
                                                </div>
                                            )}

                                            {!selectedStudent.assignedMeals.breakfast &&
                                                !selectedStudent.assignedMeals.lunch &&
                                                !selectedStudent.assignedMeals.dinner && (
                                                    <div className="p-8 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center">
                                                        <AlertCircle size={24} className="text-muted-foreground mb-2" />
                                                        <p className="text-xs font-medium text-muted-foreground">No meals assigned for today yet.</p>
                                                    </div>
                                                )}
                                        </div>
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
