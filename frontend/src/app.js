import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import { Box, Grid } from '@mui/material';
import DocumentCards from './components/home';
import SearchBar from './components/search';
import GoogleLoginButton from './components/googlelogin';
import logo from './assets/logo.png';
import { store, persistor } from './redux/store';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId='510120414480-jg4crd6htmmbbihk1sdhp4sbkg5rtve6.apps.googleusercontent.com'>
          <div className="App">
            <Grid container spacing={0} height={1}>
              <Grid item xs={3} justifyContent="center" alignItems="center">
                <Box display="flex" justifyContent="center" alignItems="center" style={{ height: 50 }}>
                  <img src={logo} style={{ height: 50 }} alt="Logo" />
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
      </PersistGate>
    </Provider>
  );
}
export default App;