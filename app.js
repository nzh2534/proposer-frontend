const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000; // Heroku will need the PORT environment variable

app.use(express.static(path.join(__dirname, "build")));

app.listen(port, () => console.log(`App is live on port ＄{port}!`));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});
