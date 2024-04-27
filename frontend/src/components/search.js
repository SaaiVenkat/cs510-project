import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import './home.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    onSearch(searchTerm);
  };

  return (
    <div className="search-container">
      <TextField
        type="text"
        id="search-bar"
        placeholder="What's up?"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;