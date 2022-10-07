var nodemailer = require("nodemailer");



const sendMail = (email, uniqueString) =>{
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
        subject: 'Email Confirmation',
        html: `Press <a href=http://localhost:3000/verify/${uniqueString}> here </a> to verify your email, ThankYou`
          //const token = createToken(user._id);
         // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
     
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
