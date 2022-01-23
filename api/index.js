const express = require("express");
var cors = require("cors");
const connection = require("./connection");

// Routes declaration
const userRoute = require("./routes/user");
const clientRoute = require("./routes/client");
const phoneRoute = require("./routes/phone");
const repairRoute = require("./routes/repair");

// Express Backend
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routes Uses
app.use("/user", userRoute);
app.use("/client", clientRoute);
app.use("/phone", phoneRoute);
app.use("/repair", repairRoute);

// Export main backend module
module.exports = app;