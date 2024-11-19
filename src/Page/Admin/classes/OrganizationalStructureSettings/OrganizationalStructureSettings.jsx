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
      console.log('تم إنشاء المستخدم:', response);
    } catch (err) {
      setError('فشل في إنشاء المستخدم');
      console.error('خطأ في إنشاء المستخدم:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-page cccccc">
      <h2>إنشاء مستخدم جديد</h2>

      {success && <Alert variant="success">تم إنشاء المستخدم بنجاح!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>الاسم</Form.Label>
          <Form.Control
            type="text"
            placeholder="أدخل الاسم"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>البريد الإلكتروني</Form.Label>
          <Form.Control
            type="email"
            placeholder="أدخل البريد الإلكتروني"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>كلمة المرور</Form.Label>
          <Form.Control
            type="password"
            placeholder="أدخل كلمة المرور"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formRole">
          <Form.Label>الدور</Form.Label>
          <Form.Control
            as="select"
            name="role"
            value={userData.role}
            onChange={handleChange}
          >
            <option value="user">مستخدم</option>
            <option value="admin">مدير</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formBudget">
          <Form.Label>الميزانية</Form.Label>
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
              <Form.Label>صلاحيات لـ {budget.name}</Form.Label>
              <Form.Control
                as="select"
                value={budget.permission} // Default to 'edit'
                onChange={(e) => handlePermissionChange(e, budget.budgetId)}
              >
                <option value="edit">تعديل</option>
                <option value="view">عرض</option>
              </Form.Control>
            </Form.Group>
          );
        })}

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" />
              جاري الإنشاء...
            </>
          ) : (
            'إنشاء مستخدم'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default CreateUserPage;
