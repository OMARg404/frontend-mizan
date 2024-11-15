import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import { AuthContext } from '../../../../context/AuthContext';
import { 
    getBudgets,
    addBudget,
    deleteExpense,
    updateAdminBudget
} from '../../../../services/api'; // Removed deleteBudget import
import './DepartmentSettings.css';

const DepartmentSettings = () => {
    const { token } = useContext(AuthContext); // Get the token from AuthContext
    const [budgets, setBudgets] = useState([]); // State to store budgets
    const [expenses, setExpenses] = useState([]); // State to store expenses
    const [spentAmount, setSpentAmount] = useState(0); // State for spending amount
    const [description, setDescription] = useState(""); // State for expense description
    const [unitId, setUnitId] = useState(""); // State for selected unitId
    const [editMode, setEditMode] = useState(false); // State to track if we are in edit mode
    const [selectedBudget, setSelectedBudget] = useState(null); // State for selected budget in edit mode
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch budgets when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch budgets
                const budgetsData = await getBudgets(token);
                setBudgets(budgetsData);

                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    // Handle delete action for expenses (if necessary)
    const handleDeleteExpense = async (expenseId) => {
        try {
            await deleteExpense(expenseId, token); // Call delete API
            setExpenses(expenses.filter((expense) => expense.id !== expenseId)); // Update state to remove the deleted expense
            console.log('Expense deleted successfully');
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    // Handle update action (updating allocated budget)
    const handleUpdateBudget = async () => {
        try {
            if (selectedBudget) {
                console.log("spentAmount: ", spentAmount);
                await updateAdminBudget(selectedBudget.id, spentAmount, token); // Use the correct budget ID
                setEditMode(false); // Close edit mode after successful update
                console.log('Budget updated successfully');
            }
        } catch (error) {
            console.error('Error updating budget:', error);
        }
    };

    // Handle adding a new budget
    const handleAddBudget = async () => {
        try {
            const budgetData = {
                // Example budget data, replace with actual fields
                amount: spentAmount,
                unitId: unitId,
            };

            const response = await addBudget(budgetData, token);

            if (response.status === 200) {
                console.log('Budget added successfully');
                setBudgets([...budgets, response.data]); // Add the new budget to the state
            }
        } catch (error) {
            console.error('Error adding budget:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
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
                                        <th>المخصص</th>
                                        <th>اسم الوحدة</th>
                                        <th>الوصف</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgets.map((budget) => (
                                        <tr key={budget.id}>
                                            <td>{budget.amount}</td>
                                            <td>{budget.unitId}</td>
                                            <td>{budget.description}</td>
                                            <td>
                                                <Button 
                                                    variant="warning" 
                                                    onClick={() => {
                                                        setEditMode(true);
                                                        setSelectedBudget(budget);
                                                        setUnitId(budget.unitId);
                                                        setSpentAmount(budget.amount);
                                                    }} 
                                                    className="me-2"
                                                >
                                                    تعديل المخصص
                                                </Button>
                                                {/* Removed delete budget button */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {editMode && (
                                <Form>
                                    <h4>تعديل المخصص</h4>
                                    <Form.Group controlId="spentAmount">
                                        <Form.Label>المبلغ المنفق</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="أدخل المبلغ المنفق"
                                            value={spentAmount}
                                            onChange={(e) => setSpentAmount(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Button variant="primary" onClick={handleUpdateBudget}>حفظ التعديل</Button>
                                </Form>
                            )}

                            <Form>
                                <h4>إضافة مصروف</h4>
                                <Form.Group controlId="unitId">
                                    <Form.Label>اختيار الوحدة</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={unitId}
                                        onChange={(e) => setUnitId(e.target.value)}
                                    >
                                        <option value="">اختار الوحدة</option>
                                        {/* Add your units here if you fetch them */}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="description">
                                    <Form.Label>الوصف</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="أدخل وصف المصروف"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="spentAmount">
                                    <Form.Label>المبلغ</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="أدخل المبلغ"
                                        value={spentAmount}
                                        onChange={(e) => setSpentAmount(e.target.value)}
                                    />
                                </Form.Group>

                                <Button variant="primary" onClick={handleAddBudget}>إضافة مخصص</Button>
                            </Form>

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
                                    {expenses.map((expense) => (
                                        <tr key={expense.id}>
                                            <td>{expense.description}</td>
                                            <td>{expense.amount}</td>
                                            <td>{expense.unitId}</td>
                                            <td>
                                                <Button 
                                                    variant="danger" 
                                                    onClick={() => handleDeleteExpense(expense.id)}
                                                >
                                                    حذف
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DepartmentSettings;
