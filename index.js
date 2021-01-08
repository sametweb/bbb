require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const server = require("./server");
const extractName = require("./utils/extractName");

const months = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "October",
  11: "November",
  12: "December",
};

const formatDate = (date) => {
  return (
    months[date.substr(5, 2)] +
    " " +
    date.substr(8, 2) +
    ", " +
    date.substr(0, 4)
  );
};

const fs = require("fs");

const imgPath = "/img/";
const cssPath = "/css/";
const optimizedPath = imgPath + "optimized/JPEG/";
const imgDir = __dirname + optimizedPath;

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(__dirname + cssPath));
server.use(express.static(__dirname + imgPath));
server.use(express.static(__dirname + optimizedPath));

let page = "";
let images = "";

fs.promises
  .readdir(imgDir)
  .then((files) => {
    for (file of files) {
      images += `<div class="image"><img src="${file}" alt="${extractName(
        file
      )}" /></div>`;
    }
    return images;
  })
  .catch(console.log)
  .finally(() => {
    fs.readFile(__dirname + "/index.html", "utf8", function (err, html) {
      page = html.replace("{{slider}}", images);
    });
  });

server.get("/", (req, res) => {
  res.send(page);
});

server.post("/contact", (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    to: process.env.GMAIL_USER,
    subject: `CONTACT: ${req.body.name} » ${
      req.body.event_type
    } on ${formatDate(req.body.date)}`,
    html: `<table style="width:100%; border-collapse: collapse;">
    <tr style="border: 1px solid #BBB;"><td style="border-right: 1px solid #BBB; padding: 5px; width: 200px; font-weight: bold;">Sender</td><td style="padding: 5px;">${
      req.body.name
    } (${req.body.email})</td></tr>
    <tr style="border: 1px solid #BBB;"><td style="border-right: 1px solid #BBB; padding: 5px; width: 200px; font-weight: bold;">Phone</td><td style="padding: 5px;">${
      req.body.phone
    }</td></tr>
    <tr style="border: 1px solid #BBB;"><td style="border-right: 1px solid #BBB; padding: 5px; width: 200px; font-weight: bold;">Event Type</td><td style="padding: 5px;">${
      req.body.event_type
    }</td></tr>
    <tr style="border: 1px solid #BBB;"><td style="border-right: 1px solid #BBB; padding: 5px; width: 200px; font-weight: bold;">Event Date</td><td style="padding: 5px;">${formatDate(
      req.body.date
    )}</td></tr>
    <tr style="border: 1px solid #BBB;"><td style="border-right: 1px solid #BBB; padding: 5px; width: 200px; font-weight: bold;">Event Location</td><td style="padding: 5px;">${
      req.body.location
    }</td></tr>
    <tr style="border: 1px solid #BBB;"><td style="border-right: 1px solid #BBB; padding: 5px; width: 200px; font-weight: bold;">Message</td><td style="padding: 5px;">${
      req.body.message
    }</td></tr>
    </table>`,
  };

  // Attempt to send the email
  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.render("contact-failure"); // Show a page indicating failure
    } else {
      res.render("contact-success"); // Show a page indicating success
    }
  });
});

module.exports = server;
