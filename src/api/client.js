import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://backend-t08o.onrender.com/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent redirect loop if the 401 error is from the login request itself
        const isLoginRequest = originalRequest.url.includes('/auth/login');

        if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
            console.error('Unauthorized access - please check your token or role');
            // localStorage.removeItem('auth_token');
            // localStorage.removeItem('auth_user');

            // if (window.location.pathname !== '/login') {
            //     window.location.href = '/login';
            // }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
