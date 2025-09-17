require("dotenv").config();
const nodemailer = require('nodemailer');
const multiparty = require('multiparty');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport( {
    host: "smtp.gmail.com",
    secureConnection: true,
    TLS: true,
    port: 587,
    auth: {
        user: process.env.USERNAME,
        pass: process.env.PASSWORD
    },
});

router.post("/", (req, res) => {
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function (err, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error parsing form data." });
        }
        Object.keys(fields).forEach(function (property) {
            data[property] = fields[property].toString();
        });

        const mail = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: `Message from ${data.email}: ${data.subject}`,
            text: `${data.message}`,
        };

        transporter.sendMail(mail, (err, info) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Something went wrong." });
            } else {
                return res.status(200).json({ message: "Email received!" });
            }
        });
    });
});

module.exports = router;