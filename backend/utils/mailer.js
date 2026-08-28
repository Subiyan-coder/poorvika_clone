const nodemailer = require("nodemailer");
const {config} = require("../config/env");

const transporter = nodemailer.createTransport(
    {
        host : config.mail.host,
        port : Number(config.mail.port),
        secure : Number(config.mail.port) === 465,

        auth : {
            user : config.mail.user,
            pass : config.mail.password
        }
    }
);

const sendEMail = async({to, subject, text, html}) => {
    return transporter.sendMail(
        {
            from : config.mail.user,
            to,
            subject,
            text,
            html
        }
    );
};

module.exports = {sendEMail};