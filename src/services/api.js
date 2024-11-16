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

// User API
export const createUser = async(userData, token) => {
    try {
        const response = await axios.post(`${baseUrl}/admin/create`, userData, { headers: token });
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

// Budget API
export const addBudget = async(budgetData, token) => {
    try {
        const response = await axios.post(`${baseUrl}/budget`, budgetData, { headers: { token } });
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

export const updateAdminBudget = async(budgetId, allocations, token) => {
    try {
        const response = await axios.put(`${baseUrl}/budget/${budgetId}`, { allocations }, { headers: { token } });
        return response.data;
    } catch (error) {
        console.error("Update admin budget failed:", error);
        throw error.response ? error.response.data : new Error('Update admin budget failed');
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
// function addToCart(token, product) {
//     return axios.post(${baseUrl}/cart, { product }, {
//         headers: { token }
//     }).then(data => data).catch(error => error)
// }
// Credit API
// Assuming baseUrl and authHeaders are imported as needed

export const getCredits = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/credits`, {
            headers: { token }
        });
        return response.data; // Return the data from the response
    } catch (error) {
        console.error("Get credits failed:", error);
        throw error.response ? error.response.data : new Error('Get credits failed');
    }
};

export const addCredit = async(creditData, token) => {
    try {
        const response = await axios.post(`${baseUrl}/credits`, creditData, {
                headers: { token }
            } // Ensure 'Authorization' header is correct
        );
        return response.data;
        // Return the data from the response
    } catch (error) {
        console.error("Add credit failed:", error);
        throw error.response ? error.response.data : new Error('Add credit failed');
    }
};