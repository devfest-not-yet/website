/**
 * Authentication Service
 * Mock implementation for development - replace with real API calls later
 */

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock login API call
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const loginAPI = async (email, password) => {
    await delay(1000); // Simulate network delay

    // Mock validation
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    // Mock successful login (accept any credentials for now)
    const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0],
        email: email,
    };

    const mockToken = `mock_token_${Date.now()}`;

    return {
        user: mockUser,
        token: mockToken,
    };
};

/**
 * Mock signup API call
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data and token
 */
export const signupAPI = async (userData) => {
    await delay(1000); // Simulate network delay

    const { name, email, password } = userData;

    // Mock validation
    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }

    // Mock successful signup
    const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
    };

    const mockToken = `mock_token_${Date.now()}`;

    return {
        user: mockUser,
        token: mockToken,
    };
};

/**
 * Mock logout API call
 * @returns {Promise<void>}
 */
export const logoutAPI = async () => {
    await delay(300);
    // In real implementation, you might want to invalidate the token on the server
    return Promise.resolve();
};

/**
 * Get current user from token
 * @param {string} token - Auth token
 * @returns {Promise<Object|null>} User data or null
 */
export const getCurrentUserAPI = async (token) => {
    await delay(500);

    if (!token) {
        return null;
    }

    // Mock: decode token and return user
    // In real app, you'd validate the token with the server
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedUser) {
        return JSON.parse(storedUser);
    }

    return null;
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
