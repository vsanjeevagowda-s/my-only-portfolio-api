var express = require("express");
var app = express();
const cors = require("cors");
const expressValidator = require("express-validator");
var bodyParser = require("body-parser");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cors());
app.options("*", cors());

var port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ data: "Welcome" });
});

app.post("/api/send-mail", async (req, res) => {
  try {
    req.assert("email", "Please provide a valid email.").isEmail();
    req.assert("name", "Please provide a valid name.").notEmpty();
    req.assert("message", "Please provide a message").notEmpty();
    const errors = req.validationErrors();

    if (errors) {
      throw new Error(errors[0].msg);
    }

    const msg = {
      to: process.env.TO_EMAIL_ADDRESS,
      from: req.body.email,
      subject: "My-Portfolio - Contact",
      text: req.body.message,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      throw new Error('Failed to send message Please try after some time.');
    }

    res.json({ message: "Thank you for your message. Lets discuss soon..." });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

app.listen(port);
console.log("Server started at: localhost:" + port);
