import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    onSearch(searchTerm);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        id="search-bar"
        placeholder="What's up?"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button type="button" id="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;