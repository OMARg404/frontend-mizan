import React, { useState, useEffect, useContext } from 'react';
import { getMonthlyReports } from '../../services/api'; // Import the function to fetch monthly reports
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import * as XLSX from 'xlsx'; // Import xlsx for Excel export
import { saveAs } from 'file-saver'; // Import file-saver to download the file
import './Reports.css';

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

    // Function to export reports to Excel
    const exportToExcel = () => {
        // Prepare data to be exported
        const wsData = [
            ['اسم الميزانية', 'التخصيص', 'المصروفات', 'المتبقي'], // Header row
            ...reports.map(report => [report.name, report.allocation, report.expenses, report.remaining]) // Data rows
        ];

        // Create a new worksheet from the data
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'التقارير الشهرية');

        // Generate Excel file and trigger download
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const excelFile = new Blob([excelBuffer], { bookType: 'xlsx', type: 'application/octet-stream' });
        
        // Use FileSaver to save the file with a specific name
        saveAs(excelFile, 'تقارير_شهرية.xlsx');
    };

    return (
        <div className="reports-container ne" dir="rtl">
            <h2>صفحة التقارير</h2>
            {loading && <p>جاري تحميل التقارير...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display reports */}
            <button onClick={exportToExcel} className="btn btn-success">
                تحميل التقارير بصيغة Excel
            </button>

            <table className="table mt-4">
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
