import React, { useState, useEffect } from 'react';
import { deleteUser, getUsers } from '../../../../services/api'; // Ensure these functions are correctly imported
import { Button, Card, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UserSettings.css';

const UserSettings = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const [deleting, setDeleting] = useState(false); // Added deleting state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }

      try {
        const response = await getUsers(token);
        if (response && Array.isArray(response.users)) {
          setUsers(response.users); // Set the users state
        } else {
          setError('Expected users array, but got something else');
          setUsers([]); // Reset the users list in case of error
        }
      } catch (error) {
        setError('Failed to fetch users');
        setUsers([]); // Reset the users list in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Handle deleting the user by their ID
  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }
  
    const loggedInUserId = parseJwt(token)._id; // Assuming the JWT has an _id field for the logged-in user
  
    // Check if the user to be deleted is the logged-in user (owner of the token)
    if (userId === loggedInUserId) {
      setError('You cannot delete yourself.');
      return;
    }
  
    setDeleting(true); // Set deleting to true to show loading state
  
    try {
      const result = await deleteUser(userId, token);
      // Adjust condition based on response's `msg` field
      if (result.msg === 'success') {
        console.log('User deleted:', userId);
        setUsers(users.filter((user) => user._id !== userId)); // Update state after deletion
      } else {
        console.log('Delete user result:', result); // Log the result for further inspection
        setError('Failed to delete user.');
      }
    } catch (error) {
      console.error('Delete user error:', error); // Log full error details
      setError(error.response ? error.response.data : 'Failed to delete user');
    } finally {
      setDeleting(false); // Reset deleting state after operation is done
    }
  };
  
  

  if (loading) {
    return <Spinner animation="border" />; // Show loading spinner while fetching data
  }

  return (
    <div className="user-settings-page nana">
      <h2>إعدادات المستخدم</h2>
      <div className="user-list-container">
        {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
        <div className="user-list">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id}>
                <UserCard user={user} handleDeleteUser={handleDeleteUser} />
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

const UserCard = ({ user, handleDeleteUser, deleting }) => {
  return (
    <div className="user-settings-container">
      <Card className="user-card">
        <Card.Body>
          <Card.Title>{user.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Role:</strong> {user.role}</ListGroup.Item>
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
          {/* Conditionally render the delete button based on deleting state */}
          <Button variant="danger" onClick={() => handleDeleteUser(user._id)} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};


// Helper function to decode JWT token
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT", error);
    return {};
  }
};

export default UserSettings;
