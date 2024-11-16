import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Button, ProgressBar } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext.js';
import { getBudgets } from '../../services/api.js';
import DigitalClock from '../../components/Navbar/DigitalClock'; // Import DigitalClock component
import * as XLSX from 'xlsx'; // Import xlsx library
import { saveAs } from 'file-saver'; // Import file-saver for saving files
import './Budget.css';

const Budget = () => {
    const { token, logout } = useContext(AuthContext);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(budgets);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'الميزانيات');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(file, 'budgets.xlsx');
    };

    const downloadText = () => {
        const textData = budgets
            .map((budget) => {
                return `المبلغ المصروف: ${budget.expenses}, المبلغ المخصص: ${budget.allocation}, اسم الوحدة: ${budget.name}, الوصف: ${budget.desc}`;
            })
            .join('\n');
        const blob = new Blob([textData], { type: 'text/plain' });
        saveAs(blob, 'budgets.txt');
    };

    const downloadRowData = (budget) => {
        const textData = `المبلغ المصروف: ${budget.expenses}, المبلغ المخصص: ${budget.allocation}, اسم الوحدة: ${budget.name}, الوصف: ${budget.desc}`;
        const blob = new Blob([textData], { type: 'text/plain' });
        saveAs(blob, `${budget.name}_budget.txt`);
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
        <>
            <div className='cc'> 
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
                                    <h3>الميزانية</h3>
                                </Card.Header>
                                <Card.Body>
                                    <Table striped bordered hover responsive className="budget-table">
                                        <thead>
                                            <tr>
                                                <th>المبلغ المصروف</th>
                                                <th>المبلغ المخصص</th>
                                                <th>اسم الوحدة</th>
                                                <th>الوصف</th>
                                                <th>العلاقة بين المصروف والمخصص</th> {/* Added column */}
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
                                                            <td>{budget.expenses}</td>
                                                            <td>{budget.allocation}</td>
                                                            <td>{budget.name}</td>
                                                            <td>{budget.desc}</td>
                                                            <td>
                                                                <ProgressBar 
                                                                    now={percentage} 
                                                                    label={`${percentage.toFixed(2)}%`} 
                                                                    variant={percentage >= 100 ? 'danger' : 'success'}
                                                                />
                                                            </td> {/* Progress bar showing the ratio */}
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center">
                            {/* Add buttons for downloading entire data in Excel or Text format */}
                            <Button variant="success" onClick={downloadExcel}>تحميل Excel</Button>
                            <Button variant="info" onClick={downloadText}>تحميل Text</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Budget;
