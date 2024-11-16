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

    const fetchCredits = async () => {
        try {
            if (!token) {
                throw new Error("Token is missing");
            }

            console.log("Fetching credits with token:", token);

            const response = await getCredits(token);

            console.log("API Response:", response);

            if (response && Array.isArray(response.Credits)) {
                setCredits(response.Credits);
            } else {
                console.error("Invalid response format:", response);
                setCredits([]);
            }
        } catch (error) {
            console.error("Error fetching credits:", error);
            setError(error.message || 'ليس لديك صلحيات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCredits();
    }, [token]);

    useEffect(() => {
        console.log("Credits state:", credits);
    }, [credits]);

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
        <div className='ccc'> 
        <Container className="credits-container">
            <Row>
                <Col>
                    <h2 className="credits-title">الطلبات الواردة</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover responsive className="credits-table">
                        <thead>
                            <tr>
                                <th>اسم</th>
                                <th>السبب</th>
                                <th>التخصيص</th>
                                <th>وقت الإنشاء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {credits.length > 0 ? (
                                credits.map((credit) => (
                                    <tr key={credit._id}>
                                        <td>{credit.name}</td>
                                        <td>{credit.reason}</td>
                                        <td>{credit.allocation} ريال</td>
                                        <td>{new Date(credit.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="error-message">لا توجد أرصدة حالياً.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
        </div>
    );
};

export default IncomingRequests;
