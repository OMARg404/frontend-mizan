import React, { useState, useContext } from 'react';
import { createUser } from '../../../../services/api'; // Removed getAllUsers import
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserSettings.css';

const UserSettings = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State variables
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle creating a new user
  const handleCreateUser = async () => {
    try {
      setLoading(true); // Set loading to true while the request is being made
      const newUserData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      };
      const response = await createUser(newUserData, token);
      setNewUser({ name: '', email: '', password: '' }); // Reset form after successful creation
      alert('تم إنشاء المستخدم بنجاح');
      setLoading(false); // Set loading to false after the request is completed
    } catch (err) {
      setError(err.message || 'فشل في إنشاء المستخدم');
      setLoading(false); // Set loading to false if an error occurs
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
      </div>
    </div>
  );
};

export default UserSettings;
