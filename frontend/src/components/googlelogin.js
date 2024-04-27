import React, { useEffect } from 'react';
import { Button, Avatar, Grid } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../actions/actions';

const GoogleLoginButton = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.login.isLoggedIn);
    const userAvatar = useSelector(state => state.login.userAvatar);
    const tokenExpiration = useSelector(state => state.login.tokenExpiration);
    const fetchUserProfile = (accessToken) => {
        fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
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
            dispatch(loginSuccess({ accessToken, expiration: Date.now() + 10 * 60 * 1000, userAvatar: profileData.picture }));
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('tokenExpiration', Date.now() + 10 * 60 * 1000);
            console.log(userAvatar);
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
    };
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpiration');
    };
    const checkTokenExpiration = () => {
        const expiration = localStorage.getItem('tokenExpiration');
        if (expiration && Date.now() > parseInt(expiration)) {
            handleLogout();
        }
    };
    useEffect(() => {
        checkTokenExpiration();
        const interval = setInterval(() => {
            if (Date.now() > tokenExpiration) {
                handleLogout();
            }
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, [tokenExpiration]);

    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            fetchUserProfile(tokenResponse.access_token);
        },
    });
    return (
        <Grid container spacing={2} alignItems="center">
            {isLoggedIn ? (
                <React.Fragment>
                    <Grid item>
                        <Avatar sx={{ width: 56, height: 56 }}>
                            <img src={userAvatar} alt="UA" />
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Button onClick={handleLogout} variant='contained' color='secondary'>Logout</Button>
                    </Grid>
                </React.Fragment>
            ) : (
                <Grid item>
                    <Button onClick={() => login()} variant='contained' color='primary'>Sign in with Google 🚀</Button>
                </Grid>
            )}
        </Grid>
    );
};
export default GoogleLoginButton;