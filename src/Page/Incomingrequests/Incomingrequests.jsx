import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import { getCredits } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './Incomingrequests.css';

const IncomingRequests = () => {
    const { token } = useContext(AuthContext);
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const data = await getCredits(token);
                console.log(data);
                setCredits(data.Credits);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'ليس لديك الصلاحيات 😐');
                setLoading(false);
            }
        };
        fetchCredits();
    }, [token]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" variant="primary" size="lg" />
                <h4>جاري تحميل الأرصدة...</h4>
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
        <div className="credits-page cccccc">
            <Container className="credits-container">
                <Row>
                    <Col>
                      <h2>قائمة الطلابات</h2>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>الاسم</th>
                                    <th>السبب</th>
                                    <th>التخصيص</th>
                                    <th>التاريخ</th>
                                    <th>المستخدم</th>
                                </tr>
                            </thead>
                            <tbody>
                                {credits.map((credit, index) => (
                                    <tr key={credit._id}>
                                        <td>{index + 1}</td>
                                        <td>{credit.name}</td>
                                        <td>{credit.reason}</td>
                                        <td>{credit.allocation}</td>
                                        <td>{new Date(credit.createdAt).toLocaleDateString()}</td>
                                        <td>{credit.userId ? credit.userId.name : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default IncomingRequests;
