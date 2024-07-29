const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const app = express();

// Middleware setup
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static('uploads'));//this made it work


// CORS setup
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Allow requests from this origin, or
  // origin: "*" => for any origin
}));

// Mongoose setup
mongoose.connect("mongodb://localhost:27017/REGISTER");
const db = mongoose.connection;
db.once("open", () => {
  console.log("Database connected");
});

// Schema definition
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
    validate: (v) => v > 18 && v < 65,
  },
  password: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model("users", userSchema);

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/post", upload.single("file"), async (req, res) => {
  try {
    const user = new Users({
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
      password: req.body.password,
      imagePath: req.file.path,
    });

    await user.save();

    console.log("User saved:", user);
    res.send("Student Profile Created");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Error saving user");
  }
});

app.post("/api/uploads", upload.single("file"), (req, res) => {
  res.json(req.file);
});

// TO GET FILES FROM UPLOADS DIRECTORY
// app.get("/media", (req, res) => {
//   const directoryPath = path.join(__dirname, "uploads");

//   fs.readdir(directoryPath, (err, files) => {
//     if (err) {
//       console.error("Error reading directory:", err);
//       return res.status(500).send("Error reading directory");
//     }

//     // Filter files to include MP4, PNG and JPG files
//     const mediaFiles = files.filter((file) => {
//       const ext = path.extname(file).toLowerCase();
//       return ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".mp4";
//     });

//     // Map filenames to full URLs with type information
//     const mediaUrls = mediaFiles.map((file) => {
//       const ext = path.extname(file).toLowerCase();
//       const type = ext === ".mp4" ? 'video' : 'image'; // Determine media type
//       return {
//         name: file,
//         url: `http://localhost:3005/uploads/${file}`,
//         type: type
//       };
//     });

//     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");

//     res.json(fileUrls);
//   });
// });


app.get("/media", (req, res) => {
  const directoryPath = path.join(__dirname, "uploads");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).send("Error reading directory");
    }

    // Filter files to include images (PNG, JPG, JPEG) and videos (MP4)
    const mediaFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".mp4";
    });

    // Map filenames to full URLs with type information
    const mediaUrls = mediaFiles.map((file) => {
      const ext = path.extname(file).toLowerCase();
      const type = ext === ".mp4" ? 'video' : 'image'; // Determine media type
      return {
        name: file,
        url: `http://localhost:3005/uploads/${file}`,
        type: type
      };
    });

    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");

    res.json(mediaUrls);
  });
});


const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
