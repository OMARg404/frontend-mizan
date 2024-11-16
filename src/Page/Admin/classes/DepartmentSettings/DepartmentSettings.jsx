import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, ProgressBar, Spinner, Form } from 'react-bootstrap';
import { AuthContext } from '../../../../context/AuthContext';
import { getBudgets, addBudget, updateAdminBudget } from '../../../../services/api';
import DigitalClock from '../../../../components/Navbar/DigitalClock'; // Import DigitalClock component
import * as XLSX from 'xlsx'; // Import xlsx library
import { saveAs } from 'file-saver'; // Import file-saver for saving files
import './DepartmentSettings.css';

const DepartmentSettings = () => {
    const { token, logout } = useContext(AuthContext);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [spentAmount, setSpentAmount] = useState(0);
    const [unitId, setUnitId] = useState("");
    const [description, setDescription] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);

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

    const handleUpdateBudget = async () => {
        try {
            if (selectedBudget) {
                await updateAdminBudget(selectedBudget._id, spentAmount, token);
                setEditMode(false);
                const updatedBudgets = budgets.map(budget =>
                    budget._id === selectedBudget._id ? { ...budget, amount: spentAmount } : budget
                );
                setBudgets(updatedBudgets);
                setSelectedBudget(null);
            }
        } catch (error) {
            console.error('Error updating budget:', error);
        }
    };

    const handleAddBudget = async () => {
        try {
            const budgetData = {
                amount: spentAmount,
                unitId,
                description
            };

            const newBudget = await addBudget(budgetData, token);
            setBudgets([...budgets, newBudget]);
        } catch (error) {
            console.error('Error adding budget:', error);
        }
    };

    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(budgets);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'الميزانيات');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(file, 'budgets.xlsx');
    };

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
        <div className="cccc">
        <div className="department-settings">
            <Container>
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
                                <h3>إعدادات الإدارة</h3>
                            </Card.Header>
                            <Card.Body>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>المبلغ المصروف</th>
                                            <th>المبلغ المخصص</th>
                                            <th>اسم الوحدة</th>
                                            <th>الوصف</th>
                                            <th>الإجراءات</th> 
                                            <th>العلاقة بين المصروف والمخصص</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {budgets.length === 0 ? (
                                            <tr>
                                                <td colSpan="6">لا توجد بيانات الميزانية</td>
                                            </tr>
                                        ) : (
                                            budgets.map((budget) => {
                                                const allocation = budget.allocation || 0;
                                                const expenses = budget.expenses || 0;
                                                const percentage = allocation > 0 ? (expenses / allocation) * 100 : 0;

                                                return (
                                                    <tr key={budget._id}>
                                                        <td>{budget.expenses}</td>
                                                        <td>{budget.allocation}</td>
                                                        <td>{budget.name}</td>
                                                        <td>{budget.desc}</td>
                                                        <td>
                                                            <Button
                                                                variant="warning"
                                                                onClick={() => {
                                                                    setEditMode(true);
                                                                    setSelectedBudget(budget);
                                                                    setUnitId(budget.unitId);
                                                                    setSpentAmount(budget.allocation); // or another value if needed
                                                                    setDescription(budget.desc);
                                                                }}
                                                                className="me-2"
                                                            >
                                                                تعديل المخصص
                                                            </Button>
                                                        </td>
                                                        <td>
                                                            <ProgressBar 
                                                                now={percentage} 
                                                                label={`${percentage.toFixed(2)}%`} 
                                                                variant={percentage >= 100 ? 'danger' : 'success'}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </Table>
                                {editMode && (
                                    <Form>
                                        <h4>تعديل المخصص</h4>
                                        <Form.Group controlId="spentAmount">
                                            <Form.Label>المبلغ المخصص</Form.Label>
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
                                        <Form.Label>المبلغ المخصص</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="أدخل المبلغ"
                                            value={spentAmount}
                                            onChange={(e) => setSpentAmount(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" onClick={handleAddBudget}>إضافة مخصص</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center">
                        <Button variant="success" onClick={downloadExcel}>تحميل Excel</Button>
                    </Col>
                </Row>
            </Container>
        </div>
        </div>
    );
};

export default DepartmentSettings;
