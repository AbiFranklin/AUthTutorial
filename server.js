const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const checkScope = require("express-jwt-authz");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
});

const app = express();

app.get("/courses", checkJwt, checkScope(["read:courses"]), (req, res) => {
  res.json({
    courses: [
      { id: 1, title: "Course 1" },
      { id: 2, title: "Course 2" },
      { id: 3, title: "Course 3" },
      { id: 4, title: "Course 4" },
      { id: 5, title: "Course 5" }
    ]
  });
});

app.get("/public", (req, res) => {
  res.json({ message: "Hello from a public API." });
});

app.get("/private", checkJwt, (req, res) => {
  res.json({ message: "Hello from a private API." });
});

app.listen(3001);
console.log("API  server listening on " + process.env.REACT_APP_AUTH0_AUDIENCE);
