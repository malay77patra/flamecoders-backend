require('module-alias/register');
const express = require("express");
const { urlencoded } = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("@db/connect");
const routes = require("@routes");

// Load environment variables
dotenv.config();

// Definations
const isProduction = process.argv.includes('--env=production');
const app = express();
const PORT = process.env.PORT || 8000;


// Using middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(routes);

// Test route
app.get('/', (req, res) => {
    res.send("Server Online!");
});


// Connecting to MongoDB, then start the server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            if (isProduction) {
                console.log(`Server listening on port ${PORT}`);
            } else {
                console.log(`Server listening on port ${PORT}\n➜  Visit : http://localhost:${PORT}`);
            }
        });
    })
    .catch((error) => {
        console.log(error);
        console.log("MongoDB connection failed");
    });