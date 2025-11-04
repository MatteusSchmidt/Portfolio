require("dotenv").config();
const nodemailer = require('nodemailer');
const multiparty = require('multiparty');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // --- ADDED ---

router.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secureConnection: true,
    TLS: true,
    port: 587,
    auth: {
        user: process.env.USERNAME,
        pass: process.env.PASSWORD
    },
});

const formLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { error: 'Too many submissions, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: true,
});

router.get("/", (req, res) => {
    res.status(200).send("OK"); // Respond with a 200 OK
});

router.post("/", formLimiter, (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`[FORM REQUEST] Received from IP: ${clientIp}`);

    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function (err, fields) {
        if (err) {
            console.error(`[FORM PARSE ERROR] IP: ${clientIp} | Error: ${err.message}`);
            return res.status(500).json({ error: "Error parsing form data." });
        }

        Object.keys(fields).forEach(function (property) {
            data[property] = fields[property].toString();
        });

        console.log(`[FORM PARSED] IP: ${clientIp} | From: ${data.email} | Subject: ${data.subject.substring(0, 50)}...`);

        const mail = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: `Message from ${data.email} (IP: ${clientIp}): ${data.subject}`,
            text: `${data.message}`,
        };

        transporter.sendMail(mail, (err, info) => {
            if (err) {
                console.error(`[MAIL ERROR] IP: ${clientIp} | Error: ${err.message}`);
                return res.status(500).json({ error: "Something went wrong." });
            } else {
                return res.status(200).json({ message: "Email received!" });
            }
        });
    });
});

module.exports = router;