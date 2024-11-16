import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext.js';
import { getBudgets } from '../../services/api.js'; 
import './Budget.css';

const Budget = () => {
    const { token, logout } = useContext(AuthContext); // Get token and logout function
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError('No token provided');
                setLoading(false);
                return;
            }

            try {
                const budgetsData = await getBudgets(token);
                setBudgets(budgetsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response && error.response.status === 401) {
                    setError('Token expired or invalid, please log in again');
                    logout(); // Logout on token error
                } else {
                    setError(error.message || 'Failed to fetch data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, logout]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" variant="primary" size="lg" />
                <h4>جاري تحميل البيانات...</h4>
            </div>
        );
    }

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
                                            <tr key={budget._id}>
                                                <td>{budget.expenses}</td>
                                                <td>{budget.allocation}</td>
                                                <td>{budget.name}</td>
                                                <td>{budget.desc}</td>
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
