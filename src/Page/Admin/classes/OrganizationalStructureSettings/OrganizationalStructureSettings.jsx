import React, { useState, useContext, useEffect } from 'react';
import { createUser, getBudgets } from '../../../../services/api';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../../../context/AuthContext';
import './OrganizationalStructureSettings.css';

const CreateUserPage = () => {
  const { token, logout } = useContext(AuthContext); // Get token and logout function from AuthContext

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    budgets: [], // Array to hold selected budgets and their permissions
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [budgetOptions, setBudgetOptions] = useState([]);

  // Fetch budgets when the component mounts
  useEffect(() => {
    const fetchBudgets = async () => {
      if (!token) {
        setError('لم يتم توفير التوكن');
        setLoading(false);
        return;
      }

      try {
        const response = await getBudgets(token);
        console.log('تم جلب بيانات الميزانية:', response); // Log the fetched data for debugging

        if (response && Array.isArray(response.Budgets)) {
          setBudgetOptions(response.Budgets); // Set only the Budgets array
        } else {
          setError('تم استلام بيانات غير صالحة من الخادم');
        }
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        if (error.response && error.response.status === 401) {
          setError('التوكن منتهي الصلاحية أو غير صالح، يرجى تسجيل الدخول مرة أخرى');
          logout(); // Log out the user if token is invalid or expired
        } else {
          setError(error.message || 'ليس لديك صلحيات');
        }
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching completes
      }
    };

    fetchBudgets();
  }, [token, logout]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "budgets") {
      // Handle multiple selections for budgets (check/uncheck checkboxes)
      const updatedBudgets = checked
        ? [...userData.budgets, { budgetId: value, permission: 'edit' }] // Store permission
        : userData.budgets.filter(budget => budget.budgetId !== value);

      setUserData({
        ...userData,
        budgets: updatedBudgets,
      });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handlePermissionChange = (e, budgetId) => {
    const permission = e.target.value;
    setUserData({
      ...userData,
      budgets: userData.budgets.map(budget =>
        budget.budgetId === budgetId
          ? { ...budget, permission }
          : budget
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await createUser(userData, token);
      setSuccess(true);
      console.log('User created:', response);
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-page cccccc">
      <h2>Create New User</h2>

      {success && <Alert variant="success">User created successfully!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formRole">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            name="role"
            value={userData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formBudget">
          <Form.Label>Budget</Form.Label>
          {budgetOptions.map((budget) => (
            <Form.Check
              key={budget._id}
              type="checkbox"
              label={budget.name}
              value={budget._id}
              checked={userData.budgets.some(b => b.budgetId === budget._id)}
              onChange={handleChange}
              name="budgets"
            />
          ))}
        </Form.Group>

        {userData.budgets.length > 0 && userData.budgets.map((budget) => {
          return (
            <Form.Group controlId={`formPermission-${budget.budgetId}`} key={budget.budgetId}>
              <Form.Label>Permission for {budget.name}</Form.Label>
              <Form.Control
                as="select"
                value={budget.permission} // Default to 'edit'
                onChange={(e) => handlePermissionChange(e, budget.budgetId)}
              >
                <option value="edit">Edit</option>
                <option value="view">View</option>
              </Form.Control>
            </Form.Group>
          );
        })}

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" />
              Creating...
            </>
          ) : (
            'Create User'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default CreateUserPage;
