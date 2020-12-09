const express = require("express");
const server = express();

const PORT = process.env.port || 5000;

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

module.exports = server;
