var nodemailer = require("nodemailer");



const sendMail = (email, uniqueString) =>{
    console.log("E: "+ email +" U: "+uniqueString);
    var Transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "studenteria12@gmail.com",
            pass: "AhmedAqib@12"
        }
    });
    var mailOptions;
    let sender = "studenteria12@gmail.com";
    mailOptions = {
        from: 'studenteria12@gmail.com',
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