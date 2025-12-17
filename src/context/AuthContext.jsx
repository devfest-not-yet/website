import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    loginAPI,
    signupAPI,
    logoutAPI,
    getCurrentUserAPI,
    setAuthToken,
    getAuthToken,
    setAuthUser,
    getAuthUser,
    clearAuthData,
} from "@/services/authService";

// Create AuthContext
const AuthContext = createContext(undefined);

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

/**
 * AuthProvider component
 * Manages authentication state and provides auth methods
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = getAuthToken();
                const storedUser = getAuthUser();

                if (token && storedUser) {
                    // Validate token with API (in real app)
                    const validatedUser = await getCurrentUserAPI(token);

                    if (validatedUser) {
                        setUser(validatedUser);
                        setIsAuthenticated(true);
                    } else {
                        // Token is invalid, clear auth data
                        clearAuthData();
                    }
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                clearAuthData();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    /**
     * Login function
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User data
     */
    const login = async (email, password) => {
        try {
            setError(null);
            setIsLoading(true);

            const { user: userData, token } = await loginAPI(email, password);

            // Store auth data
            setAuthToken(token);
            setAuthUser(userData);

            // Update state
            setUser(userData);
            setIsAuthenticated(true);

            return userData;
        } catch (error) {
            const errorMessage = error.message || "Login failed. Please try again.";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Signup function
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} User data
     */
    const signup = async (userData) => {
        try {
            setError(null);
            setIsLoading(true);

            const { user: newUser, token } = await signupAPI(userData);

            // Store auth data
            setAuthToken(token);
            setAuthUser(newUser);

            // Update state
            setUser(newUser);
            setIsAuthenticated(true);

            return newUser;
        } catch (error) {
            const errorMessage = error.message || "Signup failed. Please try again.";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Logout function
     */
    const logout = async () => {
        try {
            setIsLoading(true);

            // Call logout API
            await logoutAPI();

            // Clear auth data
            clearAuthData();

            // Update state
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
        } catch (error) {
            console.error("Logout error:", error);
            // Even if API fails, clear local state
            clearAuthData();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Clear error
     */
    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;
