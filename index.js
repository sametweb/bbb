const express = require("express");
const server = require("./server");
const extractName = require("./utils/extractName");

const fs = require("fs");

const imgPath = "/img/";
const cssPath = "/css/";
const optimizedPath = imgPath + "optimized/JPEG/";
const imgDir = __dirname + optimizedPath;

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

module.exports = server;
