process.env.NODE_ENV !== "production" && require("dotenv").config();
const express = require("express");
const sgMail = require("@sendgrid/mail");
const server = require("./server");
const imageComponent = require("./utils/imageComponent");
const formatDate = require("./utils/formatDate");
const mailBody = require("./utils/mailBody");
var path = require("path");
var sizeOf = require("image-size");

sgMail.setApiKey(process.env.SG_API_KEY);

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
server.use(express.static(path.join(__dirname, "pages")));

let page = "";
let images = "";

fs.promises
  .readdir(imgDir)
  .then((files) => {
    for (file of files) {
      var size = sizeOf("img/optimized/JPEG/" + file);
      images += imageComponent(file, size);
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
  const mail = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `CONTACT: ${req.body.name} » ${
      req.body.event_type
    } on ${formatDate(req.body.date)}`,
    html: mailBody(req),
  };

  sgMail
    .send(mail)
    .then((response) => {
      res.sendFile(path.join(__dirname + "/pages/email-success.html"));
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
      res.sendFile(path.join(__dirname + "/pages/email-error.html"));
    });
});

module.exports = server;
