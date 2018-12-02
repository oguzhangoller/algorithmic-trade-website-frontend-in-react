export const loggedIn = () => {
    return {
        type: 'LOGGED_IN'
    };
}

export const loggedOut = () => {
    localStorage.removeItem('jwtToken');
    return {
        type: "LOGGED_OUT"
    };
}