import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMoneyBill, faCreditCard, faTachometerAlt, faEnvelopeOpenText, faFileAlt, faClipboard, faUserShield, faUserCog, faBell } from '@fortawesome/free-solid-svg-icons'; // Added faBell for notification icon
import './Navbar.css'; // Import custom CSS for styles
import DigitalClock from './DigitalClock'; // Make sure to import the DigitalClock component

const CustomNavbar = () => {
  // State to handle notification tab visibility
  const [showNotifications, setShowNotifications] = useState(false);

  // Toggle notification tab visibility
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  return (
    <>
      <Navbar fixed="top" expand="lg" className="custom-navbar">
        <Container fluid="lg">
          <Row style={{ width: '100%' }}>
            <Col xs={12} sm="auto">
              <NavLink className="navbar-brand" to="">
                <span>MIZAN</span>
              </NavLink>
            </Col>
            <Col xs={12} sm="auto" className="ms-auto d-flex justify-content-end align-items-center cc">
              <DigitalClock />
            </Col>
          </Row>
        </Container>
      </Navbar>

      <Navbar fixed="top" expand="lg" className="custom-navbar" style={{ top: '56px' }}>
        <Container fluid="lg">
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="me-auto">
              <NavLinkItem to="/home" label="الصفحة الرئيسية" icon={faHome} />
              <NavLinkItem to="/budget" label="الميزانية" icon={faMoneyBill} />
              <NavLinkItem to="/credits" label="الإعتمادات" icon={faCreditCard} />
              <NavLinkItem to="/dashboard" label="لوحة التحكم" icon={faTachometerAlt} />
              <NavLinkItem to="/incomingrequests" label="الطلبات الواردة" icon={faEnvelopeOpenText} />
              <NavLinkItem to="/reports" label="التقارير" icon={faFileAlt} />
              <NavLinkItem to="/requests" label="الطلبات" icon={faClipboard} />
              <NavLinkItem to="/userpermissions" label="أذونات المستخدم" icon={faUserShield} />
              <NavLinkItem to="/admin" label="الصفحة الإدارية" icon={faUserCog} />
              
              {/* Notification Icon */}
              <Nav.Item>
                <span className="nav-link" onClick={toggleNotifications}>
                  <FontAwesomeIcon icon={faBell} className="me-2" />
                  <span className="arabic-text">الإشعارات</span>
                </span>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Notification Tab Overlay */}
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
      <FontAwesomeIcon icon={icon} className="me-2" />
      <span className="arabic-text">{label}</span>
    </NavLink>
  </Nav.Item>
);

export default CustomNavbar;
