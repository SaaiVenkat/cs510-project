import React, { useEffect } from 'react';
import { Button, Avatar, Grid } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../actions/actions';
import axios from 'axios'
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
                signinUserWithBackend(profileData)
                dispatch(loginSuccess({ accessToken, expiration: Date.now() + 10 * 60 * 1000, userAvatar: profileData.picture }));
                // localStorage.setItem('accessToken', accessToken);
                // localStorage.setItem('tokenExpiration', Date.now() + 10 * 60 * 1000);
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
    const signinUserWithBackend = (gData) => {

        // Define your data object
        const data = {
            name: gData.name,
            g_id: gData.id,
            email: gData.email,
            picture: gData.picture
        };

        // Make the Axios POST request
        axios.post('http://127.0.0.1:8000/signin', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                // Handle success
                console.log('Response:', response.data);
                localStorage.setItem('token', response.data.response);
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            });
    }
    return (
        <Grid container spacing={2} alignItems="center">
            {isLoggedIn ? (
                <React.Fragment>
                    <Grid item>
                        {/* <Avatar sx={{ width: 40, height: 40 }}>
                            <img src={userAvatar} alt="UA" />
                        </Avatar> */}
                        <button
                            data-ripple-light="true"
                            data-popover-target="menu"
                            class="middle none center mr-3 rounded-lg bg-gradient-to-tr from-pink-600 to-pink-400 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Open Menu
                        </button>
                        <ul
                            role="menu"
                            data-popover="menu"
                            data-popover-placement="bottom"
                            class="absolute z-10 min-w-[180px] overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
                        >
                            <li
                                role="menuitem"
                                class="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                            >
                                Menu Item 1
                            </li>
                            <li
                                role="menuitem"
                                class="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                            >
                                Menu Item 2
                            </li>
                            <li
                                role="menuitem"
                                class="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                            >
                                Menu Item 3
                            </li>
                        </ul>
                        <div class="w-full pt-5 px-4 mb-8 mx-auto ">
                            <div class="text-sm text-gray-700 py-1">
                                Made with <a class="text-gray-700 font-semibold" href="https://www.material-tailwind.com/docs/html/menu?ref=tailwindcomponents" target="_blank">Material Tailwind</a> by <a href="https://www.creative-tim.com?ref=tailwindcomponents" class="text-gray-700 font-semibold" target="_blank"> Creative Tim</a>.
                            </div>
                        </div>


                        <link
                            rel="stylesheet"
                            href="https://unpkg.com/@material-tailwind/html@latest/styles/material-tailwind.css"
                        />

                        <script
                            type="module"
                            src="https://unpkg.com/@material-tailwind/html@latest/scripts/popover.js"
                        ></script>

                        <script src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"></script>
                    </Grid>
                </React.Fragment>
            ) : (
                <Grid item>
                    {/* <Button onClick={() => login()} variant='contained' color='primary'>Sign in with Google 🚀</Button> */}
                    <button
                        onClick={() => login()}
                        class=" flex justify-between items-center middle none center mr-3 rounded-lg border border-black-500 py-3 px-6 font-sans text-xs font-bold uppercase text-black-500 transition-all hover:opacity-75 focus:ring focus:ring-pink-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        data-ripple-dark="true"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                        <div class="ml-2">
                            Signin
                        </div>
                    </button>
                </Grid>
            )}
        </Grid>
    );
};
export default GoogleLoginButton;