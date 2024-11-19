import axios from 'axios';

// Define the base URL for the backend
const baseUrl = 'http://localhost:3000/api/v1';

// Helper function to add authorization headers
// const authHeaders = (token) => {
//     if (!token) {
//         throw new Error('No token found. Please log in.');
//     }
//     return { Authorization: `Bearer ${token}` };
// };

// User API
export const createUser = async(userData, token) => {
    try {
        const response = await axios.post(`${baseUrl}/admin/create`, userData, { headers: { token } });
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
        console.error("Login user failed:", error);
        throw error.response ? error.response.data : new Error('Login user failed');
    }
};

export const getUsers = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/user`, {
            headers: { token }
        });
        return response.data;
    } catch (error) {
        console.error("Get users failed:", error);
        throw error.response ? error.response.data : new Error('Get users failed');
    }
};
// المفروض بالتوكن بس هجيب ال id منين
export const getUser = async(userId, token) => {
    try {
        const response = await axios.get(`${baseUrl}/user/${userId}`, { headers: { token } });
        return response.data;
    } catch (error) {
        console.error("Get user failed:", error);
        throw error.response ? error.response.data : new Error('Get user failed');
    }
};

export const updateUser = async(userId, userData, token) => {
    try {
        const response = await axios.put(`${baseUrl}/user/${userId}`, userData, { headers: { token } });
        return response.data;
    } catch (error) {
        console.error("Update user failed:", error);
        throw error.response ? error.response.data : new Error('Update user failed');
    }
};
// دي بتمسح اليوزر نفسه 
export const deleteUser = async(userId, token) => {
    try {
        const response = await axios.delete(`${baseUrl}/user/${userId}`, { headers: { token } });
        return response.data;
    } catch (error) {
        console.error("Delete user failed:", error);
        throw error.response ? error.response.data : new Error('Delete user failed');
    }
};

// Budget API

// In services/api.js or your relevant API service file
export const addBudget = async(budgetData, token) => {
    try {
        const response = await axios.post(`${baseUrl}/budget`, budgetData, {
            headers: { token },
        });
        return response.data;
    } catch (error) {
        console.error("Add budget failed:", error);
        throw error.response ? error.response.data : new Error('Add budget failed');
    }
};


export const updateUserBudget = async(budgetId, expenses, token) => {
    try {
        const response = await axios.post(`${baseUrl}/budget/admin/${budgetId}`, { expenses }, { headers: { token } });
        return response.data;
    } catch (error) {
        console.error("Update user budget failed:", error);
        throw error.response ? error.response.data : new Error('Update user budget failed');
    }
};

export const updateAdminBudget = async(budgetId, allocation, token) => {
    try {
        const response = await axios.put(
            `${baseUrl}/budget/admin/${budgetId}`, { allocation: allocation }, // Correct key name is `allocation`
            { headers: { token } }
        );
        return response.data;
    } catch (error) {
        console.error("Error details:", error.response || error);
        throw new Error(error.response ? error.response.data : 'Update failed');
    }
};

export const deleteBudget = async(budgetId, token) => {
    try {
        const response = await axios.delete(`${baseUrl}/budget/admin/${budgetId}`, { headers: { token } });
        return response.data;
    } catch (error) {
        console.error("Delete budget failed:", error);
        throw error.response ? error.response.data : new Error('Delete budget failed');
    }
};


export const getBudgets = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/budget`, { headers: { token } });
        return response.data;
    } catch (error) {
        console.error("Get budgets failed:", error);
        throw error.response ? error.response.data : new Error('Get budgets failed');
    }
};

// Credit API
export const getCredits = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/credits`, { headers: { token } });
        return response.data;
    } catch (error) {
        console.error("Get credits failed:", error);
        throw error.response ? error.response.data : new Error('Get credits failed');
    }
};

export const addCredit = async(creditData, token) => {
    try {
        const response = await axios.post(`${baseUrl}/credits`, creditData, {
            headers: {
                Authorization: `Bearer ${token}`, // Use Bearer token for authorization
                'Content-Type': 'application/json' // Ensure the content type is JSON
            }
        });
        return response.data;
    } catch (error) {
        console.error("Add credit failed:", error);
        // Throw a more detailed error message if available
        throw error.response ? error.response.data : new Error('Add credit failed');
    }
};

// Reports API مفهاش شهور اصلا
export const getMonthlyReports = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/monthly-report`, { headers: { token } });
        return response.data;
    } catch (error) {
        console.error("Get monthly reports failed:", error);
        throw error.response ? error.response.data : new Error('Get monthly reports failed');
    }
};