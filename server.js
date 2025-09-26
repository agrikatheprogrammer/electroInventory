const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Your categories array
const categories = require("./categories.json"); 

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// API: list categories
app.get("/api/categories", (req, res) => {
  res.json(categories);
});

// API: list images in a category dynamically
app.get("/api/images/:folder", (req, res) => {
  const folder = req.params.folder;
  const category = categories.find(c => c.folder === folder);
  if (!category) return res.status(404).json({ error: "Category not found" });

  const folderPath = path.join(__dirname, "public", "images", folder);

  // Read actual files in the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read folder" });
    }

    // Filter only .jpg (or .png) files
    const images = files
      .filter(file => /\.jpg$/i.test(file))
      .map(file => `/images/${folder}/${file}`); // return URL for browser

    res.json(images);
  });
});

// Route: detail page
app.get("/items/:folder", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "detail.html"));
});

// 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});
