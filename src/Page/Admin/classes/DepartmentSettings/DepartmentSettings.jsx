import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Form, Alert, ProgressBar } from 'react-bootstrap';
import { AuthContext } from '../../../../context/AuthContext';
import { getBudgets, updateAdminBudget, deleteBudget } from '../../../../services/api';
import DigitalClock from '../../../../components/Navbar/DigitalClock'; // Import DigitalClock component
import './DepartmentSettings.css';

const DepartmentSettings = () => {
    const { token, logout } = useContext(AuthContext);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [newAllocation, setNewAllocation] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch budgets when component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError('لم يتم توفير التوكن');
                setLoading(false);
                return;
            }

            try {
                const response = await getBudgets(token);
                console.log('تم جلب بيانات الميزانية:', response); // Log the fetched data for debugging

                if (response && Array.isArray(response.Budgets)) {
                    setBudgets(response.Budgets); // Set only the Budgets array
                } else {
                    setError('تم استلام بيانات غير صالحة من الخادم');
                }
            } catch (error) {
                console.error('خطأ في جلب البيانات:', error);
                if (error.response && error.response.status === 401) {
                    setError('التوكن منتهي الصلاحية أو غير صالح، يرجى تسجيل الدخول مرة أخرى');
                    logout();
                } else {
                    setError(error.message || 'ليس لديك صلحيات');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, logout]);

    // Handle selection of a budget to update
    const handleBudgetSelection = (budget) => {
        setSelectedBudget(budget);
        setNewAllocation(budget.allocation);
    };

    // Handle the update of the selected budget
    const handleUpdateBudget = async () => {
        if (!selectedBudget || newAllocation === selectedBudget.allocation) return;

        try {
            const response = await updateAdminBudget(selectedBudget._id, newAllocation, token);
            console.log('تم تحديث الميزانية:', response);
            setBudgets(budgets.map(budget =>
                budget._id === selectedBudget._id ? { ...budget, allocation: newAllocation } : budget
            ));
            setSuccessMessage('تم تحديث الميزانية بنجاح');
            setSelectedBudget(null);
            setNewAllocation('');
        } catch (err) {
            setError('فشل في تحديث الميزانية');
            console.error(err);
        }
    };

    // Handle the deletion of a budget
    const handleDeleteBudget = async (budgetId) => {
        const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذه الميزانية؟");
        if (!confirmDelete) return;

        try {
            const response = await deleteBudget(budgetId, token);
            console.log('تم حذف الميزانية:', response);
            setBudgets(budgets.filter(budget => budget._id !== budgetId)); // Remove deleted budget from state
            setSuccessMessage('تم حذف الميزانية بنجاح');
        } catch (err) {
            setError('فشل في حذف الميزانية');
            console.error(err);
        }
    };

    return (
        <div className="cccccc">
            <Container className="department-settings">
                <Container className="digital-clock-container">
                    <Row>
                        <Col>
                            <DigitalClock /> {/* DigitalClock component */}
                        </Col>
                    </Row>
                </Container>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <h3>إعدادات الأقسام</h3>
                            </Card.Header>
                            <Card.Body>
                                {/* Success Message */}
                                {successMessage && (
                                    <Alert variant="success">
                                        {successMessage}
                                    </Alert>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <Alert variant="danger">
                                        {error}
                                    </Alert>
                                )}

                                {loading ? (
                                    <div className="loading-container">
                                        <Spinner animation="border" variant="primary" size="lg" />
                                        <h4>جاري تحميل البيانات...</h4>
                                    </div>
                                ) : (
                                    <Table striped bordered hover responsive className="budget-table">
                                        <thead>
                                            <tr>
                                                <th>الاسم</th>
                                                <th>الوصف</th>
                                                <th>الميزانية المخصصة</th>
                                                <th>العلاقة بين المصروف والمخصص</th>
                                                <th>الإجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {budgets.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5">لا توجد بيانات الميزانية</td>
                                                </tr>
                                            ) : (
                                                budgets.map((budget) => {
                                                    const allocation = budget.allocation || 0;
                                                    const expenses = budget.expenses || 0;
                                                    const percentage = allocation > 0 ? (expenses / allocation) * 100 : 0;

                                                    return (
                                                        <tr key={budget._id}>
                                                            <td>{budget.name}</td>
                                                            <td>{budget.desc}</td>
                                                            <td>{budget.allocation}</td>
                                                            <td>
                                                                <ProgressBar 
                                                                    now={percentage} 
                                                                    label={`${percentage.toFixed(2)}%`} 
                                                                    variant={percentage >= 100 ? 'danger' : 'success'}
                                                                />
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="primary"
                                                                    onClick={() => handleBudgetSelection(budget)}
                                                                >
                                                                    تعديل
                                                                </Button>
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() => handleDeleteBudget(budget._id)}
                                                                    className="ml-2"
                                                                >
                                                                    حذف
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Edit Budget Section */}
                {selectedBudget && (
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <h4>تعديل الميزانية: {selectedBudget.name}</h4>
                                    <Form>
                                        <Form.Group controlId="allocation">
                                            <Form.Label>الميزانية المخصصة الجديدة</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={newAllocation}
                                                onChange={(e) => setNewAllocation(e.target.value)}
                                                placeholder="أدخل الميزانية الجديدة"
                                            />
                                        </Form.Group>
                                        <Button
                                            variant="success"
                                            onClick={handleUpdateBudget}
                                            disabled={!newAllocation || newAllocation === selectedBudget.allocation}
                                        >
                                            حفظ التعديلات
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default DepartmentSettings;
