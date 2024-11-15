import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap'; // Import Spinner
import { AuthContext } from '../../context/AuthContext.js';
import { getBudgets } from '../../services/api.js'; // Assuming getBudgets is available in api.js
import './Budget.css';

const Budget = () => {
    const { token } = useContext(AuthContext); // Get the token from AuthContext
    const [budgets, setBudgets] = useState([]); // State to store the budgets
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch budgets when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError('لا يوجد رمز دخول'); // Display error if no token
                setLoading(false);
                return;
            }

            try {
                const budgetsData = await getBudgets(token); // Pass token to getBudgets
                setBudgets(budgetsData); // Set budgets data
            } catch (error) {
                console.error('Error fetching data:', error);
                // Check if the error is related to token authorization
                if (error.response && error.response.status === 401) {
                    setError('رمز الدخول غير صالح أو منتهي الصلاحية');
                } else {
                    setError('فشل في تحميل البيانات');
                }
            } finally {
                setLoading(false); // Set loading to false after data is fetched or error occurs
            }
        };

        fetchData();
    }, [token]); // Depend on token to refetch data when it changes

    // Display loading spinner while data is being fetched
    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" variant="primary" size="lg" />
                <h4>جاري تحميل البيانات...</h4>
            </div>
        );
    }

    // Display error message if there is an error
    if (error) {
        return (
            <div className="error-container">
                <h4>{error}</h4>
            </div>
        );
    }

    return (
        <Container className="department-settings">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3>إعدادات الميزانية</h3>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>المبلغ المصروف</th>
                                        <th>المبلغ المخصص</th>
                                        <th>اسم الوحدة</th>
                                        <th>الوصف</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgets.length === 0 ? (
                                        <tr>
                                            <td colSpan="4">لا توجد بيانات الميزانية</td>
                                        </tr>
                                    ) : (
                                        budgets.map((budget) => (
                                            <tr key={budget.id}>
                                                <td>{budget.spentAmount}</td>
                                                <td>{budget.allocatedBudget}</td>
                                                <td>{budget.unitName}</td>
                                                <td>{budget.description}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Budget;
