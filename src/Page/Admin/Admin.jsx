import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="credits-container">
    <div className="container-fluid">
      <div className="row w-100">
        <div className="col-6 mb-4">
          <button 
            className="btn btn-primary btn-lg w-100"
            onClick={() => handleButtonClick('/admin/settings/admins')}
          >
          أعدادات الأدارين
          </button>
        </div>
        <div className="col-6 mb-4">
          <button 
            className="btn btn-primary btn-lg w-100"
            onClick={() => handleButtonClick('/admin/settings/users')}
          >
           أعدادات المستخدمين
          </button>
        </div>
        <div className="col-6 mb-4">
          <button 
            className="btn btn-primary btn-lg w-100"
            onClick={() => handleButtonClick('/admin/settings/organizational-structure')}
          >
        أعدادات الهيكل التنظيمي
          </button>
        </div>
        <div className="col-6 mb-4">
          <button 
            className="btn btn-primary btn-lg w-100"
            onClick={() => handleButtonClick('/admin/settings/departments')}
          >
          أعدادات المزانيات
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Admin;
