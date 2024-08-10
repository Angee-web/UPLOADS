# UPLOADS
# UPLOADS

This mini project sets up an Express.js application with file upload capabilities and MongoDB integration. 

1. Dependencies
express: Framework for building web applications.
mongoose: MongoDB object modeling tool.
multer: Middleware for handling file uploads.
path: Provides utilities for working with file and directory paths.
body-parser: Middleware for parsing request bodies (note: now included in Express by default).
cors: Middleware for enabling Cross-Origin Resource Sharing.
fs: Node.js module for interacting with the filesystem.

2. Multer Setup
storage: Defines how and where uploaded files are stored. Files are stored in the uploads directory, with their original names.
upload: Creates an instance of multer configured with the storage settings.

3. Express App Configuration
Static Files: Serves static files from the public directory.
Body Parser: Parses JSON and URL-encoded request bodies.
CORS: Configured to allow requests from http://127.0.0.1:5500. This can be modified to allow different origins or all origins.

4. MongoDB Setup
mongoose.connect: Connects to a local MongoDB database named REGISTER.
db.once: Logs a message when the database connection is successfully opened.

5. Mongoose Schema and Model
userSchema: Defines the schema for user documents, including fields for email, name, age, and password. The age field includes a custom validation function.
Users: Model created from the schema to interact with the users collection in MongoDB.

6. Routes
GET /: Serves the index.html file from the root directory.
POST /post: Handles form submissions, saving user data and uploaded file information to MongoDB.
POST /api/uploads: Handles file uploads and returns metadata about the uploaded file.
GET /media: Reads the uploads directory and returns a JSON response with URLs and types of media files (images and videos).

7. Server
app.listen: Starts the server on port 3005 (or an environment-specified port), logging a message to indicate the server is running.

Additional Notes:
Error Handling: There is basic error handling in place for saving users and reading directories.
CORS Headers: Ensure you set the appropriate headers if you’re accessing the API from a different origin.

This setup allows for file uploads, serves static files, interacts with a MongoDB database, and handles basic media file management.