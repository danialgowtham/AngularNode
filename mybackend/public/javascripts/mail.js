//for mail
const nodemailer = require('nodemailer');

module.exports = {
 transporter : nodemailer.createTransport({
    host: 'smtp.live.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'gowdham.kasi@hindujatech.com', // generated ethereal user
        pass: 'ZXCVBN@123' // generated ethereal password
    }
})
}