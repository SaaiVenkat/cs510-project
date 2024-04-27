import React,{useState} from 'react';
import { Box, ThemeProvider, createTheme,Grid } from '@mui/material';
import DocumentCards from './components/home';
import SearchBar from './components/search';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginButton from './components/googlelogin';
import { alignProperty } from '@mui/material/styles/cssUtils';

const theme = createTheme({
});

function App() {
  const [searchTerm, setSearchTerm] = useState(''); 

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
      <GoogleOAuthProvider clientId='510120414480-jg4crd6htmmbbihk1sdhp4sbkg5rtve6.apps.googleusercontent.com'>
          <div className="App">
            <Grid container spacing={0}>
              <Grid item xs={3} justifyContent="center" alignItems="center">
                <Box display="flex" justifyContent="center" alignItems="center" style={{ height: 50 }}>
                  <img src='../src/assets/logo.png'/>
                </Box>
              </Grid>
              <Grid item xs={6} justifyContent="center" alignItems="center">
                <Box display="flex" justifyContent="center" alignItems="center" style={{ height: 50 }}>
                  <SearchBar onSearch={handleSearch} />
                </Box>
              </Grid>
              <Grid item xs={3} justifyContent="center" alignItems="center">
                <Box display="flex" justifyContent="center" alignItems="center" style={{ height: 50 }}>
                  <GoogleLoginButton />
                </Box>
              </Grid>
            </Grid>
            <DocumentCards searchTerm={searchTerm} />
          </div>
      </GoogleOAuthProvider>
  );
}

export default App;