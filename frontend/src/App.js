import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import { store, persistor } from './redux/store';
import Homepage from './views/Homepage';
import Navbar from './components/Navbar';


function App() {


    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <GoogleOAuthProvider clientId='510120414480-jg4crd6htmmbbihk1sdhp4sbkg5rtve6.apps.googleusercontent.com'>
                    <div className="App">
                        <Navbar />
                        <Homepage />
                    </div>
                </GoogleOAuthProvider>
            </PersistGate>
        </Provider>
    );
}
export default App;