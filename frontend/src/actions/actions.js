import { LOGIN_SUCCESS, LOGOUT } from './actionTypes';
export const loginSuccess = (userData) => {
    return {
        type: LOGIN_SUCCESS,
        payload: userData
    };
};
export const logout = () => {
    return {
        type: LOGOUT
    };
};