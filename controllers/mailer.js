const nodemailer =require('nodemailer');

const sendEmail =  async ({email, subject, text})=>{
    
const trasnporter = nodemailer.createTransport({
  
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false, // Only for testing, not recommended for production
    },
});



    const mailoptions ={
        from: 'store App<shrutee98550@gmail.com>',
        to:email,
        subject: subject,
        text:text
    };

   await trasnporter.sendMail(mailoptions);
}

module.exports = sendEmail;