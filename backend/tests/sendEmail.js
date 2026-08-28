const {sendEMail} = require("../utils/mailer");

const testEmail = async() => {
    try {
        await sendEMail(
            {
                to : "subiyan819@gmail.com",
                subject : "Poorvika Mail Test",
                text : "Nodemailer is working"
            }
        );

        console.log("email sent successfully")
    }
    catch(err){
        console.error("email sending is failed");
    }
};

testEmail();