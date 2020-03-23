const app = express();
const express = require("express");
const initDatabase = require("./db");
const initGraphql = require("./graphql");

initDatabase();
initGraphql(app);

// error handler
app.use(function(err, req, res) {
	console.error(err);
	res.status(500);
	res.send(err);
});

module.exports = app;
