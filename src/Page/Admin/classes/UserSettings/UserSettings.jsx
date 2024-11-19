import React, { useState, useEffect } from 'react';
import { updateUser, getUsers, deleteUser } from '../../../../services/api';
import { Button, Card, ListGroup, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UserSettings.css';

const UserSettings = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }
    
      try {
        const response = await getUsers(token);
        if (response && Array.isArray(response.users)) {
          setUsers(response.users); 
        } else {
          console.error('Expected users array, but got:', response);
          setUsers([]); 
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    try {
      await deleteUser(userId, token);
      console.log('User deleted:', userId);
      // Update state to remove the deleted user from the UI
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleSaveUser = async (updatedUserData) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    try {
      // Clean up the user data by removing unwanted fields like __v, updatedAt
      const { updatedAt, __v, ...cleanUserData } = updatedUserData;
      
      // Ensure budgetId is a string
      const updatedUserDataCleaned = {
        ...cleanUserData,
        budgets: cleanUserData.budgets.map((budget) => ({
          ...budget,
          budgetId: String(budget.budgetId), // Convert to string
        })),
      };

      await updateUser(updatedUserDataCleaned._id, updatedUserDataCleaned, token);
      console.log('User updated:', updatedUserDataCleaned);
      // Update the user list with the updated user data
      setUsers(users.map((user) => user._id === updatedUserDataCleaned._id ? updatedUserDataCleaned : user));
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div className="user-settings-page">
      <h2>إعدادات المستخدم</h2>
      <div className="user-list-container">
        <div className="user-list">
          {users.length > 0 ? (
            users.map((user) => (
              <UserCard key={user._id} user={user} onSave={handleSaveUser} onDelete={handleDeleteUser} />
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

const UserCard = ({ user, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ ...user });

  const handleEditUser = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUserData({ ...user }); // Revert to original user data
  };

  const handleSaveUser = () => {
    onSave(userData);  // Pass updated user data to parent
    setIsEditing(false);
  };

  const handleDeleteUser = () => {
    onDelete(user._id);  // Pass user ID to parent for deletion
  };

  return (
    <div className="user-settings-container">
      <Card className="user-card">
        <Card.Body>
          <Card.Title>{user.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Role:</strong> {isEditing ? (
              <Form.Control 
                type="text" 
                value={userData.role}
                onChange={(e) => setUserData({ ...userData, role: e.target.value })}
              />
            ) : user.role}</ListGroup.Item>
            <ListGroup.Item><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</ListGroup.Item>
            <ListGroup.Item><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleDateString()}</ListGroup.Item>
            <ListGroup.Item>
              <strong>Budgets:</strong>
              {user.budgets && user.budgets.length > 0 ? (
                <ul>
                  {user.budgets.map((budget, index) => (
                    <li key={index}>
                      {budget.budgetId ? budget.budgetId.name : 'No Budget Name'} - {budget.permission}
                    </li>
                  ))}
                </ul>
              ) : (
                'No budgets assigned'
              )}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
        <Card.Footer>
          {isEditing ? (
            <>
              <Button variant="primary" onClick={handleSaveUser}>Save</Button>
              <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={handleEditUser}>Update</Button>
              <Button variant="danger" onClick={handleDeleteUser}>Delete</Button>
            </>
          )}
        </Card.Footer>
      </Card>
    </div>
  );
};

export default UserSettings;
