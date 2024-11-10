import React, { useEffect, useState, useContext } from 'react';
import { createUser, getAllUsers } from '../../../../services/api';
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserSettings.css';

const UserSettings = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State variables
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Log token to check if it's valid
  console.log('Token:', token);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('جاري جلب المستخدمين...');
        const response = await getAllUsers(token);
        console.log('المستخدمين:', response); // Log the response
        setUsers(response);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'فشل في جلب المستخدمين');
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers(); // Only fetch if token exists
    } else {
      navigate('/login'); // Redirect to login if no token
    }
  }, [token, navigate]);

  // Handle creating a new user
  const handleCreateUser = async () => {
    try {
      const newUserData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      };
      const response = await createUser(newUserData, token);
      setUsers([...users, response]);
      setNewUser({ name: '', email: '', password: '' });
      alert('تم إنشاء المستخدم بنجاح');
    } catch (err) {
      setError(err.message || 'فشل في إنشاء المستخدم');
    }
  };

  // Handle loading and error states
  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div>خطأ: {error}</div>;
  }

  return (
    <div className="admin-settings-page-container">
      <div className="container-fluid">
        <h1 className="text-center my-4">إعدادات المستخدم</h1>
        <p className="text-center">
          هذه هي صفحة إعدادات المستخدم حيث يمكنك إدارة بيانات المستخدمين.
        </p>

        {/* Create New User Form */}
        <div className="create-admin-form">
          <h4>إنشاء مستخدم جديد</h4>
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني للمستخدم"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="كلمة مرور المستخدم"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleCreateUser}>إنشاء مستخدم</button>
        </div>

        {/* List of Users */}
        <div className="admin-list">
          <h4>كل المستخدمين</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="2">لم يتم العثور على مستخدمين</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
