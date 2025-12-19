import apiClient from './client';
import type {
    AnalyticsResponse,
    StockResponse,
    StockUpdateResponseType,
    ScheduleResponse,
    ScheduleParams,
    TodayScheduleResponse,
    MenuResponse,
    TimeslotDistributionResponse,
    StudentsWithAssignmentsResponse,
    GeneratePlanRequest,
    GeneratePlanResponse,
    ProcessDailyRequest,
    ProcessDailyResponse,
    AILaunchResponse,
} from './types';

/**
 * Admin API Service
 * 
 * Type-safe methods for all admin endpoints.
 * All responses follow the ApiResponse<T> structure.
 */
export const adminApi = {
    // ============================================
    // Analytics
    // ============================================

    getAnalytics: async (): Promise<AnalyticsResponse> => {
        const response = await apiClient.get<AnalyticsResponse>('admin/analytics');
        console.log(response.data);
        return response.data;
    },

    // ============================================
    // Stock Management
    // ============================================

    getStock: async (): Promise<StockResponse> => {
        const response = await apiClient.get<StockResponse>('admin/stock/list');
        return response.data;
    },

    getAllStock: async (): Promise<StockResponse> => {
        const response = await apiClient.get<StockResponse>('admin/stock');
        return response.data;
    },

    updateStock: async (ingredient_id: string, available_quantity: number): Promise<StockUpdateResponseType> => {
        const response = await apiClient.post<StockUpdateResponseType>('admin/stock', {
            ingredient_id,
            available_quantity,
        });
        return response.data;
    },

    // ============================================
    // Schedule & Menu
    // ============================================

    getSchedule: async (params?: ScheduleParams): Promise<ScheduleResponse> => {
        const response = await apiClient.get<ScheduleResponse>('admin/schedule', { params });
        return response.data;
    },

    getTodaySchedule: async (): Promise<TodayScheduleResponse> => {
        const response = await apiClient.get<TodayScheduleResponse>('admin/schedule/today');
        return response.data;
    },

    getMenu: async (): Promise<MenuResponse> => {
        const response = await apiClient.get<MenuResponse>('admin/menu/today');
        return response.data;
    },

    // ============================================
    // Distribution
    // ============================================

    getDistributionTimeslots: async (date?: string): Promise<TimeslotDistributionResponse> => {
        const params = date ? { date } : undefined;
        const response = await apiClient.get<TimeslotDistributionResponse>('admin/distribution/timeslots', { params });
        return response.data;
    },

    // ============================================
    // Students
    // ============================================

    getStudentDemands: async (date?: string): Promise<StudentsWithAssignmentsResponse> => {
        const params = date ? { date } : undefined;
        const response = await apiClient.get<StudentsWithAssignmentsResponse>('admin/students-with-assignments', { params });
        console.log("Student Demands Response:", response.data);
        return response.data;
    },

    // ============================================
    // AI Meal Planning
    // ============================================

    generateAIPlan: async (request: GeneratePlanRequest): Promise<GeneratePlanResponse> => {
        const response = await apiClient.post<GeneratePlanResponse>('admin/ai/generate-plan', request);
        return response.data;
    },

    triggerAI: async (request?: ProcessDailyRequest): Promise<ProcessDailyResponse> => {
        const response = await apiClient.post<ProcessDailyResponse>('admin/ai/process-daily', request || {});
        return response.data;
    },

    launchAIFlow: async (): Promise<AILaunchResponse> => {
        const response = await apiClient.post<AILaunchResponse>('admin/ai/launch');
        return response.data;
    },
};
