import React from 'react';
import { GoogleAuth, GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';

const GoogleLoginButton = () => {
    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log(tokenResponse)
            fetchUserProfile(tokenResponse.access_token)
        },
    });


    const fetchUserProfile = (accessToken) => {
        return fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                return response.json();
            })
            .then(profileData => {
                console.log('User Profile:', profileData);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    };

    return (


        <Button onClick={() => login()} variant='contained' color='primary'>Sign in with Google 🚀</Button>
    );
};

export default GoogleLoginButton;