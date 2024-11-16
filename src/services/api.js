import axios from 'axios';

// Define the base URL for the backend
const baseUrl = 'http://localhost:3000/api/v1';

// Helper function to add authorization headers
const authHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    return { Authorization: `Bearer ${token}` };
};

export const createUser = async(userData) => {
    try {
        const response = await axios.post(`${baseUrl}/admin/create`, userData, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        console.error("Create user failed:", error);
        throw error.response ? error.response.data : new Error('Create user failed');
    }
};

export const loginUser = async(email, password) => {
    try {
        const response = await axios.post(`${baseUrl}/admin/login`, { email, password });
        if (response.data.token) {
            localStorage.setItem('jwtToken', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response || error);
        throw error.response ? error.response.data : new Error('Login failed');
    }
};

export const getBudgets = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/budget`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.msg === "success") {
            return response.data.Budgets;
        } else {
            throw new Error('Failed to fetch budgets');
        }
    } catch (error) {
        console.error("Error fetching budgets:", error);
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('jwtToken');
            throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
        } else {
            throw new Error(error.response ? error.response.data.message : 'Network error or other issue');
        }
    }
};

export const addBudget = async(budgetData) => {
    try {
        const response = await axios.post(`${baseUrl}/budget`, budgetData, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        console.error("Add budget failed:", error);
        throw error.response ? error.response.data : new Error('Add budget failed');
    }
};


export const updateUserBudget = async(budgetId, expenses) => {
    try {
        const response = await axios.post(`${baseUrl}/budget/admin/${budgetId}`, { expenses }, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        console.error("Update user budget failed:", error);
        throw error.response ? error.response.data : new Error('Update user budget failed');
    }
};

export const updateAdminBudget = async(budgetId, allocations) => {
    try {
        const response = await axios.post(`${baseUrl}/budget/${budgetId}`, { allocations }, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        console.error("Update admin budget failed:", error);
        throw error.response ? error.response.data : new Error('Update admin budget failed');
    }
};

// Modified getBudgets function to handle token retrieval from localStorage

// Credit API Endpoints
export const addCredit = async(creditData) => {
    try {
        const response = await axios.post(`${baseUrl}/credits`, creditData, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        console.error("Add credit failed:", error);
        throw error.response ? error.response.data : new Error('Add credit failed');
    }
};

export const getCredits = async() => {
    try {
        const response = await axios.get(`${baseUrl}/credits`, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        console.error("Get credits failed:", error);
        throw error.response ? error.response.data : new Error('Get credits failed');
    }
};

// Deleting an expense
export const deleteExpense = async(expenseId) => {
    try {
        const response = await axios.delete(`${baseUrl}/expenses/${expenseId}`, { headers: authHeaders() });
        return response.data;
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw new Error('Error deleting expense: ' + error.message);
    }
};

// Deleting a budget
export const deleteBudget = async(budgetId) => {
    try {
        const response = await axios.delete(`${baseUrl}/budgets/${budgetId}`, { headers: authHeaders() });
        return response;
    } catch (error) {
        console.error('Error deleting budget:', error);
        throw error;
    }
};