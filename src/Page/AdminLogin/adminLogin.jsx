import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loginAdmin } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './adminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const data = await loginAdmin(values.username, values.password);
      if (data.token && data.user) {
        login(data.token, data.user); // Save token and user data in context
        navigate('/admin'); // Redirect to the admin's home page
      } else {
        setErrors({ general: 'Login failed: No token received.' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Invalid username or password' });
    }
    setSubmitting(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Admin Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Field
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                />
                <ErrorMessage name="username" component="div" className="text-danger" />
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AdminLogin;
