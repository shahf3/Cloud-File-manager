// components/SearchBar.js
import React from "react";

function SearchBar({ searchQuery, setSearchQuery }) {
  const handleInputChange = (e) => {
    const query = e.target.value;
    console.log("Search Query:", query); // Debugging line
    if (setSearchQuery) {
      setSearchQuery(query);
    } else {
      console.error("setSearchQuery is not defined");
    }
  };

  return (
    <div className="p-4 bg-gray-200 rounded-md">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
