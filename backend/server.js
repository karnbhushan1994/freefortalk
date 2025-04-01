const express = require('express');
// Express is a web framework for Node.js used to build APIs and web applications easily.

const mongoose = require('mongoose');
// Mongoose is an ODM (Object Data Modeling) library for MongoDB, allowing you to define schemas and interact with the database using models.

const cors = require('cors');
// CORS (Cross-Origin Resource Sharing) is a middleware used to allow or restrict resources on a web server depending on the origin of the request.
// It's useful when your frontend and backend are running on different domains/ports.

const dotenv = require('dotenv');
// dotenv is used to load environment variables from a `.env` file into `process.env`, helping to manage configuration settings securely.

const http = require('http');
// The built-in `http` module is used to create an HTTP server, needed when integrating with Socket.IO or for more control over the server setup.

const { Server } = require('socket.io');
// This imports the `Server` class from `socket.io`, used to create a real-time WebSocket server for handling live, bi-directional communication.


dotenv.config();
// Load environment variables from .env file

const app = express();
// Create an instance of Express
const server = http.createServer(app);
// Create an HTTP server using the Express app
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
}); 

// Create a Socket.IO server with CORS settings to allow requests from any origin
// This is important for real-time communication between the server and clients.    

const PORT = process.env.PORT || 5000;
// Set the port for the server to listen on, defaulting to 5000 if not specified in environment variables

const MONGO_URI = process.env.MONGO_URI;
// MongoDB connection URI from environment variables

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));



// Connect to MongoDB using Mongoose with error handling
// This establishes a connection to the MongoDB database using the URI specified in the environment variables.
// It also handles connection success and error events to log the status in the console.

app.use(cors());
// Use CORS middleware to allow cross-origin requests       
// This is important when your frontend and backend are running on different domains/ports.
app.use(express.json());
// Use JSON middleware to parse incoming request bodies in JSON format
// This is important for handling JSON data sent from the client to the server.
app.use(express.urlencoded({ extended: true }));
// Use URL-encoded middleware to parse incoming request bodies in URL-encoded format
// This is important for handling form submissions and URL-encoded data sent from the client to the server.

app.use(express.static('public'));
// Serve static files from the "public" directory  
// This is useful for serving frontend assets like HTML, CSS, and JavaScript files directly from the server.

app.get('/', (req, res) => {
  res.send('Server is running...');
});
// Define a simple GET route for the root URL that responds with a message  

// This is useful for checking if the server is running and responding correctly.

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    // Start the server and listen on the specified port
})