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

// Admin login
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

// Get all admins (using token from AuthContext)
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

// Get all users (using token from AuthContext)
export const getAllUsers = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/users`, authHeaders(token));
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Failed to fetch users');
    }
};

// User login
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
export const getAllAdministrativeUnits = async(token) => {
    try {
        const response = await axios.get(`${baseUrl}/administrative-units`, authHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error.response ? error.response.data : new Error('Failed to fetch administrative units');
    }
};

// Create a new administrative unit
export const createAdministrativeUnit = async(unitData, token) => {
    try {
        const response = await axios.post(`${baseUrl}/administrative-units`, unitData, authHeaders(token));
        return response.data; // Assuming no response body is returned on success
    } catch (error) {
        console.error('Error creating administrative unit:', error);
        throw error.response ? error.response.data : new Error('Failed to create administrative unit');
    }
};

// Update an existing administrative unit
export const updateAdministrativeUnit = async(unitId, updateData, token) => {
    try {
        const response = await axios.put(`${baseUrl}/administrative-units/${unitId}`, updateData, authHeaders(token));
        return response.data; // Assuming no response body is returned on success
    } catch (error) {
        console.error('Error updating administrative unit:', error);
        throw error.response ? error.response.data : new Error('Failed to update administrative unit');
    }
};

// Delete an administrative unit
export const deleteAdministrativeUnit = async(unitId, token) => {
    try {
        const response = await axios.delete(`${baseUrl}/administrative-units/${unitId}`, authHeaders(token));
        return response.data; // Assuming no response body is returned on success
    } catch (error) {
        console.error('Error deleting administrative unit:', error);
        throw error.response ? error.response.data : new Error('Failed to delete administrative unit');
    }
};

// Get an administrative unit by ID
export const getAdministrativeUnitById = async(unitId, token) => {
    try {
        const response = await axios.get(`${baseUrl}/administrative-units/${unitId}`, authHeaders(token));
        return response.data; // Assuming no response body is returned on success
    } catch (error) {
        console.error('Error fetching administrative unit:', error);
        throw error.response ? error.response.data : new Error('Failed to fetch administrative unit');
    }
};