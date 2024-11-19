// src/Page/Reports/Reports.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getMonthlyReports } from '../../services/api'; // Import the function to fetch monthly reports
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import './Reports.css'
const Reports = () => {
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
                setError(err.message || 'فشل في جلب التقارير الشهرية');
            }
        };

        if (token) {
            fetchReports(); // Fetch reports only if token exists
        }
    }, [token]); // Dependency array will re-run if the token changes

    return (
        <div className="reports-container ne" dir="rtl">
            <h2>صفحة التقارير</h2>
            {loading && <p>جاري تحميل التقارير...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display reports */}
            <table className="table">
                <thead>
                    <tr>
                        <th>اسم الميزانية</th>
                        <th>التخصيص</th>
                        <th>المصروفات</th>
                        <th>المتبقي</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.name}>
                            <td>{report.name}</td>
                            <td>{report.allocation}</td>
                            <td>{report.expenses}</td>
                            <td>{report.remaining}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reports;
