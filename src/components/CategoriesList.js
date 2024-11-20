import React from "react";
import { Link } from "react-router-dom";
import config from '../config.json';
import "./CategoriesList.css"; // Import CSS for styling

const CategoriesList = () => {
  return (
    <div className="categories-list">
      <div className="categories-container">
        {config.categories.map((category) => (
          <Link
            to={`/showcat/${category.name}`} // Route to showcat page with category name
            key={category.name}
            className="category-link"
          >
            <button className="btn btn-primary category-button">
              {category.card_back_txt} ({category.count.split(" ")[0]})
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
