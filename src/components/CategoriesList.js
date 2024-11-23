import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from '../config.json';
import "./CategoriesList.css"; // Import CSS for styling

const CategoriesList = () => {
  const [wordCounts, setWordCounts] = useState({});

  // Fetch word counts dynamically
  useEffect(() => {
    const fetchWordCounts = async () => {
      const counts = {};
      for (const category of config.categories) {
        try {
          const response = await fetch(`${process.env.PUBLIC_URL}/vocab-data/${category.fileName}`);
          const data = await response.json();
          counts[category.name] = data.length; // Count words in the file
        } catch (error) {
          console.error(`Error loading data for ${category.name}:`, error);
        }
      }
      setWordCounts(counts);
    };

    fetchWordCounts();
  }, []);

  return (
    <div className="categories-list">
      <div className="categories-container">
        {config.categories.map((category) => (
          <Link
            to={`/showcat/${category.name}`} // Route to showcat page with category name
            key={category.name}
            className="category-link"
          >
            <button className="category-button">
              {category.displayName} ({wordCounts[category.name] || "N/A"}) {/* Use displayName for Thai */}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
