import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loginUser } from '../../services/api';  // Ensure this function is imported correctly
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    // Updated handleSubmit function to handle login flow
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const data = await loginUser(values.email, values.password);
    
            if (data && data.token) {
                // Check if user data is available
                if (data.user) {
                    login(data.token, data.user);
                } else {
                    // If no user data, you can choose how to handle this (e.g., login with token only)
                    login(data.token, null);
                }
    
                // Navigate to the home page after successful login
                navigate('/home');
            } else {
                setErrors({ general: 'Login failed: Invalid email or password.' });
            }
        } catch (error) {
            // Handle network or other server issues
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred during login';
            setErrors({ general: errorMessage });
        }
        setSubmitting(false);
    };
    

    const handleAdminLogin = () => {
        navigate('/adminLogin');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit} // Pass handleSubmit function here
                >
                    {({ isSubmitting, errors }) => (
                        <Form className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Field
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </div>
                            {errors.general && <p className="text-danger">{errors.general}</p>}
                            <button type="submit" className="login-button btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? <div className="spinner"></div> : 'Login'}
                            </button>
                            {/* <button type="button" className="admin-login-button btn btn-secondary" onClick={handleAdminLogin}>
                                Admin
                            </button> */}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
