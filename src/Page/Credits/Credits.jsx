import React, { useState, useContext } from 'react';
import './Credits.css';
import { addCredit } from '../../services/api';  // Import addCredit
import { Spinner } from 'react-bootstrap'; // To show loading spinner
import { AuthContext } from '../../context/AuthContext.js'; // Import AuthContext

const Credits = () => {
    const { token } = useContext(AuthContext);  // Get token from AuthContext
    const [credits, setCredits] = useState([]);  // Stores the list of credits
    const [newCredit, setNewCredit] = useState({ title: '', description: '', amount: 0 }); // Holds new credit data
    const [loading, setLoading] = useState(false); // State for loading
    const [error, setError] = useState(null); // State for error

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCredit({ ...newCredit, [name]: value });
    };

    // Function to handle adding new credit
    const handleAddCredit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Set loading state to true
        try {
            // Ensure token is present before making the request
            if (!token) {
                throw new Error("Token is missing");
            }

            // Validate new credit data before making the request
            if (!newCredit.title || !newCredit.description || newCredit.amount <= 0) {
                throw new Error("Please provide valid credit data.");
            }

            // Map new credit data to match the backend API fields
            const creditData = {
                name: newCredit.title,  // Map title to name
                reason: newCredit.description, // Map description to reason
                allocation: newCredit.amount,  // Map amount to allocation
            };

            // Call the addCredit service with new credit data and token
            const response = await addCredit(creditData, token);  
            console.log('Added new credit:', response); // Debug new credit response

            // Update credits list with new credit
            setCredits([...credits, response]);
            setNewCredit({ title: '', description: '', amount: 0 });  // Clear the input fields after adding credit
            setError(null);  // Clear error if the operation was successful
        } catch (error) {
            console.error("Failed to add credit:", error);
            setError(error.message || 'انت ادمن غير متاح لك اضافه طلب'); // Set error message state
        } finally {
            setLoading(false);  // Stop loading after the request
        }
    };

    // Display loading spinner while adding credit
    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" variant="primary" size="lg" />
                <h4>جاري إضافة الرصيد...</h4>
            </div>
        );
    }

    return (
        <div className='cc'>
            <div className="credits-container">
                <h2>اضافه طلب</h2>
                {error && (
                    <div className="error-container">
                        <h4>{error}</h4>
                    </div>
                )}
                <ul>
                    {credits.map((credit) => (
                        <li key={credit._id}>
                            <h3>{credit.name}</h3>
                            <p>{credit.reason}</p>
                            <p>المبلغ: {credit.allocation}</p>
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleAddCredit}>
                    <input
                        type="text"
                        name="title"
                        value={newCredit.title}
                        onChange={handleInputChange}
                        placeholder="العنوان"
                        required
                    />
                    <textarea
                        name="description"
                        value={newCredit.description}
                        onChange={handleInputChange}
                        placeholder="الوصف"
                        required
                    ></textarea>
                    <input
                        type="number"
                        name="amount"
                        value={newCredit.amount}
                        onChange={handleInputChange}
                        placeholder="المبلغ"
                        required
                    />
                    <button type="submit">إضافة</button>
                </form>
            </div>
        </div>
    );
};

export default Credits;
