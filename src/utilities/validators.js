/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength and message
 */
export const validatePasswordStrength = (password) => {
    if (password.length < 6) {
        return {
            isValid: false,
            strength: "weak",
            message: "Password must be at least 6 characters long",
        };
    }

    if (password.length < 8) {
        return {
            isValid: true,
            strength: "medium",
            message: "Password strength: Medium",
        };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (strengthCount >= 3 && password.length >= 8) {
        return {
            isValid: true,
            strength: "strong",
            message: "Password strength: Strong",
        };
    }

    return {
        isValid: true,
        strength: "medium",
        message: "Password strength: Medium",
    };
};

/**
 * Validates if passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {boolean} True if passwords match
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword && password.length > 0;
};

/**
 * Validates required field
 * @param {string} value - Field value to validate
 * @returns {boolean} True if field has value
 */
export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};

/**
 * Gets validation error message for a field
 * @param {string} fieldName - Name of the field
 * @param {string} value - Field value
 * @param {Object} options - Additional validation options
 * @returns {string|null} Error message or null if valid
 */
export const getFieldError = (fieldName, value, options = {}) => {
    if (!validateRequired(value)) {
        return `${fieldName} is required`;
    }

    if (options.isEmail && !validateEmail(value)) {
        return "Please enter a valid email address";
    }

    if (options.isPassword) {
        const validation = validatePasswordStrength(value);
        if (!validation.isValid) {
            return validation.message;
        }
    }

    if (options.matchWith && !validatePasswordMatch(options.matchWith, value)) {
        return "Passwords do not match";
    }

    return null;
};
