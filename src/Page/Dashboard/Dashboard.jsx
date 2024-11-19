// src/Page/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getMonthlyReports } from '../../services/api'; // Import the function to fetch monthly reports
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { Bar } from 'react-chartjs-2'; // Import Bar chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary components from Chart.js
import './Dashboard.css'
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { token } = useContext(AuthContext); // Access token from AuthContext
    const [reports, setReports] = useState([]); // State to store monthly reports
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch monthly reports on component mount
    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const reportData = await getMonthlyReports(token); // Fetch reports with the token
                setReports(reportData.report); // Store the report data in the state
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setError(err.message || 'Failed to fetch monthly reports');
            }
        };

        if (token) {
            fetchReports(); // Fetch reports only if token exists
        }
    }, [token]); // Dependency array will re-run if the token changes

    // Prepare data for the chart
    const chartData = {
        labels: reports.map((report) => report.name), // Labels are the report names
        datasets: [
            {
                label: 'التخصيص',
                data: reports.map((report) => report.allocation),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'المصروفات',
                data: reports.map((report) => report.expenses),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'المتبقي',
                data: reports.map((report) => report.remaining),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'التقارير الشهرية',
            },
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div className="dashboard-container la">
            <h2>لوحة القيادة</h2>
            {loading && <p>جاري تحميل التقارير...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display charts */}
            <div className="dashboard-charts">
                {reports.length > 0 && (
                    <Bar data={chartData} options={options} />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
