import axios from 'axios';

// Define the base URL for the backend
const baseUrl = 'http://localhost:3000/api/v1';

// Helper function to add authorization headers


// User API Endpoints
export const createUser = async(userData) => {
    try {
        const response = await axios.post(`${baseUrl}/admin/create`, userData, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Create user failed');
    }
};

// Updated loginUser function to handle the correct response format

// Helper function to add authorization headers
const authHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    console.log('Token:', token); // Retrieve token from localStorage
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Updated loginUser function to handle the correct response format
export const loginUser = async(email, password) => {
    try {
        const response = await axios.post(`${baseUrl}/admin/login`, { email, password });

        // Debug: Log the response data to check what is returned from the backend
        console.log("Login response:", response.data);

        // Assuming the response contains msg, token, and user data
        const { msg, token, user } = response.data;

        if (msg === 'success' && token) {
            // Return the token and user data
            return { token, user };
        } else {
            throw new Error('Login failed: Token or user data missing');
        }
    } catch (error) {
        console.error("Login failed:", error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};


// Budget API Endpoints
export const addBudget = async(budgetData) => {
    try {
        const response = await axios.post(`${baseUrl}/budget`, budgetData, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Add budget failed');
    }
};

export const updateUserBudget = async(budgetId, expenses) => {
    try {
        const response = await axios.post(`${baseUrl}/budget/admin/${budgetId}`, { expenses }, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Update user budget failed');
    }
};

export const updateAdminBudget = async(budgetId, allocations) => {
    try {
        const response = await axios.post(`${baseUrl}/budget/${budgetId}`, { allocations }, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Update admin budget failed');
    }
};

// Modified getBudgets function to accept token
export const getBudgets = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/budget`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Get budgets failed');
    }
};


// Credit API Endpoints
export const addCredit = async(creditData) => {
    try {
        const response = await axios.post(`${baseUrl}/credits`, creditData, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Add credit failed');
    }
};

export const getCredits = async() => {
    try {
        const response = await axios.get(`${baseUrl}/credits`, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Get credits failed');
    }
};

export const deleteExpense = async(expenseId) => {
    try {
        const response = await axios.delete(`${baseUrl}/expenses/${expenseId}`, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        throw new Error('Error deleting expense: ' + error.message);
    }
};

export const deleteBudget = async(budgetId) => {
    try {
        const response = await axios.delete(`${baseUrl}/budgets/${budgetId}`, { headers: authHeaders() });
        return response;
    } catch (error) {
        console.error('Error deleting budget:', error);
        throw error;
    }
};