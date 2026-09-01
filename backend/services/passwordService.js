const bcrypt = require("bcryptjs");
const {config} = require("../config/env");

const hashPassword = async (password) => {
    return bcrypt.hash(password, config.bcrypt.saltRounds);
};

const verifyPassword = async (password, passwordhash) =>{
    return bcrypt.compare(password, passwordhash);
};

module.exports = {hashPassword, verifyPassword};