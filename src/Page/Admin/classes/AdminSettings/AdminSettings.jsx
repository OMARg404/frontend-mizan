import React, { useState, useContext } from 'react';
import { addBudget } from '../../../../services/api'; // Assuming you have this API function defined
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminSettings.css';

const AdminSettings = () => {
  const { token } = useContext(AuthContext);  // Destructure token from AuthContext
  const navigate = useNavigate();

  // State variables for form data
  const [budgetName, setBudgetName] = useState('');
  const [budgetDesc, setBudgetDesc] = useState('');
  const [budgetAllocation, setBudgetAllocation] = useState('');

  // Handler for form submission
  const handleAddBudget = async (e) => {
    e.preventDefault();

    // Create the budget data object
    const budgetData = {
      name: budgetName,
      desc: budgetDesc,
      allocation: budgetAllocation,
    };

    try {
      // Call addBudget function from API
      const result = await addBudget(budgetData, token);
      
      // Optionally, navigate after successful submission (e.g., to a budget list page)
      navigate('/budget');  // Adjust the path as needed

      // Optionally, clear form after submission
      setBudgetName('');
      setBudgetDesc('');
      setBudgetAllocation('');
      
      console.log("Budget added:", result);
    } catch (error) {
      console.error("Failed to add budget:", error);
      // Handle error appropriately (e.g., show error message)
    }
  };

  return (
    <div className="admin-settings-page-container cccccc">
      <h2>Add New Budget</h2>

      <form onSubmit={handleAddBudget}>
        <div className="form-group">
          <label htmlFor="budgetName">Budget Name:</label>
          <input
            type="text"
            id="budgetName"
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="budgetDesc">Description:</label>
          <input
            type="text"
            id="budgetDesc"
            value={budgetDesc}
            onChange={(e) => setBudgetDesc(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="budgetAllocation">Allocation:</label>
          <input
            type="number"
            id="budgetAllocation"
            value={budgetAllocation}
            onChange={(e) => setBudgetAllocation(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Budget</button>
      </form>
    </div>
  );
};

export default AdminSettings;
