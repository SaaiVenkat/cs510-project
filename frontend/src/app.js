import React,{useState} from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import DocumentCards from './components/home';
import SearchBar from './components/search';

const theme = createTheme({
});

function App() {
  const [searchTerm, setSearchTerm] = useState(''); 

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <SearchBar onSearch={handleSearch} />
        </div>
        <DocumentCards searchTerm={searchTerm} />
      </div>
    </ThemeProvider>
  );
}

export default App;