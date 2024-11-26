import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../config.json";
import "../styles/CategoriesList.css"; // Import CSS for styling

const CategoriesList = () => {
  const [wordCounts, setWordCounts] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch word counts dynamically
  useEffect(() => {
    const fetchWordCounts = async () => {
      const counts = {};
      try {
        for (const category of config.categories) {
          const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${category.fileName}`);
          const data = await response.json();
          counts[category.name] = data.length; // Count words in the file
        }
      } catch (error) {
        console.error("Error loading word counts:", error);
      } finally {
        setWordCounts(counts);
        setLoading(false); // Update loading state
      }
    };

    fetchWordCounts();
  }, []);

  return (
    <div className="categories-container">
      {loading ? (
        <div className="loading-indicator">กำลังโหลด...</div>
      ) : (
        config.categories.map((category) => (
          <Link
            to={`/showcat/${category.name}`} // Route to showcat page with category name
            key={category.name}
            className="category-link"
          >
            <button className="category-button medium-button">
              <div className="button-content">
                <i className="fas fa-tag category-icon medium-icon"></i> {/* Tag Icon */}
                <span>{category.displayName} ({wordCounts[category.name] || "N/A"})</span>
              </div>
            </button>
          </Link>
        ))
      )}
    </div>
  );
};

export default CategoriesList;
