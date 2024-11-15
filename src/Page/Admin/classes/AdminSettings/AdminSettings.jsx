import React, { useState, useEffect, useContext } from 'react';
import { createUser, getBudgets, getCredits } from '../../../../services/api';
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminSettings.css';

const AdminSettings = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State variables
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Log token to check if it's valid
  console.log('Token:', token);

  // Fetch admins from the API
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        console.log('جاري جلب المدراء...');
        const response = await getBudgets(token); // Assuming getBudgets fetches admin data, update if incorrect
        console.log('المدراء:', response); // Log the response
        setAdmins(response);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'فشل في جلب المدراء');
        setLoading(false);
      }
    };

    if (token) {
      fetchAdmins(); // Only fetch if token exists
    } else {
      navigate('/admin'); // Redirect to login if no token
    }
  }, [token, navigate]);

  // Handle creating a new admin
  const handleCreateAdmin = async () => {
    try {
      const newAdminData = {
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
      };
      const response = await createUser(newAdminData, token); // Assuming createUser creates a new admin, update if incorrect
      setAdmins([...admins, response]);
      setNewAdmin({ name: '', email: '', password: '' });
      alert('تم إنشاء المدير بنجاح');
    } catch (err) {
      setError(err.message || 'فشل في إنشاء المدير');
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
        <h1 className="text-center my-4">إعدادات المدير</h1>
        <p className="text-center">
          هذه هي صفحة إعدادات المدير حيث يمكنك إدارة ميزات النظام الإدارية.
        </p>

        {/* Create New Admin Form */}
        <div className="create-admin-form">
          <h4>إنشاء مدير جديد</h4>
          <input
            type="text"
            placeholder="اسم المدير"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني للمدير"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="كلمة مرور المدير"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleCreateAdmin}>إنشاء مدير</button>
        </div>

        {/* List of Admins */}
        <div className="admin-list">
          <h4>كل المدراء</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan="2">لم يتم العثور على مدراء</td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id}>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
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

export default AdminSettings;
