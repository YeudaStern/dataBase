const express = require("express");

const session = require("express-session");
// Extract the filename from a file path
const path = require("path");
// Create an HTTP server that listens to server ports and gives a response back to the client.
const http = require("http");

const bodyParser = require('body-parser');

const cors = require("cors");


const { routesInit } = require("./routes/configRoutes");
const { required } = require("joi");
require("./db/mongoConnect");

const app = express();


app.use(cors());


app.use(express.json());


const sess = {
  secret: 'keyboard cat',
  cookie: {}
}



app.use(session(sess))

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));


routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || 3002;

server.listen(port);
