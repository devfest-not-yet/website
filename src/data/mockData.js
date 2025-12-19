// Mock Data for University Meal Management System
// TODO: Replace these with actual API calls to your backend

// Helper function to get current meal period based on time
export const getCurrentMealPeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 21) return 'dinner';
    return 'closed';
};

// Dashboard Metrics
// TODO: Replace with GET /api/dashboard/metrics
export const dashboardMetrics = {
    totalMealsToday: 1250,
    activeStudents: 3450,
    lowStockAlerts: 5,
    mealPeriod: getCurrentMealPeriod(),
    lastUpdated: new Date().toISOString(),
};

// Daily Meal Distribution (for bar chart)
// TODO: Replace with GET /api/dashboard/meal-distribution
export const dailyMealDistribution = [
    { meal: 'Breakfast', count: 420, capacity: 500 },
    { meal: 'Lunch', count: 550, capacity: 600 },
    { meal: 'Dinner', count: 280, capacity: 500 },
];

// Stock Levels Overview (for pie chart)
// TODO: Replace with GET /api/dashboard/stock-overview
export const stockLevelsOverview = [
    { name: 'In Stock', value: 45, color: '#10b981' },
    { name: 'Low Stock', value: 5, color: '#f59e0b' },
    { name: 'Out of Stock', value: 2, color: '#ef4444' },
];

// Weekly Meal Trends (for line chart)
// TODO: Replace with GET /api/dashboard/weekly-trends
export const weeklyMealTrends = [
    { day: 'Mon', breakfast: 450, lunch: 580, dinner: 520 },
    { day: 'Tue', breakfast: 420, lunch: 550, dinner: 490 },
    { day: 'Wed', breakfast: 460, lunch: 600, dinner: 530 },
    { day: 'Thu', breakfast: 440, lunch: 570, dinner: 510 },
    { day: 'Fri', breakfast: 480, lunch: 620, dinner: 550 },
    { day: 'Sat', breakfast: 350, lunch: 450, dinner: 400 },
    { day: 'Sun', breakfast: 320, lunch: 420, dinner: 380 },
];

// ============================================
// STOCK MANAGEMENT DATA
// ============================================

// Inventory Items
// TODO: Replace with GET /api/stock/inventory
export const inventoryItems = [
    { id: 1, name: 'Rice', quantity: 250, unit: 'kg', status: 'in-stock', threshold: 100 },
    { id: 2, name: 'Chicken Breast', quantity: 45, unit: 'kg', status: 'low-stock', threshold: 50 },
    { id: 3, name: 'Tomatoes', quantity: 80, unit: 'kg', status: 'in-stock', threshold: 30 },
    { id: 4, name: 'Onions', quantity: 65, unit: 'kg', status: 'in-stock', threshold: 40 },
    { id: 5, name: 'Potatoes', quantity: 120, unit: 'kg', status: 'in-stock', threshold: 60 },
    { id: 6, name: 'Cooking Oil', quantity: 15, unit: 'liters', status: 'low-stock', threshold: 20 },
    { id: 7, name: 'Flour', quantity: 90, unit: 'kg', status: 'in-stock', threshold: 50 },
    { id: 8, name: 'Milk', quantity: 8, unit: 'liters', status: 'low-stock', threshold: 25 },
    { id: 9, name: 'Eggs', quantity: 300, unit: 'pieces', status: 'in-stock', threshold: 200 },
    { id: 10, name: 'Carrots', quantity: 55, unit: 'kg', status: 'in-stock', threshold: 25 },
    { id: 11, name: 'Beans', quantity: 35, unit: 'kg', status: 'in-stock', threshold: 30 },
    { id: 12, name: 'Beef', quantity: 22, unit: 'kg', status: 'low-stock', threshold: 30 },
    { id: 13, name: 'Pasta', quantity: 75, unit: 'kg', status: 'in-stock', threshold: 40 },
    { id: 14, name: 'Salt', quantity: 45, unit: 'kg', status: 'in-stock', threshold: 20 },
    { id: 15, name: 'Sugar', quantity: 12, unit: 'kg', status: 'low-stock', threshold: 25 },
];

// Stock Levels for Chart
// TODO: Replace with GET /api/stock/levels
export const stockLevelsChart = inventoryItems.map(item => ({
    name: item.name,
    quantity: item.quantity,
    threshold: item.threshold,
}));

// ============================================
// COOKING SCHEDULE DATA
// ============================================

// Today's Cooking Schedule
// TODO: Replace with GET /api/schedule/today
export const cookingSchedule = [
    {
        id: 1,
        mealName: 'Continental Breakfast',
        mealType: 'breakfast',
        startTime: '06:00',
        endTime: '09:00',
        quantity: 500,
        assignedStaff: 'Chef Ahmed, Cook Maria',
        status: 'completed',
    },
    {
        id: 2,
        mealName: 'Chicken Biryani with Raita',
        mealType: 'lunch',
        startTime: '10:30',
        endTime: '13:30',
        quantity: 600,
        assignedStaff: 'Chef Fatima, Cook John, Helper Sarah',
        status: 'in-progress',
    },
    {
        id: 3,
        mealName: 'Grilled Fish with Vegetables',
        mealType: 'dinner',
        startTime: '15:00',
        endTime: '18:00',
        quantity: 500,
        assignedStaff: 'Chef Ahmed, Cook David',
        status: 'pending',
    },
];

// Preparation Time Chart Data
// TODO: Replace with GET /api/schedule/preparation-times
export const preparationTimes = cookingSchedule.map(meal => ({
    meal: meal.mealName.substring(0, 20) + '...',
    duration: calculateDuration(meal.startTime, meal.endTime),
    mealType: meal.mealType,
}));

function calculateDuration(start, end) {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
}

// ============================================
// MENU PLANNER DATA
// ============================================

// Daily Menu
// TODO: Replace with GET /api/menu/daily
export const dailyMenu = [
    {
        id: 1,
        mealType: 'breakfast',
        mealName: 'Continental Breakfast',
        description: 'Eggs, toast, fresh fruits, juice, and coffee',
        ingredients: ['Eggs (100 pcs)', 'Bread (50 loaves)', 'Bananas (80 pcs)', 'Orange Juice (20L)', 'Coffee (5kg)'],
        nutrition: {
            calories: 450,
            protein: 18,
            carbs: 55,
            fats: 15,
            fiber: 8,
        },
    },
    {
        id: 2,
        mealType: 'lunch',
        mealName: 'Chicken Biryani with Raita',
        description: 'Aromatic basmati rice with spiced chicken, served with cucumber raita',
        ingredients: ['Basmati Rice (80kg)', 'Chicken (45kg)', 'Yogurt (25L)', 'Cucumber (15kg)', 'Spices Mix (3kg)'],
        nutrition: {
            calories: 680,
            protein: 32,
            carbs: 85,
            fats: 22,
            fiber: 5,
        },
    },
    {
        id: 3,
        mealType: 'dinner',
        mealName: 'Grilled Fish with Vegetables',
        description: 'Fresh grilled salmon with steamed vegetables and lemon butter sauce',
        ingredients: ['Salmon Fillet (40kg)', 'Mixed Vegetables (60kg)', 'Butter (8kg)', 'Lemons (50 pcs)', 'Herbs (2kg)'],
        nutrition: {
            calories: 520,
            protein: 42,
            carbs: 35,
            fats: 24,
            fiber: 12,
        },
    },
];

// Nutritional Distribution (aggregate for pie chart)
// TODO: Replace with GET /api/menu/nutrition-overview
export const nutritionalDistribution = [
    { name: 'Protein', value: 30, color: '#ef4444' },
    { name: 'Carbohydrates', value: 45, color: '#3b82f6' },
    { name: 'Fats', value: 20, color: '#f59e0b' },
    { name: 'Fiber', value: 5, color: '#10b981' },
];

// ============================================
// MEAL DISTRIBUTION DATA
// ============================================

// Pickup Timeslots
// TODO: Replace with GET /api/distribution/timeslots
export const pickupTimeslots = [
    { id: 1, timeSlot: '07:00 - 08:00', mealType: 'Breakfast', studentCount: 250, status: 'completed' },
    { id: 2, timeSlot: '08:00 - 09:00', mealType: 'Breakfast', studentCount: 180, status: 'completed' },
    { id: 3, timeSlot: '09:00 - 10:00', mealType: 'Breakfast', studentCount: 90, status: 'completed' },
    { id: 4, timeSlot: '12:00 - 13:00', mealType: 'Lunch', studentCount: 320, status: 'in-progress' },
    { id: 5, timeSlot: '13:00 - 14:00', mealType: 'Lunch', studentCount: 230, status: 'pending' },
    { id: 6, timeSlot: '14:00 - 15:00', mealType: 'Lunch', studentCount: 100, status: 'pending' },
    { id: 7, timeSlot: '18:00 - 19:00', mealType: 'Dinner', studentCount: 280, status: 'pending' },
    { id: 8, timeSlot: '19:00 - 20:00', mealType: 'Dinner', studentCount: 150, status: 'pending' },
    { id: 9, timeSlot: '20:00 - 21:00', mealType: 'Dinner', studentCount: 70, status: 'pending' },
];

// Distribution Chart Data
// TODO: Replace with GET /api/distribution/hourly
export const distributionChartData = [
    { time: '07:00', count: 250, waitTime: 5 },
    { time: '08:00', count: 180, waitTime: 12 },
    { time: '09:00', count: 90, waitTime: 3 },
    { time: '12:00', count: 320, waitTime: 15 },
    { time: '13:00', count: 230, waitTime: 8 },
    { time: '14:00', count: 100, waitTime: 2 },
    { time: '18:00', count: 280, waitTime: 10 },
    { time: '19:00', count: 150, waitTime: 6 },
    { time: '20:00', count: 70, waitTime: 1 },
];
