import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCog, faUsers, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-container">
      <div className="container-fluid">
        <div className="row w-100">
          <div className="col-6 mb-4">
            <button 
              className="btn btn-custom w-100"
              onClick={() => handleButtonClick('/admin/settings/admins')}
            > 
              <FontAwesomeIcon icon={faMoneyBillWave} className="icon" />
              <span> أضافة ميزانية جديدة</span>
            </button>
          </div>
          <div className="col-6 mb-4">
            <button 
              className="btn btn-custom w-100"
              onClick={() => handleButtonClick('/admin/settings/users')}
            >
              <FontAwesomeIcon icon={faUsers} className="icon" />
              <span> أعدادات المستخدمين</span>
            </button>
          </div>
          <div className="col-6 mb-4">
            <button 
              className="btn btn-custom w-100"
              onClick={() => handleButtonClick('/admin/settings/organizational-structure')}
            >
              <FontAwesomeIcon icon={faPlusCircle} className="icon" />
              <span> اضافة مستخدم جديد</span>
            </button>
          </div>
          <div className="col-6 mb-4">
            <button 
              className="btn btn-custom w-100"
              onClick={() => handleButtonClick('/admin/settings/departments')}
            >
              <FontAwesomeIcon icon={faCog} className="icon" />
              <span> أعدادات المزانيات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
