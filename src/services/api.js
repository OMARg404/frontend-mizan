import axios from 'axios';

// Define the base URL for the backend
const baseUrl = 'http://localhost:8000/api/v1';

// Helper function to add authorization headers
const authHeaders = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

// Admin API Endpoints
export const createAdmin = async(adminData) => {
    try {
        const response = await axios.post(`${baseUrl}/admin/create`, adminData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Create admin failed');
    }
};

export const loginAdmin = async(email, password) => {
    try {
        const response = await axios.post(`${baseUrl}/admin/login`, { email, password });
        return {
            token: response.data.token,
            user: {
                ...response.data.user,
                isAdmin: true, // تحديد أن المستخدم هو أدمن
            },
        };
    } catch (error) {
        throw error.response ? error.response.data : new Error('Login failed');
    }
};

export const getAllAdmins = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/admin/admins`, authHeaders(token));
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Failed to fetch admins');
    }
};

// User API Endpoints
export const createUser = async(userData, token) => {
    try {
        const response = await axios.post(`${baseUrl}/users`, userData, authHeaders(token));
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Create user failed');
    }
};

export const getAllUsers = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/users`, authHeaders(token));
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Failed to fetch users');
    }
};

export const loginUser = async(email, password) => {
    try {
        const response = await axios.post(`${baseUrl}/users/login`, { email, password });
        return {
            token: response.data.token,
            user: {
                ...response.data.user,
                isAdmin: false, // تحديد أن المستخدم ليس أدمن
            },
        };
    } catch (error) {
        throw error.response ? error.response.data : new Error('Login failed');
    }
};

// Administrative Units API Endpoints
export const getAllAdministrativeUnits = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/administrative-units`, authHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error.response ? error.response.data : new Error('Failed to fetch administrative units');
    }
};

export const createAdministrativeUnit = async(unitData, token) => {
    try {
        const response = await axios.post(`${baseUrl}/administrative-units`, unitData, authHeaders(token));
        return response.data; // Assuming no response body is returned on success
    } catch (error) {
        console.error('Error creating administrative unit:', error);
        throw error.response ? error.response.data : new Error('Failed to create administrative unit');
    }
};

export const updateAdministrativeUnit = async(unitId, updateData, token) => {
    try {
        const response = await axios.put(`${baseUrl}/administrative-units/${unitId}`, updateData, authHeaders(token));
        return response.data; // Assuming no response body is returned on success
    } catch (error) {
        console.error('Error updating administrative unit:', error);
        throw error.response ? error.response.data : new Error('Failed to update administrative unit');
    }
};

export const deleteAdministrativeUnit = async(unitId, token) => {
    try {
        const response = await axios.delete(`${baseUrl}/administrative-units/${unitId}`, authHeaders(token));
        return response.data; // Assuming no response body is returned on success
    } catch (error) {
        console.error('Error deleting administrative unit:', error);
        throw error.response ? error.response.data : new Error('Failed to delete administrative unit');
    }
};

export const getAdministrativeUnitById = async(unitId, token) => {
    try {
        const response = await axios.get(`${baseUrl}/administrative-units/${unitId}`, authHeaders(token));
        return response.data; // Assuming no response body is returned on success
    } catch (error) {
        console.error('Error fetching administrative unit:', error);
        throw error.response ? error.response.data : new Error('Failed to fetch administrative unit');
    }
};

// Budgets API Endpoints
export const updateBudgetAllocated = async(unitId, spentAmount, token) => {
    try {
        const response = await axios.post(
            `${baseUrl}/budgets/update-allocated`, { unitId, spentAmount },
            authHeaders(token)
        );
        return response.data;
    } catch (error) {
        console.error('Error updating budget allocated:', error);
        throw error.response ? error.response.data : new Error('Failed to update budget allocated');
    }
};

// New function to create/update the central budget
export const createCentralBudget = async(totalAmount, token) => {
    try {
        const response = await axios.post(
            `${baseUrl}/budgets/central`, { totalAmount },
            authHeaders(token)
        );
        return response.data;
    } catch (error) {
        console.error('Error creating central budget:', error);
        throw error.response ? error.response.data : new Error('Failed to create central budget');
    }
};

// Expenses API Endpoints
export const addExpense = async(expenseData, token) => {
    try {
        const response = await axios.post(`${baseUrl}/expenses/add`, expenseData, authHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error adding expense:', error);
        throw error.response ? error.response.data : new Error('Failed to add expense');
    }
};


// In api.js or wherever your functions are defined
export const getAllExpenses = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/expenses`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token for authorization
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        throw error; // Rethrow to handle it in the calling component
    }
};


export const deleteExpense = async(expenseId, token) => {
    try {
        const response = await axios.delete(`${baseUrl}/expenses/${expenseId}`, authHeaders(token));
        return response.data; // Assuming no response body is returned on success
    } catch (error) {
        console.error('Error deleting expense:', error);
        throw error.response ? error.response.data : new Error('Failed to delete expense');
    }
};

export const deleteBudget = async(budgetId, token) => {
    try {
        const response = await axios.delete(`${baseUrl}/budgets/${budgetId}`, authHeaders(token));
        return response.data; // Assuming no response body is returned on success
    } catch (error) {
        console.error('Error deleting budget:', error);
        throw error.response ? error.response.data : new Error('Failed to delete budget');
    }
};