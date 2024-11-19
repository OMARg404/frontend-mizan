import React, { useState, useEffect, useContext } from 'react';
import { getUser, updateUserBudget } from '../../services/api'; // Import getUser and updateUserBudget
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import './Home.css';

const UpdateBudgetPage = () => {
    const { token, user } = useContext(AuthContext); // Access token and user from AuthContext
    const [userData, setUserData] = useState(null); // Store user data
    const [loading, setLoading] = useState(true); // Loading state for data fetching
    const [error, setError] = useState(null); // Error state for handling errors
    const [expenses, setExpenses] = useState(''); // State to hold the updated expenses
    const [selectedBudgetId, setSelectedBudgetId] = useState(''); // State to hold the selected budget ID

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?._id) {
                setError('User ID is missing');
                setLoading(false);
                return;
            }

            try {
                const data = await getUser(user._id, token); // Fetch user data from API using userId and token
                setUserData(data.user); // Store user data in state
            } catch (err) {
                setError('Failed to fetch user data'); // Handle error
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUserData(); // Call the function to fetch data
    }, [user?._id, token]); // Re-run when userId or token changes

    const handleExpensesChange = (e) => {
        setExpenses(e.target.value); // Update expenses state when input changes
    };

    const handleBudgetSelect = (e) => {
        setSelectedBudgetId(e.target.value); // Update selected budget ID
    };

    const handleUpdateExpenses = async () => {
        if (!selectedBudgetId) {
            setError('Please select a budget to update');
            return;
        }

        if (!expenses) {
            setError('Expenses cannot be empty');
            return;
        }

        const updatedData = { expenses: parseFloat(expenses) }; // Ensure expenses is a number

        try {
            await updateUserBudget(selectedBudgetId, updatedData, token); // Update budget via API
            const updatedBudgets = userData.budgets.map((budget) =>
                budget._id === selectedBudgetId ? { ...budget, expenses: updatedData.expenses } : budget
            );
            setUserData({ ...userData, budgets: updatedBudgets }); // Update local state with the updated budget
            setError(null); // Clear any previous errors
            alert('Expenses updated successfully!');
        } catch (err) {
            setError('Failed to update expenses'); // Handle error
        }
    };

    if (loading) return <div>Loading...</div>; // Show loading state
    if (error) return <div>{error}</div>; // Show error message

    return (
        <div className='update-budget-page'>
            <h1>Update Budgets</h1>
            <h2>{userData?.name}'s Budgets</h2>
            {userData?.budgets && userData.budgets.length > 0 ? (
                <div>
                    <select onChange={handleBudgetSelect}>
                        <option value="">Select a Budget</option>
                        {userData.budgets.map((budget) => (
                            <option key={budget._id} value={budget._id}>
                                {budget.budgetId} - {budget.permission}
                            </option>
                        ))}
                    </select>
                    <div>
                        <h3>Update Expenses</h3>
                        <input
                            type="number"
                            value={expenses}
                            onChange={handleExpensesChange}
                            placeholder="Enter new expenses"
                        />
                        <button onClick={handleUpdateExpenses}>Update Expenses</button>
                    </div>
                </div>
            ) : (
                <p>No budgets available.</p>
            )}
        </div>
    );
};

export default UpdateBudgetPage;
