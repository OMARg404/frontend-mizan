import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Assuming you have AuthContext for authentication
import { getAllExpenses } from '../../services/api'; // Use getAllExpenses instead of getAllBudgets

const Budget = () => {
    const { token } = useContext(AuthContext); // Access token from AuthContext
    const [expenses, setExpenses] = useState([]); // Renamed budgets to expenses
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExpenses = async () => {  // Renamed fetchBudgets to fetchExpenses
            try {
                const expenseData = await getAllExpenses(token); // Use getAllExpenses here
                setExpenses(expenseData);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch expense data');
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [token]); // Run once when the component mounts or token changes

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="budget-container">
            <h2>Expenses Page</h2>  {/* Changed to "Expenses Page" */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Total Amount</th>
                        <th>Allocated Amount</th>
                        <th>Spent Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense, index) => (  // Renamed budgets to expenses
                        <tr key={index}>
                            <td>{expense.departmentName}</td>
                            <td>{expense.totalAmount}</td>
                            <td>{expense.allocatedAmount}</td>
                            <td>{expense.spentAmount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Budget;
