// import React, { useState, useContext } from 'react';
// import './Credits.css';
// import { addCredit } from '../../services/api';
// import { Spinner, Form, Button, Alert, Container } from 'react-bootstrap';
// import { AuthContext } from '../../context/AuthContext';

// const Credits = () => {
//     const { token } = useContext(AuthContext);
//     const [newCredit, setNewCredit] = useState({ name: '', reason: '', allocation: 0 });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewCredit({ ...newCredit, [name]: value });
//     };

//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         setSuccess(null);

//         try {
//             await addCredit(newCredit, token);
//             setSuccess("Credit added successfully!");
//             setNewCredit({ name: '', reason: '', allocation: 0 });
//         } catch (error) {
//             console.error("Error adding credit:", error.response || error.message || error);
//             setError(error.message || "Failed to add credit");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Container className="credits-container bbb">
//             <h2>إضافة طلب جديد</h2>
//             {loading && (
//                 <div className="loading-container">
//                     <Spinner animation="border" variant="primary" size="lg" />
//                     <h4>جاري إضافة الطلب...</h4>
//                 </div>
//             )}
//             {error && <Alert variant="danger">{error}</Alert>}
//             {success && <Alert variant="success">{success}</Alert>}
//             {!loading && (
//                 <Form onSubmit={handleFormSubmit}>
//                     <Form.Group controlId="formCreditName">
//                         <Form.Label>اسم الطلب</Form.Label>
//                         <Form.Control
//                             type="text"
//                             name="name"
//                             value={newCredit.name}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </Form.Group>
//                     <Form.Group controlId="formCreditReason">
//                         <Form.Label>السبب</Form.Label>
//                         <Form.Control
//                             type="text"
//                             name="reason"
//                             value={newCredit.reason}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </Form.Group>
//                     <Form.Group controlId="formCreditAllocation">
//                         <Form.Label>المبلغ</Form.Label>
//                         <Form.Control
//                             type="number"
//                             name="allocation"
//                             value={newCredit.allocation}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </Form.Group>
//                     <Button variant="primary" type="submit">
//                         إضافة الطلب
//                     </Button>
//                 </Form>
//             )}
//         </Container>
//     );
// };

// export default Credits;
