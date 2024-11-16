import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, ProgressBar, Spinner, Form } from 'react-bootstrap';
import { AuthContext } from '../../../../context/AuthContext';
import { getBudgets, addBudget, updateAdminBudget } from '../../../../services/api';
import DigitalClock from '../../../../components/Navbar/DigitalClock';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
                if (response && Array.isArray(response.Budgets)) {
                    setBudgets(response.Budgets);
                } else {
                    setError('تم استلام بيانات غير صالحة من الخادم');
                }
            } catch (error) {
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

    // Update Budget handler
    const handleUpdateBudget = async () => {
        if (spentAmount <= 0 || !selectedBudget) {
            alert("يرجى إدخال قيمة صالحة للمبلغ");
            return;
        }
        try {
            const updatedBudgetData = {
                amount: spentAmount,
            };

            const updatedBudget = await updateAdminBudget(selectedBudget._id, updatedBudgetData, token);
            setEditMode(false);
            setBudgets(budgets.map(budget => 
                budget._id === selectedBudget._id ? { ...budget, allocation: spentAmount } : budget
            ));
            setSelectedBudget(null);
        } catch (error) {
            console.error('Error updating budget:', error);
        }
    };

    // Add Budget handler
    const handleAddBudget = async () => {
        if (spentAmount <= 0 || !unitId || !description) {
            alert("يرجى ملء جميع الحقول بشكل صحيح");
            return;
        }
        try {
            const budgetData = {
                amount: spentAmount,
                unitId,
                description
            };

            const newBudget = await addBudget(budgetData, token);
            setBudgets([...budgets, newBudget]);
            setSpentAmount(0);
            setUnitId("");
            setDescription("");
        } catch (error) {
            console.error('Error adding budget:', error);
        }
    };

    // Excel download handler
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
        <div className="department-settings cccc">
            <Container>
                <Container className="digital-clock-container">
                    <Row>
                        <Col>
                            <DigitalClock />
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
                                                                    setSpentAmount(budget.allocation); 
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
                                            {/* Add unit options here */}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="description">
                                        <Form.Label>الوصف</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="أدخل الوصف"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="spentAmount">
                                        <Form.Label>المبلغ المصروف</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="أدخل المبلغ المصروف"
                                            value={spentAmount}
                                            onChange={(e) => setSpentAmount(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" onClick={handleAddBudget}>إضافة المصروف</Button>
                                </Form>

                                <Button variant="secondary" onClick={downloadExcel}>تنزيل الإكسل</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default DepartmentSettings;
