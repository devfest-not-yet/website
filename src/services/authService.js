/**
 * Authentication Service
 */

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

import apiClient from '@/api/client';

/**
 * Real login API call
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const loginAPI = async (email, password) => {
    try {
        const response = await apiClient.post('auth/admin/login', { email, password });
        const { success, data, message } = response.data;

        if (!success && response.status !== 200) {
            throw new Error(message || 'Login failed');
        }

        // Handle various backend response structures (student, user, or direct data)
        const userData = data.admin || data.student || data.user || (data.email ? data : null);
        const token = data.token || response.data.token;

        if (!token) {
            throw new Error('No authentication token received from server');
        }

        // Return user and token in expected format
        return {
            user: userData || { email, role: 'admin' }, // Fallback to basic info if missing
            token: token,
        };
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Login failed';
        throw new Error(message);
    }
};

/**
 * Real signup API call
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data and token
 */
export const signupAPI = async (userData) => {
    try {
        const response = await apiClient.post('auth/signup', userData);
        const { data } = response.data;

        return {
            user: data.user,
            token: data.token,
        };
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Signup failed';
        throw new Error(message);
    }
};

/**
 * Logout API call
 * @returns {Promise<void>}
 */
export const logoutAPI = async () => {
    try {
        await apiClient.post('auth/logout');
    } catch (error) {
        console.error('Logout failed:', error);
    }
    return Promise.resolve();
};

/**
 * Get current user from token (validation)
 * @param {string} token - Auth token
 * @returns {Promise<Object|null>} User data or null
 */
export const getCurrentUserAPI = async (token) => {
    if (!token) return null;

    try {
        // First check local storage for immediate UI update
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) return JSON.parse(storedUser);

        // Fetch fresh user data from server
        const response = await apiClient.get('auth/me');
        return response.data.data;
    } catch (error) {
        return null;
    }
};

/**
 * Store auth token in localStorage
 * @param {string} token - Auth token
 */
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
};

/**
 * Get auth token from localStorage
 * @returns {string|null} Auth token or null
 */
export const getAuthToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Store user data in localStorage
 * @param {Object} user - User data
 */
export const setAuthUser = (user) => {
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_KEY);
    }
};

/**
 * Get user data from localStorage
 * @returns {Object|null} User data or null
 */
export const getAuthUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

/**
 * Clear all auth data
 */
export const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

/**
 * API call wrapper with auth headers
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} API response
 */
export const apiCall = async (url, options = {}) => {
    const token = getAuthToken();

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
};
