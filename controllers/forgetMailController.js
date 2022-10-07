var nodemailer = require("nodemailer");

const sendMail = (email, password, uniqueString) =>{
    console.log("E: "+ email +" U: "+uniqueString);
    var Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "your@email.com",
            pass: "yourpassword"
        }
    });
    var mailOptions;
    let sender = "your@email.com";
    mailOptions = {
        from: 'your@email.com',
        to: email,
        subject: 'Password Reset',
        html: `To reset your existing password to ${password} <a href=http://localhost:3000/changepass/${uniqueString}/${password}> click here </a>  ThankYou`
    };

    Transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log("EMAIL: "+error);
        }
        else{
            console.log("Message Sent");
        }
    });
}

module.exports = sendMail;
