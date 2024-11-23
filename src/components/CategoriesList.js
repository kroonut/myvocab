import React from "react";
import { Link } from "react-router-dom";
import config from '../config.json';
import "./CategoriesList.css"; // Import CSS for styling

const CategoriesList = () => {
  return (
    <div className="categories-list">
      <h2>หมวดหมู่คำศัพท์</h2> {/* Thai heading for categories */}
      <div className="categories-container">
        {config.categories.map((category) => (
          <Link
            to={`/showcat/${category.name}`} // Route to showcat page with category name
            key={category.name}
            className="category-link"
          >
            <button className="category-button">
              {category.displayName} ({category.count.split(" ")[0]}) {/* Use displayName for Thai */}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
