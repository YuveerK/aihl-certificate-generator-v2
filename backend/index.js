// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors()); // Enable CORS for all routes

function organizeFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;

        if (stats.isFile()) {
          const folderName = file.split(".").slice(0, -1).join(".");
          const folderPath = path.join(directory, folderName);

          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
          }

          fs.rename(filePath, path.join(folderPath, file), (err) => {
            if (err) throw err;
          });
        }
      });
    });
  });
}

app.get("/organize-files", (req, res) => {
  const directory =
    "C:/Users/yuvee/OneDrive/Documents/AIHL/generated-certificates"; // Replace with your directory
  organizeFiles(directory);
  res.send("Files organized");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
