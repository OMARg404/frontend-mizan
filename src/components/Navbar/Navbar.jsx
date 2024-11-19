import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faMoneyBill, faTachometerAlt, faEnvelopeOpenText,
  faFileAlt, faUserShield, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const CustomNavbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const toggleNotifications = () => setShowNotifications(!showNotifications);

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    navigate("/");
  };

  return (
    <>
      <Navbar fixed="top" expand="lg" className="custom-navbar">
        <Container fluid="lg">
          <NavLink className="navbar-brand" to="/">
            <span>MIZAN</span>
          </NavLink>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="me-auto">
              <NavLinkItem to="/home" label="الصفحة الرئيسية" icon={faHome} />
              <NavLinkItem to="/budget" label="المزنيات" icon={faMoneyBill} />
              <NavLinkItem to="/incomingrequests" label="الطلبات الواردة" icon={faEnvelopeOpenText} />
              <NavLinkItem to="/dashboard" label="لوحة التحكم" icon={faTachometerAlt} />
              <NavLinkItem to="/reports" label="التقارير" icon={faFileAlt} />
              <NavLinkItem to="/userpermissions" label="أذونات المستخدم" icon={faUserShield} />
              <NavLinkItem to="/admin" label="الصفحة الإدارية" icon={faUserShield} />
              <Nav.Item>
                <Nav.Link onClick={handleLogout} className="nav-link">
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  <span className="arabic-text">تسجيل الخروج</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showNotifications && (
        <div className="notification-tab">
          <div className="notification-header">
            <h5>إشعارات</h5>
            <button className="close-btn" onClick={toggleNotifications}>X</button>
          </div>
          <ul className="notification-list">
            <li>تم تحديث البيانات بنجاح</li>
            <li>تذكير: لديك طلبات جديدة</li>
            <li>تم إرسال تقرير جديد</li>
          </ul>
        </div>
      )}
    </>
  );
};

const NavLinkItem = ({ to, label, icon }) => (
  <Nav.Item>
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
    >
      {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
      <span className="arabic-text">{label}</span>
    </NavLink>
  </Nav.Item>
);

export default CustomNavbar;
