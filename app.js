const express = require("express");
const path = require("path");
const http = require("http");
const {routesInit} = require("./routes/config_routes")
require("./db/mongoConnect");

const app = express();

// כדי שנוכל לקבל מצד  לקוח מידע בפוסט בבאדי
app.use(express.json());

// הגדרת תקיית הפאבליק כתקייה ראשית
app.use(express.static(path.join(__dirname,"public")))

routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || 3003
server.listen(port);