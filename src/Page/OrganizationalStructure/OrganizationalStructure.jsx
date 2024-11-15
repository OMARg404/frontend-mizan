import React, { useEffect, useState, useContext } from "react";
import "./OrganizationalStructure.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getAllAdministrativeUnits } from "../../services/api"; // Import the API functions
import { AuthContext } from "../../context/AuthContext"; // Import the AuthContext
import { Spinner } from 'react-bootstrap'; // Import Spinner from React-Bootstrap

const OrganizationalStructure = () => {
  const { token } = useContext(AuthContext); // Get the token from AuthContext
  const [searchTerm, setSearchTerm] = useState(""); // To handle search input
  const [structureData, setStructureData] = useState([]); // To store structure data
  const [expandedItems, setExpandedItems] = useState({}); // To manage expanded/collapsed items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for handling errors

  // Fetch the structure data when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          setError("No token found, please log in.");
          setLoading(false);
          return;
        }
        const data = await getAllAdministrativeUnits(token); // Fetch data from API
        setStructureData(data); // Set the data in state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data: ", error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data.message : "Failed to fetch data.");
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchData();
  }, [token]);

  // Toggle expand/collapse for the units
  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Render the structure items
  const renderStructure = (data) => {
    return data.map((item, index) => {
      const isOpen = expandedItems[index];

      // Check if the item matches the search term
      if (
        (item.name && item.name.includes(searchTerm)) ||
        (item.description && item.description.includes(searchTerm))
      ) {
        return (
          <div key={item._id} className="org-card">
            <div
              onClick={() => toggleExpand(index)}
              className="org-item-header"
              aria-expanded={isOpen}
            >
              <h3 className="org-item-name">{item.name}</h3>
              <FontAwesomeIcon
                icon={isOpen ? faChevronDown : faChevronRight}
                className="toggle-icon"
              />
            </div>
            <p className="org-item-description">{item.description}</p>
            {/* If the unit has sub-units, display them */}
            {item.subUnits && item.subUnits.length > 0 && isOpen && (
              <div className="children">{renderStructure(item.subUnits)}</div>
            )}
          </div>
        );
      }
      return null;
    });
  };

  // Handle search functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Update the search term
  };

  return (
    <div className="organizational-structure-container">
      <h2>الهيكل التنظيمي</h2>
      
      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="ابحث عن وحدة"
          className="form-control"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" variant="primary" size="lg" />
          <h4>جاري تحميل البيانات...</h4>
        </div>
      ) : error ? (
        // Show error message if there was an error fetching data
        <div className="error-container">
          <h4>{error}</h4>
        </div>
      ) : (
        // Display the organizational structure once loading is complete
        <div className="org-structure-list">
          {renderStructure(structureData)}
        </div>
      )}
    </div>
  );
};

export default OrganizationalStructure;
