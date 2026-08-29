const setAuthCookies = (res, accessToken, refreshToken) => {

    res.cookie("accessToken", accessToken, {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "lax"
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "lax"
    });
};

const clearAuthCookies = (res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
}

module.exports = {setAuthCookies, clearAuthCookies};