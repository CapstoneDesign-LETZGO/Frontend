export const getToken = () => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
        const parsedToken = JSON.parse(userToken);
        return parsedToken.accessToken || null;
    }
    return null;
};
