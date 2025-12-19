/**
 * TypeScript Type Definitions for Admin API
 * 
 * All API responses follow the structure: { success: boolean, data: T | null, message?: string }
 * Field names use snake_case to match the backend API
 */

// ============================================
// Base Response Wrapper
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message?: string;
}

// ============================================
// Common Types
// ============================================

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';
export type DietaryType = 'none' | 'vegetarian' | 'vegan' | 'halal' | 'kosher';

// ============================================
// Ingredient & Nutrition Types
// ============================================

export interface NutritionalInfo {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
}

export interface Ingredient {
    ingredient_id: string;
    name: string;
    category: string;
    unit: string;
    allergens?: string[];
    nutritional_info?: NutritionalInfo;
}

// ============================================
// Stock Management Types
// ============================================

export interface StockItem {
    stock_id: string;
    ingredient_id: string;
    available_quantity: number;
    last_updated: string;
    ingredient: Ingredient;
}

export interface StockUpdateRequest {
    ingredient_id: string;
    available_quantity: number;
}

export interface StockUpdateResponse {
    stock_id: string;
    ingredient_id: string;
    available_quantity: number;
    last_updated: string;
}

// Response types
export type StockResponse = ApiResponse<StockItem[]>;
export type StockUpdateResponseType = ApiResponse<StockUpdateResponse>;

// ============================================
// Meal Types
// ============================================

export interface NutritionFacts {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
    tags: string[];
}

export interface Meal {
    meal_id: string;
    name: string;
    description?: string;
    nutrition_facts: NutritionFacts;
    category?: string;
}

export interface MealIngredient {
    quantity: number;
    ingredients: Ingredient;
}

export interface MealWithIngredients extends Meal {
    meal_type: MealType;
    meal_ingredients: MealIngredient[];
}

// ============================================
// Schedule Types
// ============================================

export interface MealInPlan {
    meal: Meal;
}

export interface DailyMenuPlan {
    plan_id: string;
    date: string;
    meal_type: MealType;
    distribution_stats: Record<string, unknown>;
    is_active: boolean;
    generated_at: string;
    meals: MealInPlan[];
}

export interface ScheduleParams {
    date?: string;
    meal_type?: MealType;
}

export interface Student {
    student_id: string;
    name: string;
    email: string;
}

export interface StudentProfile {
    allergies: string[];
    preferences: string[];
    dietary_type: DietaryType;
    sport_activities: string[];
}

export interface MealAssignment {
    assignment_id: string;
    date: string;
    meal_type: MealType;
    pickup_time_start: string;
    pickup_time_end: string;
    picked_up: boolean;
    student: Student;
    meal: Meal;
}

export interface StudentWithProfile extends Student {
    profiles: StudentProfile[];
    meal_assignments: Omit<MealAssignment, 'student'>[];
    // Optional fields to support mock backend
    id?: string;
    dietaryPreferences?: string[];
    assignedMeals?: any;
    sportActivities?: string[];
}

// Response types
export type ScheduleResponse = ApiResponse<DailyMenuPlan[]>;
export type TodayScheduleResponse = ApiResponse<MealAssignment[]>;
export type MenuResponse = ApiResponse<MealWithIngredients[]>;

// ============================================
// Student Management Types
// ============================================

export type StudentsWithAssignmentsResponse = ApiResponse<StudentWithProfile[]>;

// ============================================
// Analytics Types
// ============================================

export interface TrendInfo {
    value: string;
    isPositive: boolean;
}

export interface MealDistributionItem {
    meal: string;
    count: number;
    capacity: number;
}

export interface StockOverviewItem {
    name: string;
    value: number;
    color: string;
}

export interface AnalyticsData {
    totalStudents: number;
    todayMeals: number;
    todayPickups: number;
    pickupRate: number;
    weeklyCommitments: number;
    lowStockItemsCount: number;
    lowStockItems: StockItem[];
    mealDistribution?: MealDistributionItem[];
    stockOverview?: StockOverviewItem[];
    weeklyTrends?: any[];
    trends?: {
        activeAttendees?: TrendInfo;
        mealsAssigned?: TrendInfo;
        todayPickups?: TrendInfo;
    };
    efficiencyTrend?: { v: number }[];
}

export interface TimeslotDistribution {
    timeslot: string;
    meal_type: MealType;
    pickup_time_start: string;
    pickup_time_end: string;
    count: number;
}

// Response types
export type AnalyticsResponse = ApiResponse<AnalyticsData>;
export type TimeslotDistributionResponse = ApiResponse<TimeslotDistribution[]>;

// ============================================
// AI Meal Planning Types
// ============================================

export interface GeneratePlanRequest {
    date: string;
    mealType?: MealType;
}

export interface GeneratePlanData {
    plan_id: string;
    date: string;
    meals: Meal[];
}

export interface ProcessDailyRequest {
    date?: string;
}

export interface ProcessDailyData {
    date: string;
}

// Response types
export type GeneratePlanResponse = ApiResponse<GeneratePlanData>;
export type ProcessDailyResponse = ApiResponse<ProcessDailyData>;

export interface AILaunchData {
    processed: number;
    timestamp: string;
    status: string;
}

export type AILaunchResponse = ApiResponse<AILaunchData>;
