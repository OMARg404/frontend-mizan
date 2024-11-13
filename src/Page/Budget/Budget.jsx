import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap'; // Import Spinner
import { AuthContext } from '../../context/AuthContext.js';
import { 
    getAllAdministrativeUnits, 
    getAllExpenses 
} from '../../services/api.js'; // Assuming the path is correct
import './Budget.css';

const Budget = () => {
    const { token } = useContext(AuthContext); // Get the token from AuthContext
    const [units, setUnits] = useState([]); // State to store the administrative units
    const [expenses, setExpenses] = useState([]); // State to store expenses
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch administrative units and expenses when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch administrative units
                const unitsData = await getAllAdministrativeUnits(token);
                setUnits(unitsData);

                // Fetch expenses
                const expensesData = await getAllExpenses(token);
                
                // Ensure expensesData is an array before setting the state
                if (Array.isArray(expensesData)) {
                    setExpenses(expensesData);
                } else {
                    console.error('Expected an array of expenses, but got:', expensesData);
                    setExpenses([]); // Set as an empty array if the data is invalid
                }

                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" variant="primary" size="lg" />
                <h4>جاري تحميل البيانات...</h4>
            </div>
        );
    }

    return (
        <Container className="department-settings">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3>إعدادات الإدارة</h3>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>المصاريف</th>
                                        <th>المخصص</th>
                                        <th>اسم الوحدة</th>
                                        <th>الوصف</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.map((unit) => (
                                        <tr key={unit.id}>
                                            <td>{unit.spentAmount}</td>
                                            <td>{unit.allocatedBudget}</td>
                                            <td>{unit.name}</td>
                                            <td>{unit.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <h4>المصاريف</h4>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>الوصف</th>
                                        <th>المبلغ</th>
                                        <th>وحدة ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.length > 0 ? (
                                        expenses.map((expense) => (
                                            <tr key={expense.id}>
                                                <td>{expense.description}</td>
                                                <td>{expense.amount}</td>
                                                <td>{expense.unitId}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3">No expenses data available</td>
                                        </tr>
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
