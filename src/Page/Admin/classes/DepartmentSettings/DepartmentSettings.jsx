import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import { AuthContext } from '../../../../context/AuthContext';
import { 
    getAllAdministrativeUnits, 
    deleteAdministrativeUnit 
} from '../../../../services/api.js';
import { 
    updateBudgetAllocated, 
    addExpense, 
    getAllExpenses, 
    deleteExpense, 
    deleteBudget 
} from '../../../../services/api'; // Assuming the path is correct
import './DepartmentSettings.css';

const DepartmentSettings = () => {
    const { token } = useContext(AuthContext); // Get the token from AuthContext
    const [units, setUnits] = useState([]); // State to store the administrative units
    const [expenses, setExpenses] = useState([]); // State to store expenses
    const [loading, setLoading] = useState(true); // Loading state
    const [spentAmount, setSpentAmount] = useState(0); // State for spending amount
    const [description, setDescription] = useState(""); // State for expense description
    const [unitId, setUnitId] = useState(""); // State for selected unitId
    const [editMode, setEditMode] = useState(false); // State to track if we are in edit mode
    const [selectedUnit, setSelectedUnit] = useState(null); // State for selected unit in edit mode

    // Fetch administrative units and expenses when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch administrative units
                const unitsData = await getAllAdministrativeUnits(token);
                setUnits(unitsData);

                // Fetch expenses
                const expensesData = await getAllExpenses(token);
                setExpenses(expensesData);
                
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    // Handle delete action for administrative units
    const handleDeleteUnit = async (unitId) => {
        try {
            await deleteAdministrativeUnit(unitId, token); // Call delete API
            setUnits(units.filter((unit) => unit.id !== unitId)); // Update state to remove the deleted unit
        } catch (error) {
            console.error('Error deleting administrative unit:', error);
        }
    };

    // Handle delete action for expenses
    const handleDeleteExpense = async (expenseId) => {
        try {
            await deleteExpense(expenseId, token); // Call delete API
            setExpenses(expenses.filter((expense) => expense.id !== expenseId)); // Update state to remove the deleted expense
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    // Handle delete action for budgets
    const handleDeleteBudget = async (budgetId) => {
        try {
            await deleteBudget(budgetId, token); // Call delete API
            console.log('Budget deleted successfully');
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    // Handle update action (updating allocated budget)
   
    const handleUpdateBudget = async (unitId, spentAmount) => {
        try {
            console.log("spentAmount "+ spentAmount);
            await updateBudgetAllocated(unitId, spentAmount, token);
            // Optionally refresh the unit data here
        } catch (error) {
            console.error('Error updating budget:', error);
        }
    };
    

    // Handle adding a new expense
    const handleAddExpense = async () => {
        try {
            const expenseData = {
                description: description,
                amount: spentAmount,
                unitId: unitId,
                budgetId: 'some-budget-id' // Replace with the actual budgetId
            };

            const response = await addExpense(expenseData, token);

            if (response.status === 200) {
                console.log('Expense added successfully');
                // Add the new expense to the state
                setExpenses([...expenses, response.data]);
            }
        } catch (error) {
            console.error('Error adding expense:', error);
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
                                        <th>المصاريف</th>
                                        <th>المخصص</th>
                                        <th>اسم الوحدة</th>
                                        <th>الوصف</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.map((unit) => (
                                        <tr key={unit.id}>
                                            <td>{unit.spentAmount}</td>
                                            <td>{unit.allocatedBudget}</td>
                                            <td>{unit.name}</td>
                                            <td>{unit.description}</td>
                                            <td>
                                                <Button 
                                                    variant="warning" 
                                                    onClick={() => {
                                                        setEditMode(true);
                                                        setSelectedUnit(unit);
                                                        setUnitId(unit.id);
                                                        setSpentAmount(unit.spentAmount);
                                                    }} 
                                                    className="me-2"
                                                >
                                                    تعديل المخصص
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    onClick={() => handleDeleteUnit(unit.id)}
                                                >
                                                    حذف
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    onClick={() => handleDeleteBudget(unit.budgetId)}
                                                >
                                                    حذف المخصص المركزي
                                                </Button>
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
                                        {units.map((unit) => (
                                            <option key={unit.id} value={unit.id}>
                                                {unit.name}
                                            </option>
                                        ))}
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

                                <Button variant="primary" onClick={handleAddExpense}>إضافة مصروف</Button>
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
                                                <Button variant="danger" onClick={() => handleDeleteExpense(expense.id)} >
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
