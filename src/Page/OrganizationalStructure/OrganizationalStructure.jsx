import React, { useEffect, useState } from "react";
import "./OrganizationalStructure.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getAllAdministrativeUnits } from "../../services/api"; // Import the API functions

const OrganizationalStructure = () => {
  const [searchTerm, setSearchTerm] = useState(""); // To handle search input
  const [structureData, setStructureData] = useState([]); // To store structure data
  const [expandedItems, setExpandedItems] = useState({}); // To manage expanded/collapsed items

  // Fetch the structure data when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("jwtToken")); // Get token from localStorage
        if (!token) {
          alert("No token found, please log in.");
          return;
        }
        const data = await getAllAdministrativeUnits(token); // Fetch data from API
        setStructureData(data); // Set the data in state
      } catch (error) {
        console.error("Error fetching data: ", error.response ? error.response.data : error.message);
        alert("Failed to fetch data: " + (error.response ? error.response.data.message : "Server error."));
      }
    };

    fetchData();
  }, []);

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
            <div onClick={() => toggleExpand(index)} className="org-item-header">
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
    <>
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

        {/* Display the organizational structure */}
        <div className="org-structure-list">
          {renderStructure(structureData)}
        </div>
      </div>
    </>
  );
};

export default OrganizationalStructure;
