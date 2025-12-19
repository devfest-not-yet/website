/**
 * Helper function to get current meal period based on time
 * @returns {string} - 'breakfast', 'lunch', 'dinner', or 'closed'
 */
export const getCurrentMealPeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 21) return 'dinner';
    return 'closed';
};
